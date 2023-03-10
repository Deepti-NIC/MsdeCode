<?php

/**
 * @file
 * Views hook implementations for the Search API module.
 */

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\Core\Field\TypedData\FieldItemDataDefinition;
use Drupal\Core\TypedData\DataDefinitionInterface;
use Drupal\Core\TypedData\DataReferenceDefinitionInterface;
use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\Entity\Index;
use Drupal\search_api\Item\FieldInterface;
use Drupal\search_api\SearchApiException;
use Drupal\search_api\Utility\Utility;

/**
 * Implements hook_views_data().
 *
 * For each search index, we provide the following tables:
 * - One base table, with key "search_api_index_INDEX", which contains field,
 *   filter, argument and sort handlers for all indexed fields. (Field handlers,
 *   too, to allow things like click-sorting.)
 * - Tables for each datasource, by default with key
 *   "search_api_datasource_INDEX_DATASOURCE", with field and (where applicable)
 *   relationship handlers for each property of the datasource. Those will be
 *   joined to the index base table by default.
 *
 * Also, for each entity type encountered in any table, a table with
 * field/relationship handlers for all of that entity type's properties is
 * created. Those tables will use the key "search_api_entity_ENTITY".
 */
function search_api_views_data() {
  $data = [];

  /** @var \Drupal\search_api\IndexInterface $index */
  foreach (Index::loadMultiple() as $index) {
    try {
      // Fill in base data.
      $key = 'search_api_index_' . $index->id();
      $table = &$data[$key];
      $index_label = $index->label();
      $table['table']['group'] = t('Index @name', ['@name' => $index_label]);
      $table['table']['base'] = [
        'field' => 'search_api_id',
        'index' => $index->id(),
        'title' => t('Index @name', ['@name' => $index_label]),
        'help' => t('Use the @name search index for filtering and retrieving data.', ['@name' => $index_label]),
        'query_id' => 'search_api_query',
      ];

      // Add suitable handlers for all indexed fields.
      foreach ($index->getFields(TRUE) as $field_id => $field) {
        $field_alias = _search_api_views_find_field_alias($field_id, $table);
        $field_definition = _search_api_views_get_handlers($field);
        // The field handler has to be extra, since it is a) determined by the
        // field's underlying property and b) needs a different "real field"
        // set.
        if ($field->getPropertyPath()) {
          $field_handler = _search_api_views_get_field_handler_for_property($field->getDataDefinition(), $field->getPropertyPath());
          if ($field_handler) {
            $field_definition['field'] = $field_handler;
            $field_definition['field']['real field'] = $field->getCombinedPropertyPath();
            $field_definition['field']['search_api field'] = $field_id;
          }
        }
        if ($field_definition) {
          $field_label = $field->getLabel();
          $field_definition += [
            'title' => $field_label,
            'help' => $field->getDescription() ?: t('(No description available)'),
          ];
          if ($datasource = $field->getDatasource()) {
            $field_definition['group'] = t('@datasource datasource', ['@datasource' => $datasource->label()]);
          }
          if ($field_id != $field_alias) {
            $field_definition['real field'] = $field_id;
          }
          if (isset($field_definition['field'])) {
            $field_definition['field']['title'] = t('@field (indexed field)', ['@field' => $field_label]);
          }
          $table[$field_alias] = $field_definition;
        }
      }

      // Add special fields.
      _search_api_views_data_special_fields($table);

      // Add relationships for field data of all datasources.
      $datasource_tables_prefix = 'search_api_datasource_' . $index->id() . '_';
      foreach ($index->getDatasources() as $datasource_id => $datasource) {
        $table_key = _search_api_views_find_field_alias($datasource_tables_prefix . $datasource_id, $data);
        $data[$table_key] = _search_api_views_datasource_table($datasource, $data);
        // Automatically join this table for views of this index.
        $data[$table_key]['table']['join'][$key] = [
          'join_id' => 'search_api',
        ];
      }
    }
    catch (\Exception $e) {
      $args = [
        '%index' => $index->label(),
      ];
      watchdog_exception('search_api', $e, '%type while computing Views data for index %index: @message in %function (line %line of %file).', $args);
    }
  }

  return array_filter($data);
}

