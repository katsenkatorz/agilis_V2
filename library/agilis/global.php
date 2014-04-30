<?php
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/Paris');

//Définition des constantes pour les chemins d'accès
define('AGILIS_ROOT', dirname(dirname(dirname(__FILE__))));
define('AGILIS_APPLICATION_PATH', AGILIS_ROOT . '/application');
define('AGILIS_FILES_PATH', AGILIS_ROOT . '/public/files');
define('AGILIS_LIBRARY_PATH', AGILIS_ROOT . '/library/agilis');
define('FPDF_LIBRARY_PATH', AGILIS_ROOT . '/library/fpdf');
define('FPDF_FONTPATH', AGILIS_ROOT . '/library/fpdf/font');
//define('PEAR_LIBRARY_PATH', AGILIS_ROOT . '/library/PEAR');
define('PEAR_LIBRARY_PATH', '/exec/products/phpqa/0.2/lib');

//Ajout des chemins vers ZendFramework, PEAR et la librairie Agilis
set_include_path(
	'/exec/adm/lib/ZendFramework/1.10.7/library/'
	. PATH_SEPARATOR . AGILIS_LIBRARY_PATH
	. PATH_SEPARATOR . FPDF_LIBRARY_PATH
	. PATH_SEPARATOR . FPDF_FONTPATH
	. PATH_SEPARATOR . PEAR_LIBRARY_PATH
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
	$adapter = $config->database->adapter;
	$params['host'] = $config->database->params->host;
	$params['username'] = $config->database->params->username;
	$params['password'] = $config->database->params->password;
	$params['dbname'] = $config->database->params->dbname;
	$params['charset'] = $config->database->params->charset;
	$params['options'] = array(Zend_Db::CASE_FOLDING => Zend_Db::CASE_LOWER);
	$params['driver_options'] =	array(PDO::MYSQL_ATTR_LOCAL_INFILE => true);
	
	$db = Zend_Db::factory($adapter,$params);
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
		$xml = trim($xml);
		$debutTagOuvert = strpos($xml,"<");
		$finTagOuvert = strpos($xml,">");
		$nomTag = strtolower(substr($xml,$debutTagOuvert+1,$finTagOuvert-$debutTagOuvert-1));
		$debutTagClose = stripos($xml,"</".$nomTag.">");
		$valeurTag = substr($xml,$finTagOuvert+1,$debutTagClose-$finTagOuvert-1);
/*		
		if(substr($valeurTag,0,2) == '[['){
			$variableSession = substr($valeurTag,2,-2);
			$session = new Zend_Session_Namespace('session');
			$valeurTag = $session->$variableSession;
		}//end if
*/		
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

function objectToArray($object){
	if(!is_object($object) && !is_array($object)) return $object;
	if(is_object($object)) $object = get_object_vars( $object );
	return array_map('objectToArray', $object);
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

//Remplace dans une chaîne les variables par leur valeur
function variablesToValeurs($chaine,$variables){
	$boucle = true;
	while($boucle){
		$variableDebut = strpos($chaine,'[[');
		if($variableDebut === false){
			$boucle = false;
		}else{
			$variableFin = strpos($chaine,']]');
			$variableNom = substr($chaine,$variableDebut + 2,$variableFin - $variableDebut - 2);
			if(substr($variableNom,0,12) == 'var_session_'){
				$session = new Zend_Session_Namespace('session');
				$sessionVariable = substr($variableNom,12);
				$variableValeur = $session->$sessionVariable;
			}elseif($variableNom == 'var_sql_orderby'){
				$variableValeur = (isset($variables[$variableNom]) ? $variables[$variableNom] : 'NULL');
			}elseif($variableNom == 'var_sql_having'){
				$variableValeur = (isset($variables[$variableNom]) ? $variables[$variableNom] : 'TRUE');
			}elseif($variableNom == 'var_sql'){
				$variableValeur = (isset($variables[$variableNom]) ? $variables[$variableNom] : '');				
			}elseif($variableNom == 'var_server_files_path'){
				$variableValeur = AGILIS_FILES_PATH;
			}elseif(substr($variableNom,0,4) == 'var_'){
				$variableValeur = (isset($variables[$variableNom]) ? $variables[$variableNom] : null);								
			}else{
				$variableValeur = (isset($variables[$variableNom]) ? $variables[$variableNom] : null);
			}//end if
			$chaine = substr($chaine,0,$variableDebut).addslashes($variableValeur).substr($chaine,$variableFin + 2);
		}//end if
	}//end while
	return $chaine;
}//end function

function clearDir($dossier) {
	$ouverture=@opendir($dossier);
	if (!$ouverture) return;
	while($fichier=readdir($ouverture)) {
		if ($fichier == '.' || $fichier == '..') continue;
		if (is_dir($dossier."/".$fichier)) {
			$r=clearDir($dossier."/".$fichier);
			if (!$r) return false;
		}else{
			$r=@unlink($dossier."/".$fichier);
			if (!$r) return false;
		}//end if
	}//end while
	closedir($ouverture);
	$r=@rmdir($dossier);
	if (!$r) return false;
	return true;
}//end function

function ax($a){
	$a = str_replace('€','euros',$a);
	$b = rand(2,9).rand(2,9).rand(2,9);
	$k = 0;
	$h = '';
	for($i = 0 ; $i < strlen($a) ; $i++){
		$d = ord(substr($a,$i,1));			
		$h .= substr('0'.dechex($d),-2);
		$k += $d;
	}//end for
	$k = substr($k,0,3);
	$h .= $k;
	$i = 0 ; $j = 0;
	$t = array();
	while($h != ''){
		$r = substr($h,0,substr($b,$i,1));
		$s = strrev($r);
		$t[$j++] = $s;
		$h = substr($h,substr($b,$i,1),strlen($h));
		$i = ($i + 1) % 3;
	}//end while
	$x = '';
	for($j = 0 ; $j < count($t) ; $j += 3){
		$x .= (isset($t[$j+2]) ? $t[$j+2] : '');
		$x .= (isset($t[$j+1]) ? $t[$j+1] : '');		
		$x .= $t[$j];
	}//end for	
	$x = $b.$x;
	return $x;
}//end function

function xa($x){
	$b = substr($x,0,3);
	$x = substr($x,3);
	$s = array();
	$i = 2;
	while($x != ''){
		$r = substr($x,0,substr($b,$i,1));
		$s[] = strrev($r);
		$x = substr($x,substr($b,$i,1));
		$i = ($i == 0 ? 2 : $i - 1);
	}//end while
	$h = '';
	for($j = 0 ; $j < count($s) ; $j+=3){
		$h .= (isset($s[$j+2]) ? $s[$j+2] : '');
		$h .= (isset($s[$j+1]) ? $s[$j+1] : '');
		$h .= $s[$j];
	}//end for
	$k  = substr($h,-3);
	$h = substr($h,0,count($h)-4);
	$a = '';
	$l = 0;
	for($i = 0 ; $i < strlen($h) ; $i+=2){
		$d = hexdec(substr($h,$i,2));
		$l += $d;
		$a .= chr($d);		
	}//end for
	$a = ($k == substr($l,0,3) ? $a : '');
	return $a;
}//end function
