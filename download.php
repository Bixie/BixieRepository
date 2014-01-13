<?php 
/**
 *	com_bix_printshop - Online-PrintStore for Joomla
 *  Copyright (C) 2010-2012 Matthijs Alles
 *	Bixie.nl
 *
 */

include_once 'config.php';

$referer = $_SERVER['HTTP_REFERER'];
$remoteIP = $_SERVER['REMOTE_ADDR'];

if (empty($referer) && in_array($remoteIP,$bixConfig->allowedIPs)) {
	$folder = $_GET['type'];
	$file = $_GET['file'];
	$filePath = $bixConfig->downloadPath.'/'.$folder.'/'.$file;
	if (file_exists($filePath)) {
		//log download 
		$log = date('d-m-Y H:i:s').' - '.$remoteIP."\n" ;
		file_put_contents(dirname(__FILE__).'/download'.date('Ym').'.log',$log,FILE_APPEND);
		clearstatcache();
		if (ob_get_contents()) ob_end_clean();
		header('Content-Description: File Transfer');
		header('Content-Type: application/zip');
		header('Content-Disposition: attachment; filename='.$file);
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Pragma: public');
		header('Content-Length: ' . filesize($filePath));
		if (ob_get_contents()) ob_clean();
		flush();
		readfile($filePath);

		exit;
		
	} else {
		header('HTTP/1.0 404 Not Found');
		die;
	}
} else {
	header('HTTP/1.0 403 No Access');
	die;
}
