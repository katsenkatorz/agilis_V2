<?php
class Agilis_Model_Controle {
	private $db;
	private $variables;
	private $controle;		
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->controle = array();				
	}//end function
	
	public function setControle($variables){
		$this->variables = $variables;
		$this->controle['code'] = $variables['var_controle_code'];
		$this->controle['proprietes'] = self::controleProprietes();		
	}//end function
	
	public function getSelectData(){
		$data = self::selectData();
		$selectData = self::selectFormat($data);
		return $selectData;
	}//end function

	public function estUnique(){
		$valeur = $this->variables['var_controle_valeur'];
		$table = $this->variables['var_table_nom'];		
		$champ = $this->controle['proprietes']['zz_gc_champ'];
		$requete = "SELECT ".$champ." FROM ".$table." WHERE ".$champ." = '".$valeur."'";
		$estUnique = $this->db->fetchOne($requete);		
		return $estUnique;
	}//end function
	
	private function selectData(){
		$requeteVariables = $this->variables;
		$requeteVariables['var_requete_code'] = $this->controle['proprietes']['zz_gc_requete'];
		$requeteObjet = new Agilis_Model_Requete();
		$requeteObjet->setRequete($requeteVariables);
		$selectData = $requeteObjet->getRequeteResultat();
		return $selectData;		
	}//end function
	
	private function selectFormat($data){
		$selectFormat = array();
		$format = $this->controle['proprietes']['zz_gc_format'];
		if($format){
			$option = $this->controle['proprietes']['zz_gc_formatoption'];
			$blanc = $this->controle['proprietes']['zz_gc_formatblanc'];
			for($item = 0 ; $item < count($data) ; $item++){
				$valeur = $data[$item]['libelle'];
				$selectFormat[$item]['code'] = $valeur;				
				$selectFormat[$item]['libelle'] = format($valeur,$format,$option,$blanc);
			}//end foreach
		}else{
			$selectFormat = $data;
		}//end if
		return $selectFormat;
	}//end function
	
	private function controleProprietes() {
		$requete = "SELECT * FROM zz5_ongletscontroles WHERE zz_gc_code = '".$this->controle['code']."'";
		$controleProprietes = $this->db->fetchRow($requete);
		return $controleProprietes;
	}//end function	

}//end class	