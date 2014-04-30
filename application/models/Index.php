<?php
class Agilis_Model_Index {
	private $db;
	private $variables;
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
	}//end function

	public function setVariables($variables){
		$this->variables = $variables;
	}//end function
	
	public function identifier(){
		$session = new Zend_Session_Namespace('session');
		
		//Récupération des paramètres éventuels d'identification
		$identifiant = '';
		if(!empty($this->variables['i'])){
			$identifiant = $this->variables['i'];
			unset($this->variables['i']);
		}//end if
		$motdepasse = '';
		if(!empty($this->variables['m'])){
			$motdepasse = $this->variables['m'];
			unset($this->variables['m']);
		}//end if
		
		if($identifiant and $motdepasse){
			$requete = "SELECT * FROM ag2_Habilitations WHERE ag2_HA_Identifiant='".$identifiant."' AND ag2_HA_MotDePasse='".$motdepasse."' LIMIT 1";
			$resultat = $this->db->fetchRow($requete);
			$session->gassi = false;
			$session->identifiant = $resultat['ag2_ha_identifiant'];
			$session->nom = $resultat['ag2_ha_nom'];
			$session->prenom = $resultat['ag2_ha_prenom'];
		}else{
			//Récupération des données transmises par le GASSI
			$headers = getallheaders();
			if(isset($headers["sm_universalid"])){
				$session->gassi = true;
				$session->identifiant = (isset($headers["sm_universalid"]) ? $headers["sm_universalid"] : null);
				$session->nom = (isset($headers["ftusersn"]) ? $headers["ftusersn"] : null);
				$session->prenom = (isset($headers["ftusergivenname"]) ? $headers["ftusergivenname"] : null);
			}//end if
		}//end if
		
		//Marquage des développeurs
		$requete = "SELECT ag2_ha_code,ag2_ha_entite FROM ag2_Habilitations WHERE ag2_HA_Identifiant='".$session->identifiant."' AND ag2_HA_Application='dev' ";
		$resultat = $this->db->fetchRow($requete);
		$session->developpeur =	($resultat ? '1' : '');
	}//end function
	
	public function getVariables(){
		return $this->variables;
	}//end function
	
}//end class