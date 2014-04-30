<?php
//include_once 'Requete.php';

class Agilis_Model_Etat {
	private $db;
	private $variables;
	private $etat;
	
	public function __construct() {
		$this->db = Zend_Registry::get('db');
		$this->etat = array();
	}//end function

	public function setEtat($variables){
		$this->variables = $variables;
		$this->etat['code'] = $variables['var_etat_code'];
		$this->etat['proprietes'] = self::etatProprietes();
		$this->etat['controles'] = self::etatControles();
		$this->etat['data'] = self::etatData();		
	}//end function

	public function getEtatView(){
		$etatView["proprietes"] = $this->etat['proprietes'];
		$etatView["controles"] = $this->etat['controles'];
		$etatView["data"] = $this->etat['data'];
		return $etatView;
	}//end function
	
	private function etatProprietes(){
		$requete = "SELECT * FROM zz5_etats WHERE zz_et_code = '".$this->etat['code']."'";
		$etatProprietes = $this->db->fetchRow($requete);
		return $etatProprietes;
	}//end function
	
	private function etatControles(){
		$requete = "SELECT * FROM zz5_etatscontroles WHERE SUBSTRING_INDEX(zz_ec_code,'_',3) = '".$this->etat['code']."' ORDER BY zz_ec_code ASC" ;
		$etatControles = $this->db->fetchAll($requete);
		return $etatControles;
	}//end function

	private function etatData(){
		$etatData = array();
		$requeteVariables = $this->variables;		
		$requeteVariables['var_requete_code'] = $this->etat['proprietes']["zz_et_requete"];
		$requeteObjet = new Agilis_Model_Requete();
		$requeteObjet->setRequete($requeteVariables);
		$etatData = $requeteObjet->getRequeteResultat();
		return $etatData;
	}//end function
	
}//end class