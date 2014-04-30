<?php
//include_once 'Requete.php';

class Agilis_Model_Recherche {
	private $db;
	private $recherche;	
	
	public function __construct($request) {
		$this->db = Zend_Registry::get('db');		
		$this->recherche = array();
	}//end function

	public function setRecherche($variables){
		$this->variables = $variables;
		$this->recherche['code'] = $variables['var_recherche_code'];
		$this->recherche['proprietes'] = self::setRechercheProprietes();
		$this->recherche['liste'] = self::setListeProprietes();
		/* /!\  A COMPRENDRE /!\
		 * 
		 * $this->recherche['code'] = self::setRequeteArray();
		$this->recherche['code'] = self::setRechercheColonnes();
		$this->recherche['code'] = self::setRechercheCriteres(); */
		
		
	}//end function	
	
	/* /!\ A COMPRENDRE /!\
	 * public function getRechercheView(){
		
		$rechercheView["code"] = $this->rechercheCode;
		$rechercheView["categorie"]	= $this->rechercheProprietes["ZZ_RE_Categorie"];
		$rechercheView["liste"]	= $this->listeProprietes["ZZ_LI_Libelle"];
		$rechercheView["recherche"]	= $this->rechercheProprietes["ZZ_RE_Libelle"];	
		$rechercheView["colonnes"] = self::setOutputColonnes();
		$rechercheView["criteres"] = self::setOutputCriteres();		
		return $rechercheView;
	}//end function
		 */
	
	private function setRechercheProprietes() {
		$rechercheProprietes = array();
		$requete = "SELECT * FROM zz5_recherches WHERE ZZ_RE_Code = '".$this->recherche['Code']."'";
		$rechercheProprietes = $this->db->fetchRow($requete);
		return $rechercheProprietes;
	}//end function

	private function setListeProprietes() {
		$listeProprietes =  array ();
		$requete = "SELECT * FROM zz5_listes WHERE ZZ_LI_Code = '".$this->rechercheProprietes["ZZ_RE_Liste"]."'";
		$listeProprietes = $this->db->fetchRow($requete);
		return $listeProprietes;
	}//end function	
	
	private function setRequeteArray(){
		$requeteCode = $this->listeProprietes["ZZ_LI_Requete"];
		$requeteObjet = new Agilis_Model_Requete($requeteCode);
		$this->requeteArray = $requeteObjet->getRequeteArray(); 
	}//end if	

	private function setRechercheColonnes(){
		$requete = "SELECT ZZ_RL_Colonne FROM zz5_recherchesColonnes WHERE ZZ_RL_Code like '".$this->rechercheCode."-00000000_%'";
		$this->rechercheColonnes = $this->db->fetchCol($requete);
	}//end function
	
	private function setRechercheCriteres(){
		$requete = "SELECT * FROM zz5_recherchesCriteres WHERE ZZ_RC_Code like '".$this->rechercheCode."-00000000_%'";
		$this->rechercheCriteres = $this->db->fetchAll($requete);
	}//end function	
	
	private function setOutputColonnes(){
		$colonnes = Array();
		$colonnesSelect = split(",",$this->requeteArray["SELECT"]);
		for($i = 0; $i < count($colonnesSelect) ; $i++){
			$colonnesSelectArray = split("AS",$colonnesSelect[$i]);
			$colonnes[$i]['code'] = trim($colonnesSelectArray[0]);
			$colonnes[$i]['libelle'] = trim($colonnesSelectArray[1]);
			$colonnes[$i]['selected'] = in_array($colonnes[$i]['code'],$this->rechercheColonnes);
		}//end foreach
		return $colonnes;
	}//end function
	
	private function setOutputCriteres(){
		$criteres = Array();
		for($i = 0; $i < count($this->rechercheCriteres) ; $i++){
			$criteres[$i]['code'] = $this->rechercheCriteres[$i]['ZZ_RC_Code'];			
			$criteres[$i]['ouvrir'] = $this->rechercheCriteres[$i]['ZZ_RC_Ouvrir'];
			$criteres[$i]['champ'] = $this->rechercheCriteres[$i]['ZZ_RC_Champ'];			
			$criteres[$i]['alias'] = $this->rechercheCriteres[$i]['ZZ_RC_Alias'];
			$criteres[$i]['operateur'] = $this->rechercheCriteres[$i]['ZZ_RC_Operateur'];			
			$criteres[$i]['valeur'] = $this->rechercheCriteres[$i]['ZZ_RC_Valeur'];	
			$criteres[$i]['fermer'] = $this->rechercheCriteres[$i]['ZZ_RC_Fermer'];					
			$criteres[$i]['logique'] = $this->rechercheCriteres[$i]['ZZ_RC_Logique'];			
		}//end for
		return $criteres;
	}//end function
	
}//end class	
?>