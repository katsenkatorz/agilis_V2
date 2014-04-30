<?php
class Agilis_Model_Session{
	private $session;
	private $variables;
	
	public function __construct(){
		$this->session = new Zend_Session_Namespace('session');
	}//end function

	public function setSession($variables){
		$this->variables = $variables;
	}//end function
	
	public function getSessionXml(){
		$sessionArray = array();
		$sessionArray['gassi'] = $this->session->gassi;
		$sessionArray['identifiant'] = $this->session->identifiant;
		$sessionArray['nom'] = $this->session->nom;
		$sessionArray['prenom'] = $this->session->prenom;
		$sessionArray['habilitation'] = $this->session->habilitation;
		$sessionArray['application_code'] = $this->session->applicationCode;
		$sessionArray['application_libelle'] = $this->session->applicationLibelle;
		$sessionArray['profil'] = $this->session->profil;
		$sessionArray['entite'] = $this->session->entite;
		$sessionArray['entite_libelle'] = $this->session->entiteLibelle;		
		$sessionArray['perimetre'] = $this->session->perimetre;
		$sessionArray['developpeur'] = $this->session->developpeur;
		if($this->variables['var_session_variable']){
			$sessionXml = $sessionArray[$this->variables['var_session_variable']];
		}else{
			$sessionXml = $sessionArray;
		}//end if
		return $sessionXml;
	}//end function	
	
}//end class