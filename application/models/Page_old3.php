<?php
class Agilis_Model_Page {
	private $db;
	private $page;
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->page = array();
		$this->session = new Zend_Session_Namespace('session');		
	}//end function

	public function setPage($variables){
		$this->page['variables'] = $variables;
		$this->page['code'] = $variables['var_page_code'];
		$this->page['cadres'] = self::pageCadres();
		$this->page['proprietes'] = self::pageProprietes();
		$this->page['controleur'] = self::pageControleur();
		$this->page['developpeur'] = $this->session->developpeur;		
	}//end function

	public function getPage(){
		return $this->page;
	}//end function	

	private function pageCadres(){
		$requete = "SELECT * FROM zz5_pagescadres WHERE SUBSTRING_INDEX(zz_pc_code, '_', 3) = '".$this->page['code']."' ORDER BY ZZ_PC_Code";
		$pageCadres = $this->db->fetchAll($requete);
		return $pageCadres;
	}//end function	

	private function pageProprietes(){
		$requete = "SELECT * FROM zz5_pages WHERE zz_pg_code = '".$this->page['code']."'";
		$pageProprietes = $this->db->fetchRow($requete);
		return $pageProprietes;
	}//end function

	private function pageControleur(){
		$pageControleur = null;
		//Si page mono-cadre
		if(! empty($this->page['cadres']) && $this->page['cadres'][0]['zz_pc_code'] == $this->page['code'].'_00'){
			$source = $this->page['cadres'][0]['zz_pc_source'];
			$sourceType = substr($source,0,2);
			switch($sourceType){
				case "ca" : $pageControleur = "carte";break;
				case "et" : $pageControleur = "etat";break;
				case "fo" : $pageControleur = "formulaire";break;
				case "ht" : $pageControleur = "html";break;
				case "li" : $pageControleur = "liste";break;
				case "re" : $pageControleur = "recherche";break;
			}//end switch
			$this->page['variables']['var_'.$pageControleur.'_code'] = $source;
			$this->page['variables']['var_cadre_code'] = $this->page['cadres'][0]['zz_pc_cadre'];
		}//end if
		return $pageControleur;
	}//end function	
		
}//end class