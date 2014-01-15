<?php 
/**
 *	com_bix_printshop - Online-PrintStore for Joomla
 *  Copyright (C) 2014 Matthijs Alles
 *	Bixie.nl
 *
 */
class bixConfig {
	public $allowedIPs = array(
		'93.186.181.195', //dwc server
		'77.175.3.154' //bixie home
	);
	public $downloadPath = '/public/documents';
	public $currentVersion = '1.0.5';
}

$bixConfig = new bixConfig;
