<?php
class Agilis_Model_Page{
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
		$this->page['proprietes'] = self::pageProprietes();	
		$this->page['cadres'] = self::pageCadres();
		$this->page['controleur'] = self::pageControleur();
		$this->page['developpeur'] = $this->session->developpeur;
	}//end function

	public function getPage(){
		return $this->page;
	}//end function	

	private function pageProprietes(){
		$requete = "SELECT * FROM zz5_pages WHERE zz_pg_code = '".$this->page['code']."'";
		$pageProprietes = $this->db->fetchRow($requete);
		return $pageProprietes;
	}//end function
	
	private function pageCadres(){
		$pageCadres = array();
		$codeFiltre = "pc_".substr($this->page['code'],3)."\\_%";
		$requete = "SELECT * FROM zz5_pagescadres WHERE zz_pc_code like '".$codeFiltre."' ORDER BY ZZ_PC_Code";
		$pageCadres = $this->db->fetchAll($requete);
		return $pageCadres;
	}//end function	

	private function pageControleur(){
		$pageControleur = null;
		//Si page sans cadre
		if(empty($this->page['cadres'])){
			$vue = $this->page['proprietes']['zz_pg_vue'];
			$vueType = substr($vue,0,2);
			switch($vueType){
				case "ca" : $pageControleur = "carte";break;
				case "et" : $pageControleur = "etat";break;
				case "fo" : $pageControleur = "formulaire";break;
				case "ht" : $pageControleur = "html";break;
				case "li" : $pageControleur = "liste";break;
				case "re" : $pageControleur = "recherche";break;
				case "pg" : $pageControleur = "page";break;				
			}//end switch
			$this->page['variables']['var_'.$pageControleur.'_code'] = $vue;
			$this->page['variables']['var_regles_code'] = $this->page['proprietes']['zz_pg_regles'];	
		}//end if
		return $pageControleur;
	}//end function	
		
}//end class