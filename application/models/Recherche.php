<?php
class Agilis_Model_Recherche {
	private $db;
	private $recherche;	
	
	public function __construct() {
		$this->db = Zend_Registry::get('db');
		$this->recherche = array();
	}//end function

	public function setRecherche($variables){
		$this->variables = $variables;
		$this->recherche['cle']	= $this->variables['var_recherche_cle'];
		$this->recherche['proprietes'] = self::rechercheProprietes();
		$this->recherche['domaine'] = self::rechercheDomaine();
		$this->recherche['champs'] = self::rechercheChamps();
		$this->recherche['colonnes'] = self::rechercheColonnes();
	}//end function	
	
	public function getRechercheView() {
		$this->recherche['sql'] = self::rechercheSql();
		$this->recherche['data'] = self::rechercheData();
		$this->recherche['variables'] = $this->variables;
		return $this->recherche;
	}//end function	
	
	private function rechercheProprietes() {
		$rechercheProprietes = array();
		$requete = "SELECT * FROM zz5_recherches WHERE ZZ_RE_Code = '".$this->recherche['cle']."'";
		$rechercheProprietes = $this->db->fetchRow($requete);
		return $rechercheProprietes;
	}//end function
	
	private function rechercheDomaine() {
		$rechercheDomaine = array();
		$requete = "SELECT * FROM zz5_recherchesdomaines WHERE ZZ_RD_Code = 'rd_".substr($this->recherche['cle'],3,strlen($this->recherche['cle'])-7)."'";
		$rechercheDomaine = $this->db->fetchRow($requete);
		return $rechercheDomaine;
	}//end function	
	
	private function rechercheChamps() {
		$rechercheChamps = array();
		$requete = "SELECT * FROM zz5_recherchesChamps WHERE ZZ_RC_Code like 'rc_".substr($this->recherche['cle'],3,strlen($this->recherche['cle'])-7)."\_%'";
		$lignes = $this->db->fetchAll($requete);
		foreach($lignes as $ligne){
			$rechercheChamps[$ligne['zz_rc_libelle']]['champ'] = $ligne['zz_rc_champ'];
			$rechercheChamps[$ligne['zz_rc_libelle']]['type'] = $ligne['zz_rc_type'];
			$rechercheChamps[$ligne['zz_rc_libelle']]['page'] = $ligne['zz_rc_page'];			
		}//end foreach
		return $rechercheChamps;
	}//end function	
	
	private function rechercheColonnes() {
		$colonnes = array();
		$lignes = split(chr(13).chr(10),$this->recherche['proprietes']['zz_re_champs']);
		$position = 0;
		foreach($lignes as $ligne){
			$col = split('   ',$ligne);
			$colonnes[$position]['libelle'] = $col[1];
			$colonnes[$position]['taille'] = $col[2];
			$colonnes[$position]['type'] = $this->recherche['champs'][$col[1]]['type'];
			$position++;
		}//end foreach		
		return $colonnes;
	}//end function

