<?php
class Agilis_Model_Requete {
	private $db;
	private $variables;
	private $requete;

	public function __construct() {
		$this->db = Zend_Registry::get('db');
		$this->requete = array();
	}//end function

	public function setRequete($variables){
		$this->variables = $variables;
		$this->requete['session'] = self::requeteSession();		
		$this->requete['code'] = $variables['var_requete_code'];
		$this->requete['proprietes'] = self::requeteProprietes();		
		$this->requete['sql'] = variablesToValeurs($this->requete['proprietes']['zz_rq_sql'],$variables);
	}//end function	
	
	public function getRequeteResultat(){
		if($this->requete['session']['developpeur'] == '1'){
			$data = array(
				'ag2_lg_date' => date("Y-m-d H:i:s"),
				'ag2_lg_requetecode' => $this->requete['code'],
				'ag2_lg_requetesql' => $this->requete['sql']
			);
			$this->db->insert('ag2_logs', $data);
		}//end if
			
		if(substr($this->requete['sql'],0,6) == 'SELECT'){
			$requeteResultat = $this->db->fetchAll($this->requete['sql']);
		}else{
			$requeteResultat = $this->db->getConnection()->exec($this->requete['sql']);
		}//end if
		
		return $requeteResultat;
	}//end function

	public function getAliasArray(){
		$aliasArray = array();
		$select = strpos($this->requete['sql'],"SELECT");
		$from = strpos($this->requete['sql'],"FROM ");
		$listeChamps = substr($this->requete['sql'],$select+7,$from-7);
		$arrayChamps = split(",",$listeChamps);
		foreach($arrayChamps as $champ){
			$splitAs = split(" AS ",$champ);
			$aliasArray[] = trim($splitAs[1]);
		}//end foreach
		return $aliasArray;
	}//end function		
	
	private function requeteProprietes(){
		$requeteProprietes = array();
		$requete = "SELECT * FROM zz5_requetes WHERE zz_rq_code = '".$this->requete['code']."'";
		$requeteProprietes = $this->db->fetchRow($requete);
		return $requeteProprietes;
	}//end function
	
	private function requeteSession(){
		$session = new Agilis_Model_Session();
		return $session->getSessionXml();
	}//end function
}//end class