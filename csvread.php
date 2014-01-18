<?php
//read and convert CSV data
$file = 'adressenhockeyclubs.csv';
$dataRows = array();
$del = ';';
if (($handle = fopen($file, "r")) !== FALSE) {
	while ( ($data = fgetcsv($handle, 10000, $del) ) !== FALSE ) { 
		$dataRows[] = $data;
	}
	fclose($handle);
}	
$newData = array();
$i = 0;
$csv = "naam;adres;postcode;plaats;telefoon;web;mail\n";
foreach ($dataRows as $row) {
	if (!empty($row[3])) { //preformatted
		$i++;//incr voor aanmaken!
		$newData[$i] = new adres($row[0]);
		$newData[$i]->addTel($row[1]);
		$newData[$i]->addPcPlaats($row[2]);
		$newData[$i]->adres = $row[2];
		$newData[$i]->addWeb($row[3]);
		$csv .= $newData[$i]->csv();
	} else { //raw
		if (empty($row[0]) && $recordCount > 4) {
			$csv .= $newData[$i]->csv();
			$recordCount = 0;
			continue;
		}
		if ($recordCount == 0) {
			$i++;//incr voor aanmaken!
			$newData[$i] = new adres($row[0]);
			$recordCount++;
			continue;
		}
		if ($recordCount == 1) {
			$newData[$i]->addTel($row[0]);
			$recordCount++;
			continue;
		}
		if ($recordCount == 2) {
			$newData[$i]->adres = $row[0];
			$recordCount++;
			continue;
		}
		if ($recordCount == 3) {
			$newData[$i]->addPcPlaats($row[0]);
			$recordCount++;
			continue;
		}
		if ($recordCount == 4) {
			$newData[$i]->addWeb($row[0]);
			$recordCount++;
			continue;
		}
	}
}
echo file_put_contents('output.csv',$csv);
echo 'b<pre>';
print($csv);
echo '</pre>';

class adres {
	public $naam;
	public $adres;
	public $pc;
	public $plaats;
	public $telefoon;
	public $web;
	public $mail;
	public function __construct($naam) {
		$this->naam = $naam;
	}
	public function addTel($telefoon) {
		$this->telefoon = (string)$telefoon;
		if (substr($this->telefoon,0,1) != '0') {
			$this->telefoon = '+31 '.$this->telefoon;
		}
	}
	public function addWeb($web) {
		$this->web = $web;
		if (preg_match('#.*\.([a-z|0-9|\-]{2,50}\.[a-z]{2,4})/?.*$#i',$web,$match)) {
			$this->mail = 'info@'.$match[1];
		}
		
	}
	public function addPcPlaats($pcplaats) {
		$regEx = '/^(?P<num>[0-9]{4}).?(?P<alph>[a-z|A-Z]{2})\s(?P<plaats>.*)$/';
		if (preg_match($regEx,$pcplaats,$match)) {
			$this->pc = $match['num'] . ' ' . $match['alph'];
			$this->plaats = $match['plaats'];
		} else {
			$this->plaats = $pcplaats;
		}
	}
	public function csv() {
		$d = ";";
		return "".$this->naam.$d.$this->adres.$d.$this->pc.$d.$this->plaats.$d.$this->telefoon.$d.$this->web.$d.$this->mail."\n";
	}
}
