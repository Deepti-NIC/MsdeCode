<?php
/**
 * @file
 * Custom Block
 */
namespace Drupal\cmf_design\Plugin\Block;
use Drupal\Core\Block\BlockBase;
/**
 * Provides a 'CMF Design Structure For Footer' block.
 *
 * @Block(
 *   id = "cmf_design_footer",
 *   admin_label = @Translation("CMF Design footer"),
 *   category = @Translation("Content"),
 * )
 */
class CmfDesignFooterBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
	public function build() {
		global $base_url;
		$settings = \Drupal::config('cmf_content.settings');
		$variables['footer_sitename'] = $settings->get('footer_sitename');	  
		/* Footer Content */
		$variables['stqc_certificate'] = $settings->get('stqc_certificate');	
		$str = '         
			 <div class="footer-bottom-wrapper">
				<div class="container common-container four_content footer-bottom-container">
				   <div class="footer-content clearfix">
					  <div class="copyright-content"> Website Content Owned by  <strong>'.$variables['footer_sitename'].'</strong> <span>Designed, Developed and Hosted by <a target="_blank" title="NIC, External Link that opens in a new window" href="http://www.nic.in/"><strong>National Informatics Centre</strong></a><strong> ( NIC )</strong></span> <span>  All rights reserved</span>
					  </div>
					  <div class="logo-cmf"> <a target="_blank" href="http://cmf.gov.in/" title="External link that opens in new tab"><img alt="cmf logo" src="'.$base_url.'/'.drupal_get_path('module', 'cmf_design').'/images/cmf-logo.png"></a> </div>
					
  				

				   </div>
				</div>
			 </div>
		 ';

		//$str = 'TESTTTTTTTTTTTTTTTTTTTTTT';
		return array(
		  '#type' => 'markup',
		  '#markup' => $str,
		);
	}
}
