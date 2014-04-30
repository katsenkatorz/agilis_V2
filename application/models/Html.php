<?php
//require_once "Session.php";

class Agilis_Model_Html {
	private $db;
	private $html;
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->html = array();				
	}//end function

	public function setHtml($variables){
		$this->html['variables'] = $variables;
		$this->html['page'] = $variables['var_page_code'];
		$this->html['code'] = $variables['var_html_code'];
		$this->html['libelle'] = self::htmlLibelle();
	}//end function	
	
	public function getHtmlView(){
		return $this->html;
	}//end function
	
	public function getHtmlXml(){
		$htmlXml['regles'] = self::htmlRegles();
		$htmlXml['session'] = self::htmlSession();
		return $htmlXml;
	}//end function
	
	private function htmlLibelle(){
		$htmlLibelle = '';
		$requete = "SELECT * FROM zz5_html WHERE zz_ht_code = '".$this->html['code']."'";
		$resultat = $this->db->fetchRow($requete);
		$htmlLibelle = $resultat["zz_ht_libelle"];
		return $htmlLibelle;
	}//end function
	
	private function htmlRegles(){
		$htmlRegles = array();
		$requete = "SELECT * FROM zz5_regles WHERE zz_rg_code like '".$this->html['variables']['var_regles_code']."\\_%' ORDER BY zz_rg_code";
		$htmlRegles = $this->db->fetchAll($requete);
		return $htmlRegles;
	}//end function
	
	private function htmlSession(){
		$session = new Agilis_Model_Session();
		return $session->getSessionXml();
	}//end function	
	
}//end class