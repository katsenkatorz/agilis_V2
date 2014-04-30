<?php
//Chargement de la librairie globale Agilis
require_once dirname(dirname(__FILE__)) . '/library/agilis/global.php';

//Mise en place du contr�leur
$frontController = Zend_Controller_Front::getInstance();
$frontController->throwExceptions(true);
$frontController->setControllerDirectory(AGILIS_APPLICATION_PATH . '/controllers');

//Lancement du contr�leur
try{
	$frontController->dispatch();
}catch (Exception $e){
	header('Content-type: text/plain');
	echo $e;
}//end try