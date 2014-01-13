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
	//log request 
	$log = date('d-m-Y H:i:s').' - '.$remoteIP."\n" ;
	file_put_contents(dirname(__FILE__).'/validlog'.date('Ym').'.log',$log,FILE_APPEND);
	header("Content-type: text/xml; charset=utf-8");
	echo '<?xml version="1.0" encoding="utf-8"?>';
	?>
	<updates>
		<update>
			<name>Bixie Printshop <?php echo $bixConfig->currentVersion; ?></name>
			<description>Bixie Printshop, online printstore</description>
			<element>com_bixprintshop</element>
			<type>component</type>
			<version><?php echo $bixConfig->currentVersion; ?></version>
			<infourl title="Bixie Printshop">http://www.bixie.nl/bixie-printshop</infourl>
			<downloads>
				<downloadurl type="full" format="zip">http://www.bixie.nl/updates/download.php?type=component&amp;file=com_bixprintshop_<?php echo $bixConfig->currentVersion; ?>.zip</downloadurl>
			</downloads>
			<maintainer>Matthijs Alles</maintainer>
			<maintainerurl>http://www.bixie.nl</maintainerurl>
			<targetplatform name="joomla" version="2.5"/>
		 </update>
	 </updates>
	<?php
} else { 
	//log boef 
	$log = date('d-m-Y H:i:s').' - '.$remoteIP."\n" ;
	file_put_contents(dirname(__FILE__).'/boeflog'.date('Ym').'.log',$log,FILE_APPEND);
	//standaard oude versie, hou updater alive
	header("Content-type: text/xml; charset=utf-8");
	echo '<?xml version="1.0" encoding="utf-8"?>';
	?>
	<updates>
		<update>
			<name>Bixie Printshop 1.0.0</name>
			<description>Bixie Printshop, online printstore</description>
			<element>com_bixprintshop</element>
			<type>component</type>
			<version>1.0.0</version>
			<infourl title="Bixie Printshop">http://www.bixie.nl/bixie-printshop</infourl>
			<downloads>
				<downloadurl type="full" format="zip">http://www.bixie.nl/bixie-printshop</downloadurl>
			</downloads>
			<tags>
				<tag>dev</tag>
			</tags>
			<maintainer>Matthijs Alles</maintainer>
			<maintainerurl>http://www.bixie.nl</maintainerurl>
			<targetplatform name="joomla" version="2.5"/>
		 </update>
	 </updates>
	<?php
}
