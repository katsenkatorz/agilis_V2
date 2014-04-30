<?php
include_once 'Requete.php';

class Agilis_Model_Liste{
	private $db;
	private $variables;
	private $liste;

	public function __construct() {
		$this->db = Zend_Registry::get('db');
		$this->liste = array();
	}//end function

	public function setListe($variables){
		$this->liste['code'] = $variables['var_liste_code'];		
		$this->liste['cadre'] = $variables['var_cadre_code'];
		$this->liste['proprietes'] = self::listeProprietes();
		$this->variables = self::listeVariables($variables);
		$this->liste['variables'] = $this->variables;			
		$this->liste['regles'] = self::listeRegles();
		$this->liste['liens'] = self::listeLiens();	
		$this->liste['sql'] = self::listeSql();
		$this->liste['data'] = self::listeData();
		$this->liste['nombreLignes'] = count($this->liste['data']);	
		$this->liste['colonnes']['proprietes'] = self::colonnesProprietes();
		$this->liste['colonnes']['alias'] = self::colonnesAlias();
		$this->liste['colonnes']['afficher'] = self::colonnesAfficher();
		$this->liste['colonnes']['tri'] = self::colonnesTri();
		$this->liste['colonnes']['taille'] = self::colonnesTaille();
		$this->liste['largeur'] = self::listeLargeur();						
		$this->liste['ruptures'] = self::listeRuptures();
		$this->liste['structure'] = self::listeStructure();
		$this->liste['entete'] = self::listeEntete();
		$this->liste['total'] = stripos($this->liste['sql'],"WITH ROLLUP");
	}//end function	

	public function getListeView(){
		return $this->liste;
	}//end function	
	
	public function getListeXml(){
		$listeXml['regles'] = $this->liste['regles'];		
		return $listeXml;
	}//end function	

	private function listeVariables($variables){
		$variablesDefaut = array();
		if($this->liste['proprietes']["zz_li_requetevariables"]){
			$variablesDefaut = xmlToArray($this->liste['proprietes']["zz_li_requetevariables"]);
		}//end if	
		$listeVariables = array_merge($variablesDefaut,$variables);
		return $listeVariables;
	}//end function			
	
	private function listeProprietes(){
		$listeProprietes = array();
		$requete = "SELECT * FROM zz5_listes WHERE zz_li_code = '".$this->liste['code']."'";
		$listeProprietes = $this->db->fetchRow($requete);
		return $listeProprietes;
	}//end function	
	
	private function listeRegles(){
		$listeRegles = array();
		$requete = "SELECT * FROM zz5_regles WHERE SUBSTRING_INDEX(zz_rg_code,'_',4) = '".$this->liste['cadre']."' ORDER BY zz_rg_code";
		$listeRegles = $this->db->fetchAll($requete);
		return $listeRegles;
	}//end function	
	
	private function listeLiens(){
		$listeLiens = array();
		foreach($this->liste['regles'] as $regle){
			$listeLiens[] = $regle['zz_rg_objetdeclencheur'];
		}//end foreach
		return $listeLiens;
	}//end function	
	
	private function listeSql(){
		$listeSql = array();
		$requeteCode = $this->liste['proprietes']["zz_li_requete"];
		$requete = "SELECT zz_rq_sql FROM zz5_Requetes WHERE zz_rq_code = '".$requeteCode."'";
		$listeSql = $this->db->fetchOne($requete);
		return $listeSql;
	}//end function	
	
	private function listeData(){
		$listeData = array();
		$requeteVariables = $this->variables;
		$requeteVariables['var_requete_code'] = $this->liste['proprietes']['zz_li_requete'];
		$requeteObjet = new Agilis_Model_Requete();
		$requeteObjet->setRequete($requeteVariables);
		$listeData = $requeteObjet->getRequeteResultat();
		return $listeData;
	}//end function
	
	private function colonnesProprietes(){
		$colonnesProprietes = array();
		$requete = "SELECT * FROM zz5_listesColonnes WHERE SUBSTRING_INDEX(zz_lc_code,'_',3) = '".$this->liste['code']."' ORDER BY zz_lc_position";
		$colonnesProprietes = $this->db->fetchAll($requete);
		return $colonnesProprietes;
	}//end function	
	
