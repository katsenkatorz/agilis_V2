<?php
//include_once 'Requete.php';

class Agilis_Model_Carte{
	private $db;
	private $variables;	
	private $carte;

	private $carteMarqueurs;
	
	public function __construct() {
		$this->db = Zend_Registry::get('db');
		$this->carte = array();
	}//end function

	public function setCarte($variables){
		$this->variables = $variables;
		$this->carte['code'] = $variables['var_carte_code'];
		$this->carte['proprietes'] = self::carteProprietes();
		$this->carte['marqueurs'] = self::carteMarqueurs();		
		$this->carte['legende'] = self::carteLegende();
	}//end function
	
	public function getCarteView(){
		$carteView = array();
		$carteView["proprietes"] = $this->carte['proprietes'];
		$carteView["legende"] = $this->carte['legende'];
		return $carteView;
	}//end function
	
	public function getCarteXml(){
		$carteXml = array();
		if($this->carte['proprietes']['zz_ca_conversion']) self::lambertToGps();
		$carteXml["proprietes"] = $this->carte['proprietes'];
		$carteXml["marqueurs"] = $this->carte['marqueurs'] ;
		$carteXml["legende"] = $this->carte['legende'];
		return $carteXml;
	}//end function	
	
	private function carteProprietes(){
		$requete = "SELECT * FROM zz5_cartes WHERE zz_ca_code = '".$this->carte['code']."'";
		$carteProprietes = $this->db->fetchRow($requete);
		return $carteProprietes;
	}//end function

	private function carteMarqueurs(){
		$requeteVariables = $this->variables;
		$requeteVariables['var_requete_code'] = $this->carte['proprietes']["zz_ca_requete"];
		$requeteObjet = new Agilis_Model_Requete($requeteVariables);
		$requeteObjet->setRequete($requeteVariables);
		$carteMarqueurs = $requeteObjet->getRequeteResultat();
		return $carteMarqueurs;
	}//end function

	private function carteLegende(){
		$carteLegende = array();
		$iconePrecedente = null;
		foreach($this->carte['marqueurs'] as $marqueur){
			if($marqueur['icone'] != $iconePrecedente){
				$carteLegende[] = $marqueur['icone'];
				$iconePrecedente = $marqueur['icone'];
			}//end if
		}//end foreach
		return $carteLegende;
	}//end function
	
	 private function lambertToGps(){
	 	define('N',0.728968627421412);
	 	define('XSM',600000);
	 	define('YSM',8199695.76800186);
	 	define('A',6378249.2000);
	 	define('F1',6356515.0000);
	 	define('CM',11745793.393435);
	 	for($i = 0 ; $i < count($this->carte['marqueurs'] ) ; $i++){
	 		$x = $this->carte['marqueurs'] [$i]["longitude"];
	 		$y = $this->carte['marqueurs'] [$i]["latitude"];
	 		$this->carte['marqueurs'] [$i]["longitude"] = self::longitude($x,$y);
	 		$this->carte['marqueurs'] [$i]["latitude"] = self::latitude($x,$y);
	 	}//end foreach
	 }// end function

	 private function longitude($x,$y){
	 	$x = $x - XSM;
	 	$y = $y - YSM;
	 	$longitude = atan(-($x)/$y);
	 	$longitude = $longitude / N;
	 	$longitude = $longitude * 180 / pi();
	 	$constante = 2 + (20 / 60) + (14.025 / 3600);
	 	$longitude = $longitude + $constante - 0.0009832931364;
	 	return($longitude);
	 }//end function	 
	 
	 private function latitude($x,$y){
	 	$x = $x - XSM;
	 	$y = $y - YSM;
	 	$latitude = sqrt(pow($x,2) + pow($y,2));
	 	$f = (A - F1) / A;
	 	$e² = 2 * $f - pow($f, 2);
	 	$e  = sqrt($e²);
	 	$latiso = - log($latitude / CM) / N;
	 	$latitude =  2 * atan( exp($latiso) ) - (pi() / 2);
	 	do{
	 		$temp = $latitude;
	 		$latitude = 2 * atan( pow(((1 + $e * sin($latitude)) / (1 - $e * sin($latitude))), $e / 2) * exp($latiso)  ) - (pi() / 2);
	 	} while (abs($temp - $latitude) > 0.000000001);
	 	$latitude = $latitude / pi();
	 	$latitude = $latitude * 180;
	 	$latitude = $latitude - 0.000213335046;
	 	return($latitude);
	 }//end function

}//end class