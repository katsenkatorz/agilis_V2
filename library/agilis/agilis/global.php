<?php
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/Paris');

//Définition des constantes pour les chemins d'accès
define('AGILIS_ROOT', dirname(dirname(dirname(__FILE__))));
define('AGILIS_APPLICATION_PATH', AGILIS_ROOT . '/application');
define('AGILIS_LIBRARY_PATH', AGILIS_ROOT . '/library/agilis');
define('FPDF_LIBRARY_PATH', AGILIS_ROOT . '/library/fpdf');
define('FPDF_FONTPATH', AGILIS_ROOT . '/library/fpdf/font');
//define('PEAR_LIBRARY_PATH', AGILIS_ROOT . '/library/PEAR');
//define('PEAR_LIBRARY_PATH', '/exec/products/phpqa/0.2/lib');

//Ajout des chemins vers ZendFramework, PEAR et la librairie Agilis
set_include_path(
	'/exec/adm/lib/ZendFramework/1.10.7/library/'
	. PATH_SEPARATOR . AGILIS_LIBRARY_PATH
	. PATH_SEPARATOR . FPDF_LIBRARY_PATH
	. PATH_SEPARATOR . FPDF_FONTPATH
	. PATH_SEPARATOR . get_include_path()
);

// Configuration du chargemement automatique des classes
require_once 'Zend/Loader/Autoloader.php';
Zend_Loader_Autoloader::getInstance()->registerNamespace('Agilis_');
new Zend_Application_Module_Autoloader(array(
	'basePath'  => AGILIS_APPLICATION_PATH,
	'namespace' => 'Agilis'
));

//Chargement du fichier de configuration de Agilis
$config = new Zend_Config_Ini(AGILIS_APPLICATION_PATH . '/configs/application.ini');

//Enregistrement de la connexion à la base de données
try{
	$db = Zend_Db::factory($config->database);
	$db->getConnection();
	Zend_Registry::set('db',$db);
}catch (Zend_Db_Adapter_Exception $e){
	echo $e->getMessage();
	exit();
}//end try

//constante URL
define('URL',"//" . $config->url->serveur . "/agilis_V2/public");

/**********************************************************************************
 * définitions des COULEURS
 **********************************************************************************
*/

//constantes de couleur
define("COULEUR_P0", "#FF6600"); 	//orange
define("COULEUR_P1", "#FFEFD8");	//orange clair
define("COULEUR_S0", "#000000");	//noir
define("COULEUR_S1", "#A9A9A9");	//gris foncé
define("COULEUR_S2", "#D3D3D3");	//gris moyen
define("COULEUR_S3", "#EEEEEE");	//gris clair
define("COULEUR_S4", "#FFFFFF");	//blanc


/**********************************************************************************
 * définitions des FONCTIONS GLOBALES
 **********************************************************************************
*/

function xmlToArray($xml){
	$array = Array();
	while($xml){
		$debutTagOuvert = strpos($xml,"<");
		$finTagOuvert = strpos($xml,">");
		$nomTag = substr($xml,$debutTagOuvert+1,$finTagOuvert-$debutTagOuvert-1);
		$debutTagClose = stripos($xml,"</".$nomTag.">");
		$valeurTag = substr($xml,$finTagOuvert+1,$debutTagClose-$finTagOuvert-1);
		$array[$nomTag] = $valeurTag;
		$xml = substr($xml,$debutTagClose + strlen($nomTag) + 3);
	}//end while
	return $array;
}//end function

function arrayToXml($array){
	$xml = '';
	if(isset($array)){
		foreach($array as $cle=>$valeur){
			$xml .= "<$cle>$valeur</$cle>";
		}//end foreach
	}//end if
	return $xml;
}//end function

function format($valeur,$format,$option,$blanc){
	if (strlen($valeur) > 0){
		//		list($format,$option,$blanc) = explode(",",$formatOption.",,");
		switch ($format) {
			case "date":
				$date = mktime (0,0,0,substr($valeur,5,2),substr($valeur,8,2),substr($valeur,0,4));
				$jour = substr($valeur,8,2);
				$mois = substr($valeur,5,2);
				$annee = substr($valeur,0,4);
				if (substr($jour,0,1) == "0") $jour0 = substr($jour,1,1); else $jour0 = $jour;
				$listeMois = Array("janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre");
				$listeMoisAbrege = Array("jan","fév","mars","avr","mai","juin","juil","août","sep","oct","nov","déc");
				$listeJours = Array("dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi");
				switch ($option) {
					case "complet":
						$resultat = $listeJours[strftime("%w",$date)]." ".$jour0." ".$listeMois[intval($mois)-1]." ".$annee;
						break;
					case "jourMoisAnnée":
						$resultat = $jour0." ".$listeMois[intval($mois)-1]." ".$annee;
						break;
					case "moisAnnée":
						$resultat = $listeMois[intval($mois)-1]." ".$annee;
						break;
					case "semaine" :
						$resultat = " ".$annee." Semaine - ".date("W",strtotime($valeur));
						break;
					case "année":
						$resultat = $annee;
						break;
					case "mois":
						$resultat = $listeMois[intval($mois)-1];
						break;
					case "moisAbrégé":
						$resultat = $listeMoisAbrege[intval($mois)-1];
						break;
					case "dateHeure":
						$resultat = $jour."/".$mois."/".$annee.substr($valeur,10);
						break;
					default:
						$resultat = $jour."/".$mois."/".$annee;
						break;
				}//end switch
				break;
			case "euros":
				if ($option == null) $decimales = 2; else $decimales = $option;
				if($decimales < 0) $valeur = floor($valeur * pow(10,abs($decimales)))/pow(10,abs($decimales));				
//				$resultat = number_format($valeur, abs($decimales), ',', ' ')." ".utf8_encode("€");
				$resultat = number_format($valeur, abs($decimales), ',', ' ')." €";				
				break;
			case "pourcentage":
				if ($option == null) $decimales = 2; else $decimales = $option;
				if($decimales < 0) $valeur = floor($valeur * pow(10,abs($decimales)))/pow(10,abs($decimales));				
				$resultat = number_format($valeur*100, abs($decimales), ',', ' ')." %";
				break;
			case "nombre":
				if ($option == null) $decimales = 0; else $decimales = $option;
				if($decimales < 0) $valeur = floor($valeur * pow(10,abs($decimales)))/pow(10,abs($decimales));
				$resultat = number_format($valeur, abs($decimales), ',', ' ');
				break;
			case "regexp" :
				preg_match('/'.$option.'/',$valeur,$resultatArray);
				$resultat = '';
				if(isset($resultatArray[1])){
					for($i=1 ; $i < count($resultatArray) ; $i++) $resultat .= $resultatArray[$i];
				}else{
					$resultat = $resultatArray[0];
				}//end if
				break;
		}//end switch
		if($valeur == 0 && $blanc) $resultat = "";
		return $resultat;
	}//end if
}//end function