	private function colonnesAlias(){
		$colonnesAlias = array();
		for($iColonne = 0 ; $iColonne < count($this->liste['colonnes']['proprietes']) ; $iColonne++){
			$colonneNomArray = split('_',$this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_code']);
			$colonnesAlias[] = strtolower($colonneNomArray[3]);
		}//end foreach
		return $colonnesAlias;
	}//end if	
	
	private function colonnesAfficher(){
		$colonnesAfficher = array();
		$selectArray = (empty($this->liste['data'])? $this->liste['colonnes']['alias'] : array_keys($this->liste['data'][0]));
		for($iColonne = 0 ; $iColonne < count($this->liste['colonnes']['proprietes']) ; $iColonne++){
			$colonneAfficher = true;
			if($this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_taille'] == null) $colonneAfficher = false;
			if($this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_rupture'] != null) $colonneAfficher = false;
			$colonneNomArray = split('_',$this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_code']);
			$colonneAlias = strtolower($colonneNomArray[3]);
			if(! in_array($colonneAlias,$selectArray)) $colonneAfficher = false;
			if($colonneAfficher) $colonnesAfficher[] = $iColonne;
		}//end for
		return $colonnesAfficher;
	}//end function

	private function colonnesTri(){
		$colonnesTri = false;
		if(!empty($this->liste['colonnes']['afficher'])){
			foreach($this->liste['colonnes']['afficher'] as $iColonne){
				if($this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_tri']){
					$colonnesTri = true;
					break;
				}//end if
			}//end foreach
			if($colonnesTri){
				$colonnesTri = (empty($this->variables["var_sql_orderby"]) ? '0' : '1');
			}//end if
		}//end if
		return $colonnesTri;
	}//end function	

	private function colonnesTaille(){
		$colonnesTaille = Array();
		if(!empty($this->liste['colonnes']['afficher'])){
			foreach($this->liste['colonnes']['afficher'] as $iColonne){
				$colonnesTaille[] = $this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_taille'];
			}//end foreach
		}//end if
		return $colonnesTaille;
	}//end function
	
	private function listeLargeur(){
		$listeLargeur = -2;
		if(!empty($this->liste['colonnes']['afficher'])){
			foreach($this->liste['colonnes']['afficher'] as $iColonne){
				$listeLargeur += $this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_taille'] + 2;
			}//end foreach
		}//end if
		return $listeLargeur;
	}//end function	
	
	private function listeRuptures(){
		$listeRuptures = array();
		$iRupture = 0;
		for($iColonne = 0 ; $iColonne < count($this->liste['colonnes']['proprietes']) ; $iColonne++){
			if($this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_rupture']){
				$colonneCode = $this->liste['colonnes']['proprietes'][$iColonne]["zz_lc_code"];
				$alias = substr($colonneCode,strrpos($colonneCode,'_')+1);
				$listeRuptures[$iRupture]['alias'] = $alias;
				$listeRuptures[$iRupture]['valeur'] = 'Rupture_Init';
				$iRupture++;
			}//end if
		}//end for
		return $listeRuptures;
	}//end function
	
	private function listeStructure(){
		$listeStructure = array();
		if(empty($this->liste['ruptures'])){
			$listeStructure[0]['classe'] = 'data';
			$listeStructure[0]['debut'] = 0;
			$listeStructure[0]['fin'] = count($this->liste['data']) -1;
		}else{
			$debut = 0;
			$iStructure = -1;
			for($iLigne = 0 ; $iLigne < count($this->liste['data']) ; $iLigne++) {
	
				for($iRupture = 0 ; $iRupture < count($this->liste['ruptures']) ; $iRupture++){
					$ligneRupture = $this->liste['data'][$iLigne][$this->liste['ruptures'][$iRupture]['alias']];
					if($ligneRupture != $this->liste['ruptures'][$iRupture]['valeur'] ){
						$iStructure++;
						$this->liste['ruptures'][$iRupture]['valeur'] = $ligneRupture;
						for($iRuptureInit = $iRupture +1 ; $iRuptureInit < count($this->liste['ruptures']) ; $iRuptureInit++) $this->liste['ruptures'][$iRuptureInit]['valeur'] = 'Rupture_Init';
						$listeStructure[$iStructure]['classe'] = 'rupture'.$iRupture;
						$listeStructure[$iStructure]['valeur'] = $ligneRupture;
						$rupture = true;
						if($debut == '') $debut = $iLigne;
					}//end if
				}//end for
	
				if($rupture){
					$rupture = false;
					$iStructure++;
					$listeStructure[$iStructure]['classe'] = 'data';
					$listeStructure[$iStructure]['debut'] = $debut;
					$listeStructure[$iStructure]['fin'] = $iLigne;
					$debut = '';
				}else{
					$listeStructure[$iStructure]['fin'] = $iLigne;
				}//end if
			}//end foreach
		}//end if
		return $listeStructure;
	}//end function	
	
	private function listeEntete(){
		$listeEntete = array();
		if($this->liste['proprietes']["zz_li_afficheentete"] and !empty($this->liste['colonnes']['afficher'])){
			//Chargement de la table entete et calcul du nombre de niveaux et colonnes
			$listeEntete['niveaux'] = 1;
			foreach($this->liste['colonnes']['afficher'] as $iColonne){
				$listeEntete['code'][] = $this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_code'];
				$entete = split(';',$this->liste['colonnes']['proprietes'][$iColonne]['zz_lc_libelle']);
				$listeEntete['libelle'][] = $entete;
				$listeEntete['tri'][] = self::colonneTri($iColonne);
				$listeEntete['triRang'][] = self::colonneTriRang($iColonne);
				$nombre = count($entete);
				if($nombre > $listeEntete['niveaux']) $listeEntete['niveaux'] = $nombre;
			}//end foreach
			$nombreColonnes = count($this->liste['colonnes']['afficher']);
				
			//Propagation des libellés sur les niveaux vides
			for($iColonnes = 0 ; $iColonnes < $nombreColonnes ; $iColonnes++){
				for($iNiveaux = 1 ; $iNiveaux < $listeEntete['niveaux'] ; $iNiveaux++){
					if(empty($listeEntete['libelle'][$iColonnes][$iNiveaux])) $listeEntete['libelle'][$iColonnes][$iNiveaux] = $listeEntete['libelle'][$iColonnes][$iNiveaux - 1];
				}//end for
			}//end for
	
			//Initialisation Rowspan et colspan à 1
			for($iColonnes = 0 ; $iColonnes < $nombreColonnes ; $iColonnes++){
				for($iNiveaux = 0 ; $iNiveaux < $listeEntete['niveaux'] ; $iNiveaux++){
					$listeEntete['rowspan'][$iColonnes][$iNiveaux] = 1;
					$listeEntete['colspan'][$iColonnes][$iNiveaux] = 1;
				}//end for
			}//end for
				
			//Fusion Rowspan
			for($iColonnes = 0 ; $iColonnes < $nombreColonnes ; $iColonnes++){
				for($iNiveaux = $listeEntete['niveaux'] -1 ; $iNiveaux > 0 ; $iNiveaux--){
					if($listeEntete['libelle'][$iColonnes][$iNiveaux] == $listeEntete['libelle'][$iColonnes][$iNiveaux - 1]){
						$listeEntete['libelle'][$iColonnes][$iNiveaux] = null;
						$listeEntete['rowspan'][$iColonnes][$iNiveaux - 1] += $listeEntete['rowspan'][$iColonnes][$iNiveaux];
					}//end if
				}//end for
			}//end for
				
			//Fusion Colspan
			for($iColonnes = $nombreColonnes -1 ; $iColonnes > 0 ; $iColonnes--){
				for($iNiveaux = 0 ; $iNiveaux < $listeEntete['niveaux'] ; $iNiveaux++){
					if($listeEntete['libelle'][$iColonnes][$iNiveaux] == $listeEntete['libelle'][$iColonnes - 1][$iNiveaux] AND !empty($listeEntete['libelle'][$iColonnes][$iNiveaux])){
						$listeEntete['libelle'][$iColonnes][$iNiveaux] = null;
						$listeEntete['colspan'][$iColonnes - 1][$iNiveaux] += $listeEntete['colspan'][$iColonnes][$iNiveaux];
					}//end if
				}//end for
			}//end for
		}//end if
		return $listeEntete;
	}//end function	
	
	private function colonneTri($iColonne){
		$colonneTri = false;
		if($this->liste['colonnes']['proprietes'][$iColonne]["zz_lc_tri"]){
			$colonneTri = "null";
			$orderBy = (!empty($this->variables["var_sql_orderby"]) ? $this->variables["var_sql_orderby"] : '');
			$colonneCode = $this->liste['colonnes']['proprietes'][$iColonne]["zz_lc_code"];
			$alias = substr($colonneCode,strrpos($colonneCode,'_')+1);
			if(preg_match('/^'.$alias.' desc|,'.$alias.' desc/', $orderBy) > 0){
				$colonneTri = "desc";
			}else{
				if(preg_match('/^'.$alias.'$|^'.$alias.' |,'.$alias.' |,'.$alias.'$/', $orderBy) > 0){				
					$colonneTri = "asc";
				}//end if
			}//end if
		}//end if
		return $colonneTri;		
	}//end function
	
	private function colonneTriRang($iColonne){
		$colonneTriRang = '';
		if($this->liste['colonnes']['proprietes'][$iColonne]["zz_lc_tri"]){
			$orderBy = (!empty($this->variables["var_sql_orderby"]) ? $this->variables["var_sql_orderby"] : '');
			$triArray = split(",",$orderBy);
			$colonneCode = $this->liste['colonnes']['proprietes'][$iColonne]["zz_lc_code"];
			$alias = substr($colonneCode,strrpos($colonneCode,'_')+1);
			for($i = 0; $i < count($triArray) ; $i++){
				if(preg_match('/^'.$alias.' |^'.$alias.'$/',$triArray[$i]) > 0){				
					$colonneTriRang = $i +1;
				}//end if
			}//end for
		}//end if
		return $colonneTriRang;
	}//end function

}//end class	
?>