	private function rechercheSql(){
		//Chargement des données liées à la recherche
		
		$conditions = array();
		$lignes = split(chr(13).chr(10),$this->recherche['proprietes']['zz_re_conditions']);
		foreach($lignes as $ligne){
			$colonnes = split('   ',$ligne);
			$position = $colonnes[0];
			$conditions[$position]['champ'] = $colonnes[1];
			$conditions[$position]['operateur'] = $colonnes[2];
			$valeur =  trim($colonnes[3]);
			$conditions[$position]['valeur'] = (substr($valeur,0,2) == '[[' ? $this->variables[strtolower($valeur)] : $valeur);
		}//end foreach	
	
		if($this->recherche['proprietes']['zz_re_tri']){
			$tris = array();
			$lignes = split(chr(13).chr(10),$this->recherche['proprietes']['zz_re_tri']);
			foreach($lignes as $ligne){
				$colonnes = split('   ',$ligne);
				$position = $colonnes[0];
				$tris[$position]['champ'] = $colonnes[1];
				$tris[$position]['ordre'] = $colonnes[2];
			}//end foreach
		}//end if	
			
		$structure = str_replace(' ','',$this->recherche['proprietes']['zz_re_structure']);

		//Construction de la requête SQL
		$requeteSelect = "SELECT ";
		foreach($this->recherche['colonnes'] as $colonne){
			if($requeteSelect != "SELECT ") $requeteSelect .= ',';
			$requeteSelect .= $this->recherche['champs'][$colonne['libelle']]['champ'];
		}//end foreach
		
		$requeteFrom = " FROM ".$this->recherche['domaine']['zz_rd_tables'];
		
		$operateurs = array('Inférieur à'=>' < ','Egal à'=>' = ','Supérieur à'=>' > ','Commençant par'=>' like ','Terminant par'=>' like ','Contenant'=>' like ','A partir du'=>' >= ','Jusqu\'au'=>' <= ','A la date du'=>' = ');
		$requeteWhere = " WHERE ";
		for($i = 0 ; $i < strlen($structure) ; $i++){
			$caractere = substr($structure,$i,1);
			$caracteres = substr($structure,$i,2);			
			if($caractere == '(' OR $caractere == ')') $requeteWhere .= $caractere;
			if($caracteres == 'et') $requeteWhere .= ' AND ';
			if($caracteres == 'ou') $requeteWhere .= ' OR ';			
			if(is_numeric($caracteres)) {
				$requeteWhere .= $this->recherche['champs'][$conditions[$caracteres]['champ']]['champ'];
				$requeteWhere .= $operateurs[$conditions[$caracteres]['operateur']];
				if($this->recherche['champs'][$conditions[$caracteres]['champ']]['type'] != 'nombre') $requeteWhere .= "'";
				if($conditions[$caracteres]['operateur'] == 'Terminant par' OR $conditions[$caracteres]['operateur'] == 'Contenant') $requeteWhere .= '%';	
				$valeur = $conditions[$caracteres]['valeur'];
				if($this->recherche['champs'][$conditions[$caracteres]['champ']]['type'] == 'date'){
					$valeurArray = split('/',$valeur);
					$valeur = (count($valeurArray) == 3 ? $valeurArray[2].'-'.$valeurArray[1].'-'.$valeurArray[0] : '');
				}//end if
				$requeteWhere .= $valeur;
				if($conditions[$caracteres]['operateur'] == 'Commençant par' OR $conditions[$caracteres]['operateur'] == 'Contenant') $requeteWhere .= '%';
				if($this->recherche['champs'][$conditions[$caracteres]['champ']]['type'] != 'nombre') $requeteWhere .= "'";
				$i++;
			}//end if
		}//end for
		//Ajout éventuel du filtre lié au domaine
		if($this->recherche['domaine']['zz_rd_filtre']){
			$requeteWhere .= ' AND ('.variablesToValeurs($this->recherche['domaine']['zz_rd_filtre'],'').') ';
		}//end if
	
		if($this->recherche['proprietes']['zz_re_tri']){
			$ordre = array('Croissant'=>' ASC','Décroissant'=>' DESC');
			$requeteTri = " ORDER BY ";
	
			foreach($tris as $tri){
				if($requeteTri != " ORDER BY ") $requeteTri .= ',';
				$requeteTri .= $this->recherche['champs'][$tri['champ']]['champ'];
				$requeteTri .= $ordre[$tri['ordre']];
			}//end foreach
		}else{	
			$requeteTri = "";			
		}//end if
		$requete = $requeteSelect.$requeteFrom.$requeteWhere.$requeteTri;
		return 	$requete;	
	}//end function
	
	private function rechercheData(){
		$data = $this->db->fetchAll($this->recherche['sql']);
		return $data;
	}//end function
	
}//end class	