/**
 * Implements hook_views_plugins_cache_alter().
 */
function search_api_views_plugins_cache_alter(array &$plugins) {
  // Collect all base tables provided by this module.
  $bases = [];
  /** @var \Drupal\search_api\IndexInterface $index */
  foreach (Index::loadMultiple() as $index) {
    $bases[] = 'search_api_index_' . $index->id();
  }
  $plugins['search_api_tag']['base'] = $bases;
  $plugins['search_api_time']['base'] = $bases;
}

/**
 * Implements hook_views_plugins_row_alter().
 */
function search_api_views_plugins_row_alter(array &$plugins) {
  // Collect all base tables provided by this module.
  $bases = [];
  /** @var \Drupal\search_api\IndexInterface $index */
  foreach (Index::loadMultiple() as $index) {
    $bases[] = 'search_api_index_' . $index->id();
  }
  $plugins['search_api']['base'] = $bases;
}

/**
 * Finds an unused field alias for a field in a Views table definition.
 *
 * @param string $field_id
 *   The original ID of the Search API field.
 * @param array $table
 *   The Views table definition.
 *
 * @return string
 *   The field alias to use.
 */
function _search_api_views_find_field_alias($field_id, array &$table) {
  $base = $field_alias = preg_replace('/[^a-zA-Z0-9]+/S', '_', $field_id);
  $i = 0;
  while (isset($table[$field_alias])) {
    $field_alias = $base . '_' . ++$i;
  }
  return $field_alias;
}

/**
 * Returns the Views handlers to use for a given field.
 *
 * @param \Drupal\search_api\Item\FieldInterface $field
 *   The field to add to the definition.
 *
 * @return array
 *   The Views definition to add for the given field.
 */
function _search_api_views_get_handlers(FieldInterface $field) {
  $mapping = _search_api_views_handler_mapping();

  try {
    $types = [];

    $definition = $field->getDataDefinition();
    if ($definition->getSetting('target_type')) {
      $types[] = 'entity:' . $definition->getSetting('target_type');
      $types[] = 'entity';
    }

    if ($definition->getSetting('allowed_values')) {
      $types[] = 'options';
    }

    $types[] = $field->getType();
    /** @var \Drupal\search_api\DataType\DataTypeInterface $data_type */
    $data_type = \Drupal::service('plugin.manager.search_api.data_type')->createInstance($field->getType());
    if (!$data_type->isDefault()) {
      $types[] = $data_type->getFallbackType();
    }

    foreach ($types as $type) {
      if (isset($mapping[$type])) {
        _search_api_views_handler_adjustments($type, $field, $mapping[$type]);
        return $mapping[$type];
      }
    }
  }
  catch (SearchApiException $e) {
    $vars['%index'] = $field->getIndex()->label();
    $vars['%field'] = $field->getPrefixedLabel();
    watchdog_exception('search_api', $e, '%type while adding Views handlers for field %field on index %index: @message in %function (line %line of %file).', $vars);
  }

  return [];
}

/**
 * Determines the mapping of Search API data types to their Views handlers.
 *
 * @return array
 *   An associative array with data types as the keys and Views field data
 *   definitions as the values. In addition to all normally defined data types,
 *   keys can also be "options" for any field with an options list, "entity" for
 *   general entity-typed fields or "entity:ENTITY_TYPE" (with "ENTITY_TYPE"
 *   being the machine name of an entity type) for entities of that type.
 *
 * @see search_api_views_handler_mapping_alter()
 */
function _search_api_views_handler_mapping() {
  $mapping = &drupal_static(__FUNCTION__);

  if (!isset($mapping)) {
    $mapping = [
      'boolean' => [
        'argument' => [
          'id' => 'search_api',
        ],
        'filter' => [
          'id' => 'search_api_boolean',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'date' => [
        'argument' => [
          'id' => 'search_api_date',
        ],
        'filter' => [
          'id' => 'search_api_date',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'decimal' => [
        'argument' => [
          'id' => 'search_api',
          'filter' => 'floatval',
        ],
        'filter' => [
          'id' => 'search_api_numeric',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'integer' => [
        'argument' => [
          'id' => 'search_api',
          'filter' => 'intval',
        ],
        'filter' => [
          'id' => 'search_api_numeric',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'string' => [
        'argument' => [
          'id' => 'search_api',
        ],
        'filter' => [
          'id' => 'search_api_string',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'text' => [
        'argument' => [
          'id' => 'search_api',
        ],
        'filter' => [
          'id' => 'search_api_text',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'options' => [
        'argument' => [
          'id' => 'search_api',
        ],
        'filter' => [
          'id' => 'search_api_options',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'entity:taxonomy_term' => [
        'argument' => [
          'id' => 'search_api_term',
        ],
        'filter' => [
          'id' => 'search_api_term',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'entity:user' => [
        'argument' => [
          'id' => 'search_api',
          'filter' => 'intval',
        ],
        'filter' => [
          'id' => 'search_api_user',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
      'entity:node_type' => [
        'argument' => [
          'id' => 'search_api',
        ],
        'filter' => [
          'id' => 'search_api_options',
          'options callback' => 'node_type_get_names',
        ],
        'sort' => [
          'id' => 'search_api',
        ],
      ],
    ];

    $alter_id = 'search_api_views_handler_mapping';
    \Drupal::moduleHandler()->alter($alter_id, $mapping);
  }

  return $mapping;
}

/**
 * Makes necessary, field-specific adjustments to Views handler definitions.
 *
 * @param string $type
 *   The type of field, as defined in _search_api_views_handler_mapping().
 * @param \Drupal\search_api\Item\FieldInterface $field
 *   The field whose handler definitions are being created.
 * @param array $definitions
 *   The handler definitions for the field, as a reference.
 */
function _search_api_views_handler_adjustments($type, FieldInterface $field, array &$definitions) {
  // By default, all fields can be empty (or at least have to be treated that
  // way by the Search API).
  if (!isset($definitions['filter']['allow empty'])) {
    $definitions['filter']['allow empty'] = TRUE;
  }

  // For taxonomy term references, set the referenced vocabulary.
  $data_definition = $field->getDataDefinition();
  if ($type == 'entity:taxonomy_term') {
    if (isset($data_definition->getSettings()['handler_settings']['target_bundles'])) {
      $target_bundles = $data_definition->getSettings()['handler_settings']['target_bundles'];
      if (count($target_bundles) == 1) {
        $definitions['filter']['vocabulary'] = reset($target_bundles);
      }
    }
  }
  elseif ($type == 'options') {
    if ($data_definition instanceof FieldItemDataDefinition) {
      // If this is a normal Field API field, dynamically retrieve the options
      // list at query time.
      $field_definition = $data_definition->getFieldDefinition();
      $bundle = $field_definition->getTargetBundle();
      $field_name = $field_definition->getName();
      $entity_type = $field_definition->getTargetEntityTypeId();
      $definitions['filter']['options callback'] = '_search_api_views_get_allowed_values';
      $definitions['filter']['options arguments'] = [$entity_type, $bundle, $field_name];
    }
    else {
      // Otherwise, include the options list verbatim in the Views data, unless
      // it's too big (or doesn't look valid).
      $options = $data_definition->getSetting('allowed_values');
      if (is_array($options) && count($options) <= 50) {
        // Since the Views InOperator filter plugin doesn't allow just including
        // the options in the definition, we use this workaround.
        $definitions['filter']['options callback'] = 'array_filter';
        $definitions['filter']['options arguments'] = [$options];
      }
    }
  }
}

/**
 * Adds definitions for our special fields to a Views data table definition.
 *
 * @param array $table
 *   The existing Views data table definition.
 */
function _search_api_views_data_special_fields(array &$table) {
  $id_field = _search_api_views_find_field_alias('search_api_id', $table);
  $table[$id_field]['title'] = t('Item ID');
  $table[$id_field]['help'] = t("The item's internal (Search API-specific) ID");
  $table[$id_field]['field']['id'] = 'standard';
  $table[$id_field]['sort']['id'] = 'search_api';
  if ($id_field != 'search_api_id') {
    $table[$id_field]['real field'] = 'search_api_id';
  }

  $datasource_field = _search_api_views_find_field_alias('search_api_datasource', $table);
  $table[$datasource_field]['title'] = t('Datasource');
  $table[$datasource_field]['help'] = t("The data source ID");
  $table[$datasource_field]['argument']['id'] = 'search_api';
  $table[$datasource_field]['argument']['disable_break_phrase'] = TRUE;
  $table[$datasource_field]['field']['id'] = 'standard';
  $table[$datasource_field]['filter']['id'] = 'search_api_datasource';
  $table[$datasource_field]['sort']['id'] = 'search_api';
  if ($datasource_field != 'search_api_datasource') {
    $table[$datasource_field]['real field'] = 'search_api_datasource';
  }

  $language_field = _search_api_views_find_field_alias('search_api_language', $table);
  $table[$language_field]['title'] = t('Item language');
  $table[$language_field]['help'] = t("The item's language");
  $table[$language_field]['field']['id'] = 'language';
  $table[$language_field]['filter']['id'] = 'search_api_language';
  $table[$language_field]['filter']['allow empty'] = FALSE;
  $table[$language_field]['sort']['id'] = 'search_api';
  if ($language_field != 'search_api_language') {
    $table[$language_field]['real field'] = 'search_api_language';
  }

  $relevance_field = _search_api_views_find_field_alias('search_api_relevance', $table);
  $table[$relevance_field]['group'] = t('Search');
  $table[$relevance_field]['title'] = t('Relevance');
  $table[$relevance_field]['help'] = t('The relevance of this search result with respect to the query');
  $table[$relevance_field]['field']['type'] = 'decimal';
  $table[$relevance_field]['field']['id'] = 'numeric';
  $table[$relevance_field]['field']['search_api field'] = 'search_api_relevance';
  $table[$relevance_field]['sort']['id'] = 'search_api';
  if ($relevance_field != 'search_api_relevance') {
    $table[$relevance_field]['real field'] = 'search_api_relevance';
  }

  $excerpt_field = _search_api_views_find_field_alias('search_api_excerpt', $table);
  $table[$excerpt_field]['group'] = t('Search');
  $table[$excerpt_field]['title'] = t('Excerpt');
  $table[$excerpt_field]['help'] = t('The search result excerpted to show found search terms');
  $table[$excerpt_field]['field']['id'] = 'search_api';
  $table[$excerpt_field]['field']['filter_type'] = 'xss';
  if ($excerpt_field != 'search_api_excerpt') {
    $table[$excerpt_field]['real field'] = 'search_api_excerpt';
  }

  $fulltext_field = _search_api_views_find_field_alias('search_api_fulltext', $table);
  $table[$fulltext_field]['group'] = t('Search');
  $table[$fulltext_field]['title'] = t('Fulltext search');
  $table[$fulltext_field]['help'] = t('Search several or all fulltext fields at once.');
  $table[$fulltext_field]['filter']['id'] = 'search_api_fulltext';
  $table[$fulltext_field]['argument']['id'] = 'search_api_fulltext';
  if ($fulltext_field != 'search_api_fulltext') {
    $table[$fulltext_field]['real field'] = 'search_api_fulltext';
  }

  $mlt_field = _search_api_views_find_field_alias('search_api_more_like_this', $table);
  $table[$mlt_field]['group'] = t('Search');
  $table[$mlt_field]['title'] = t('More like this');
  $table[$mlt_field]['help'] = t('Find similar content.');
  $table[$mlt_field]['argument']['id'] = 'search_api_more_like_this';
  if ($mlt_field != 'search_api_more_like_this') {
    $table[$mlt_field]['real field'] = 'search_api_more_like_this';
  }

  // @todo Add an "All taxonomy terms" contextual filter (if applicable).
}

/**
 * Creates a Views table definition for one datasource of an index.
 *
 * @param \Drupal\search_api\Datasource\DatasourceInterface $datasource
 *   The datasource for which to create a table definition.
 * @param array $data
 *   The existing Views data definitions. Passed by reference so additionally
 *   needed tables can be inserted.
 *
 * @return array
 *   A Views table definition for the given datasource.
 */
function _search_api_views_datasource_table(DatasourceInterface $datasource, array &$data) {
  $datasource_id = $datasource->getPluginId();
  $table = [
    'table' => [
      'group' => t('@datasource datasource', ['@datasource' => $datasource->label()]),
      'index' => $datasource->getIndex()->id(),
      'datasource' => $datasource_id,
    ],
  ];
  $entity_type_id = $datasource->getEntityTypeId();
  if ($entity_type_id) {
    $table['table']['entity type'] = $entity_type_id;
    $table['table']['entity revision'] = FALSE;
  }

  _search_api_views_add_handlers_for_properties($datasource->getPropertyDefinitions(), $table, $data);

  // Prefix the "real field" of each entry with the datasource ID.
  foreach ($table as $key => $definition) {
    if ($key == 'table') {
      continue;
    }

    $real_field = isset($definition['real field']) ? $definition['real field'] : $key;
    $table[$key]['real field'] = Utility::createCombinedId($datasource_id, $real_field);

    // Relationships sometimes have different real fields set, since they might
    // also include the nested property that contains the actual reference. So,
    // if a "real field" is set for that, we need to adapt it as well.
    if (isset($definition['relationship']['real field'])) {
      $real_field = $definition['relationship']['real field'];
      $table[$key]['relationship']['real field'] = Utility::createCombinedId($datasource_id, $real_field);
    }
  }

  return $table;
}

/**
 * Creates a Views table definition for an entity type.
 *
 * @param string $entity_type_id
 *   The ID of the entity type.
 * @param array $data
 *   The existing Views data definitions, passed by reference.
 *
 * @return array
 *   A Views table definition for the given entity type. Or an empty array if
 *   the entity type could not be found.
 */
function _search_api_views_entity_type_table($entity_type_id, array &$data) {
  $entity_type = \Drupal::entityTypeManager()->getDefinition($entity_type_id);
  if (!$entity_type || !$entity_type->entityClassImplements(FieldableEntityInterface::class)) {
    return [];
  }

  $table = [
    'table' => [
      'group' => t('@entity_type relationship', ['@entity_type' => $entity_type->getLabel()]),
      'entity type' => $entity_type_id,
      'entity revision' => FALSE,
    ],
  ];

  $entity_field_manager = \Drupal::getContainer()->get('entity_field.manager');
  $bundle_info = \Drupal::getContainer()->get('entity_type.bundle.info');
  $properties = $entity_field_manager->getBaseFieldDefinitions($entity_type_id);
  foreach (array_keys($bundle_info->getBundleInfo($entity_type_id)) as $bundle_id) {
    $additional = $entity_field_manager->getFieldDefinitions($entity_type_id, $bundle_id);
    $properties += $additional;
  }
  _search_api_views_add_handlers_for_properties($properties, $table, $data);

  return $table;
}

/**
 * Adds field and relationship handlers for the given properties.
 *
 * @param \Drupal\Core\TypedData\DataDefinitionInterface[] $properties
 *   The properties for which handlers should be added.
 * @param array $table
 *   The existing Views data table definition, passed by reference.
 * @param array $data
 *   The existing Views data definitions, passed by reference.
 */
function _search_api_views_add_handlers_for_properties(array $properties, array &$table, array &$data) {
  $entity_reference_types = array_flip([
    'field_item:entity_reference',
    'field_item:image',
    'field_item:file',
  ]);

  foreach ($properties as $property_path => $property) {
    $key = _search_api_views_find_field_alias($property_path, $table);
    $original_property = $property;
    $property = \Drupal::getContainer()
      ->get('search_api.fields_helper')
      ->getInnerProperty($property);

    // Add a field handler, if applicable.
    $definition = _search_api_views_get_field_handler_for_property($property, $property_path);
    if ($definition) {
      $table[$key]['field'] = $definition;
    }

    // For entity-typed properties, also add a relationship to the entity type
    // table.
    if ($property instanceof FieldItemDataDefinition && isset($entity_reference_types[$property->getDataType()])) {
      $entity_type_id = $property->getSetting('target_type');
      if ($entity_type_id) {
        $entity_type_table_key = 'search_api_entity_' . $entity_type_id;
        if (!isset($data[$entity_type_table_key])) {
          // Initialize the table definition before calling
          // _search_api_views_entity_type_table() to avoid an infinite
          // recursion.
          $data[$entity_type_table_key] = [];
          $data[$entity_type_table_key] = _search_api_views_entity_type_table($entity_type_id, $data);
        }
        // Add the relationship only if we have a non-empty table definition.
        if ($data[$entity_type_table_key]) {
          // Get the entity type to determine the label for the relationship.
          $entity_type = \Drupal::entityTypeManager()
            ->getDefinition($entity_type_id);
          $entity_type_label = $entity_type ? $entity_type->getLabel() : $entity_type_id;
          $args = [
            '@label' => $entity_type_label,
            '@field_name' => $original_property->getLabel(),
          ];
          // Look through the child properties to find the data reference
          // property that should be the "real field" for the relationship.
          // (For Core entity references, this will usually be ":entity".)
          $suffix = '';
          foreach ($property->getPropertyDefinitions() as $name => $nested_property) {
            if ($nested_property instanceof DataReferenceDefinitionInterface) {
              $suffix = ":$name";
              break;
            }
          }
          $table[$key]['relationship'] = [
            'title' => t('@label referenced from @field_name', $args),
            'label' => t('@field_name: @label', $args),
            'help' => $property->getDescription() ?: t('(No description available)'),
            'id' => 'search_api',
            'base' => $entity_type_table_key,
            'entity type' => $entity_type_id,
            'entity revision' => FALSE,
            'real field' => $property_path . $suffix,
          ];
        }
      }
    }

    if (!empty($table[$key]) && empty($table[$key]['title'])) {
      $table[$key]['title'] = $original_property->getLabel();
      $table[$key]['help'] = $original_property->getDescription() ?: t('(No description available)');
      if ($key != $property_path) {
        $table[$key]['real field'] = $property_path;
      }
    }
  }
}

/**
 * Computes a handler definition for the given property.
 *
 * @param \Drupal\Core\TypedData\DataDefinitionInterface $property
 *   The property definition.
 * @param string|null $property_path
 *   (optional) The property path of the property. If set, it will be used for
 *   Field API fields to set the "field_name" property of the definition.
 *
 * @return array|null
 *   Either a Views field handler definition for this property, or NULL if the
 *   property shouldn't have one.
 *
 * @see hook_search_api_views_field_handler_mapping_alter()
 */
function _search_api_views_get_field_handler_for_property(DataDefinitionInterface $property, $property_path = NULL) {
  $mappings = _search_api_views_get_field_handler_mapping();

  // First, look for an exact match.
  $data_type = $property->getDataType();
  if (array_key_exists($data_type, $mappings['simple'])) {
    $definition = $mappings['simple'][$data_type];
  }
  else {
    // Then check all the patterns defined by regular expressions, defaulting to
    // the "default" definition.
    $definition = $mappings['default'];
    foreach (array_keys($mappings['regex']) as $regex) {
      if (preg_match($regex, $data_type)) {
        $definition = $mappings['regex'][$regex];
      }
    }
  }

  // Field items have a special handler, but need a fallback handler set to be
  // able to optionally circumvent entity field rendering. That's why we just
  // set the "field_item:???" types to their fallback handlers in
  // _search_api_views_get_field_handler_mapping(), along with non-field item
  // types, and here manually update entity field properties to have the correct
  // definition, with "search_api_field" handler, correct fallback handler and
  // "field_name" and "entity_type" correctly set.
  if (isset($definition) && $property instanceof FieldItemDataDefinition) {
    list(, $field_name) = Utility::splitPropertyPath($property_path, TRUE);
    if (!isset($definition['fallback_handler'])) {
      $definition['fallback_handler'] = $definition['id'];
      $definition['id'] = 'search_api_field';
    }
    $definition['field_name'] = $field_name;
    $definition['entity_type'] = $property
      ->getFieldDefinition()
      ->getTargetEntityTypeId();
  }

  return $definition;
}

/**
 * Retrieves the field handler mapping used by the Search API Views integration.
 *
 * @return array
 *   An associative array with three keys:
 *   - simple: An associative array mapping property data types to their field
 *     handler definitions.
 *   - regex: An array associative array mapping regular expressions for
 *     property data types to their field handler definitions, ordered by
 *     descending string length of the regular expression.
 *   - default: The default definition for data types that match no other field.
 */
function _search_api_views_get_field_handler_mapping() {
  $mappings = &drupal_static(__FUNCTION__);

  if (!isset($mappings)) {
    // First create a plain mapping and pass it to the alter hook.
    $plain_mapping = [];

    $plain_mapping['*'] = [
      'id' => 'search_api',
    ];

    $text_mapping = [
      'id' => 'search_api',
      'filter_type' => 'xss',
    ];
    $plain_mapping['field_item:text_long'] = $text_mapping;
    $plain_mapping['field_item:text_with_summary'] = $text_mapping;
    $plain_mapping['search_api_html'] = $text_mapping;
    unset($text_mapping['filter_type']);
    $plain_mapping['search_api_text'] = $text_mapping;

    $numeric_mapping = [
      'id' => 'search_api_numeric',
    ];
    $plain_mapping['field_item:integer'] = $numeric_mapping;
    $plain_mapping['field_item:list_integer'] = $numeric_mapping;
    $plain_mapping['integer'] = $numeric_mapping;
    $plain_mapping['timespan'] = $numeric_mapping;

    $float_mapping = [
      'id' => 'search_api_numeric',
      'float' => TRUE,
    ];
    $plain_mapping['field_item:decimal'] = $float_mapping;
    $plain_mapping['field_item:float'] = $float_mapping;
    $plain_mapping['field_item:list_float'] = $float_mapping;
    $plain_mapping['decimal'] = $float_mapping;
    $plain_mapping['float'] = $float_mapping;

    $date_mapping = [
      'id' => 'search_api_date',
    ];
    $plain_mapping['field_item:created'] = $date_mapping;
    $plain_mapping['field_item:changed'] = $date_mapping;
    $plain_mapping['datetime_iso8601'] = $date_mapping;
    $plain_mapping['timestamp'] = $date_mapping;

    $bool_mapping = [
      'id' => 'search_api_boolean',
    ];
    $plain_mapping['boolean'] = $bool_mapping;
    $plain_mapping['field_item:boolean'] = $bool_mapping;

    $ref_mapping = [
      'id' => 'search_api_entity',
    ];
    $plain_mapping['field_item:entity_reference'] = $ref_mapping;
    $plain_mapping['field_item:comment'] = $ref_mapping;

    // Finally, set a default handler for unknown field items.
    $plain_mapping['field_item:*'] = [
      'id' => 'search_api',
    ];

    // Let other modules change or expand this mapping.
    $alter_id = 'search_api_views_field_handler_mapping';
    \Drupal::moduleHandler()->alter($alter_id, $plain_mapping);

    // Then create a new, more practical structure, with the mappings grouped by
    // mapping type.
    $mappings = [
      'simple' => [],
      'regex' => [],
      'default' => NULL,
    ];
    foreach ($plain_mapping as $type => $definition) {
      if ($type == '*') {
        $mappings['default'] = $definition;
      }
      elseif (strpos($type, '*') === FALSE) {
        $mappings['simple'][$type] = $definition;
      }
      else {
        // Transform the type into a PCRE regular expression, taking care to
        // quote everything except for the wildcards.
        $parts = explode('*', $type);
        // Passing the second parameter to preg_quote() is a bit tricky with
        // array_map(), we need to construct an array of slashes.
        $slashes = array_fill(0, count($parts), '/');
        $parts = array_map('preg_quote', $parts, $slashes);
        // Use the "S" modifier for closer analysis of the pattern, since it
        // might be executed a lot.
        $regex = '/^' . implode('.*', $parts) . '$/S';
        $mappings['regex'][$regex] = $definition;
      }
    }
    // Finally, order the regular expressions descending by their lengths.
    $compare = function ($a, $b) {
      return strlen($b) - strlen($a);
    };
    uksort($mappings['regex'], $compare);
  }

  return $mappings;
}
