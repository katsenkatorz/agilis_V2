<?php
class Agilis_Model_Dev {
	private $variables;
	private $db;
	private $transfert;

	public function __construct($variables){
		$this->variables = $variables;
		$this->db = Zend_Registry::get('db');
		$this->transfert = array();
	}//end function

	public function getTransfertApplications(){
		$this->transfert['source'] = $this->variables['var_transfert_source'];		
		self::setTransfertDbSource();
		$requete = "SELECT zz_ap_code FROM zz5_applications ORDER BY zz_ap_code";		
		$transfertApplications = $this->transfert['dbsource']->fetchAll($requete);		
		return $transfertApplications;
	}//end function
	
	public function transferrer(){
		$this->transfert['source'] = $this->variables['var_transfert_source'];
		$this->transfert['application'] = $this->variables['var_transfert_application'];		
		$this->transfert['destination'] = $this->variables['var_transfert_destination'];	
		$this->transfert['message'] = '';
		$this->transfert['erreur'] = '';
		$tables = $this->variables['var_transfert_tables'];
		$requetes = $this->variables['var_transfert_requetes'];					
		$habilitations = $this->variables['var_transfert_habilitations'];
		$this->transfert['erreur'] = ($tables == 'false' and $requetes == 'false' and $habilitations == 'false');		
		if($this->transfert['erreur']){
			$this->transfert['message'] = 'Aucun objet à transferrer.'; 
		}else{
			self::transfertConnexions();
		}//end if
		//Transfert des tables zz
		if(empty($this->transfert['erreur']) and $tables == 'true') self::transfertTables();
		//Transfert des requêtes appelées par l'application
		if(empty($this->transfert['erreur']) and $requetes == 'true') self::transfertRequetes();
		//Cloture du transfert
		if($this->transfert['dbsource']) $this->transfert['dbsource']->closeConnection();
		if($this->transfert['dbdestination']) $this->transfert['dbdestination']->closeConnection();
		$resultat = ($this->transfert['erreur'] ? "ECHEC DE TRANSFERT :\n\n" : "Transfert réussi.\n\n");
		$resultat .= $this->transfert['message'];
		return $resultat;
	}//end function

	private function transfertConnexions(){
		$this->transfert['erreur'] = ($this->transfert['source'] == $this->transfert['destination']);
		if($this->transfert['erreur']){
			$this->transfert['message'] = 'La source est identique à la destination';
		}else{	
			self::setTransfertDbSource();
			self::setTransfertDbDestination();					
		}//end if
	}//end function
	
	private function setTransfertDbSource(){
		$requete = "SELECT * FROM dev_serveurs WHERE dev_se_code = '".$this->transfert['source']."'";
		$serveur = $this->db->fetchRow($requete);
		$adapter = "pdo_mysql";
		$params['host'] = $serveur['dev_se_adresse'];
		$params['username'] = $serveur['dev_se_utilisateur'];
		$params['password'] = $serveur['dev_se_password'];
		$params['dbname'] = $serveur['dev_se_database'];
		$params['charset'] = "latin1";
		$params['persistent'] = true;
		try{
			$this->transfert['dbsource'] = Zend_Db::factory($adapter,$params);
			$this->transfert['dbsource']->getConnection();
		}catch (Zend_Db_Adapter_Exception $e){
			$erreur = $e->getMessage();
			exit();
		}//end try		
	}//end function

	private function setTransfertDbDestination(){
		$requete = "SELECT * FROM dev_serveurs WHERE dev_se_code = '".$this->transfert['destination']."'";
		$serveur = $this->db->fetchRow($requete);
		$adapter = "pdo_mysql";
		$params['host'] = $serveur['dev_se_adresse'];
		$params['username'] = $serveur['dev_se_utilisateur'];
		$params['password'] = $serveur['dev_se_password'];
		$params['dbname'] = $serveur['dev_se_database'];
		$params['charset'] = "latin1";
		$params['persistent'] = true;
		try{
			$this->transfert['dbdestination'] = Zend_Db::factory($adapter,$params);
			$this->transfert['dbdestination']->getConnection();
		}catch (Zend_Db_Adapter_Exception $e){
			$erreur = $e->getMessage();
			exit();
		}//end try
	}//end function
	
	private function transfertRequetes(){
		if(count($this->transfert['application']) == 2) $this->transfert['application'] .= "_";
		$requete = "SELECT DISTINCT	zz_fo_clerequete AS requete FROM zz5_formulaires WHERE zz_fo_clerequete IS NOT NULL AND SUBSTRING(zz_fo_code, 4, 3) = '".$this->transfert['application']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_fo_requete AS requete FROM zz5_formulaires WHERE zz_fo_requete IS NOT NULL AND SUBSTRING(zz_fo_code, 4, 3) = '".$this->transfert['application']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_gc_requete AS requete FROM zz5_ongletsControles WHERE zz_gc_requete IS NOT NULL AND SUBSTRING(zz_gc_code, 4, 3) = '".$this->transfert['application']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_li_requete AS requete FROM zz5_listes WHERE zz_li_requete IS NOT NULL AND SUBSTRING(zz_li_code, 4, 3) = '".$this->transfert['application']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_et_requete AS requete FROM zz5_etats WHERE zz_et_requete IS NOT NULL AND SUBSTRING(zz_et_code, 4, 3) = '".$this->transfert['application']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_ca_requete AS requete FROM zz5_cartes WHERE zz_ca_requete IS NOT NULL AND SUBSTRING(zz_ca_code, 4, 3) = '".$this->transfert['application']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT ZZ_RG_CibleObjet AS Requete FROM zz5_regles WHERE ZZ_RG_Action = 'requeteExecuter' AND SUBSTRING(zz_rg_code, 4, 3) = '".$this->transfert['application']."' ";
		$requetesArray = $this->transfert['dbsource']->fetchAll($requete);
		$requeteListe = '';
		foreach($requetesArray as $requeteItem) $requeteListe .= $requeteItem['requete'].",";
		$table = "zz5_requetes";
		$champsSource = self::transfertChampsSource($table);
		$condition = "LOCATE(zz_rq_code,'".$requeteListe."')";
		self::transfertInsert($table,$champsSource,$condition);
		$this->transfert['message'] .= "\n\nRequêtes : ".$requeteListe;
	}//end function
	
	private function transfertTables(){
		$tablesNom = array('zz5_applications','zz5_menus','zz5_pages','zz5_pagesCadres','zz5_html','zz5_formulaires','zz5_formulairesOnglets','zz5_onglets','zz5_ongletsControles','zz5_Listes','zz5_ListesColonnes','zz5_Etats','zz5_EtatsControles','zz5_Cartes','zz5_Regles');
		$tablesCle = array('zz_ap_code','zz_mn_code','zz_pg_code','zz_pc_code','zz_ht_code','zz_fo_code','zz_fg_code','zz_gl_code','zz_gc_code','zz_li_code','zz_lc_code','zz_et_code','zz_ec_code','zz_ca_code','zz_rg_code');
		
		self::transfertStructuresVerifier($tablesNom);
		if(empty($this->transfert['erreur'])){
			$this->transfert['message'] =  "Tables : \n";
			for($iTables = 0 ; $iTables < count($tablesNom) ; $iTables++){
				$table = $tablesNom[$iTables];
				if($table == 'zz5_applications'){
					$condition = "ZZ_AP_Code = LEFT('".$this->transfert['application']."_',3)";
				}else{
					$condition = "SUBSTRING(".$tablesCle[$iTables].",4,3) = LEFT('".$this->transfert['application']."_',3)";
				}//end if
				//Suppression des données de la table destination
				$this->transfert['dbdestination']->query("DELETE FROM ".$table." WHERE ".$condition);
				//Elaboration de la liste des champs
				$champsSource = self::transfertChampsSource($table);
				//Transfert des données	
				self::transfertInsert($table,$champsSource,$condition);
				$this->transfert['message'] .= $table." ";
			}//end foreach
		}//end if
	}//End function	
	
	private function transfertChampsSource($table){
		$champsSource = " (";
		$tableSource = $this->transfert['dbsource']->fetchAll("SHOW COLUMNS FROM ".$table);
		for($iChamp = 0 ; $iChamp < count($tableSource) ; $iChamp++){
			if($champsSource != " (") $champsSource .= ",";
			$champsSource .= $tableSource[$iChamp]["Field"];
		}//end while
		$champsSource .= ") ";
		return($champsSource);
	}//end function
	
	private function transfertInsert($table,$champsSource,$condition){
		$tableSource = $this->transfert['dbsource']->fetchAll("SELECT * FROM ".$table." WHERE ".$condition);
		for($iligne = 0 ; $iligne < count($tableSource) ; $iligne++){
			$ligneSource = "(";
			foreach($tableSource[$iligne] as $champ){
				if($ligneSource != "(") $ligneSource .= ",";
				$valeur = ($champ == '' ? "null" : "\"".addslashes($champ)."\"");				
				$ligneSource .= $valeur;
			}//end foreach
			$ligneSource .= ")";
			$this->transfert['dbdestination']->query("REPLACE INTO ".$table.$champsSource." VALUES ".$ligneSource);
		}//end while
	}//end function
	
	private function transfertStructuresVerifier($tablesNoms){
		$erreur = '';
		foreach($tablesNoms as $table){
			$tableSource = $this->transfert['dbsource']->fetchAll("SHOW COLUMNS FROM ".$table);
			$tableDestination = $this->transfert['dbdestination']->fetchAll("SHOW COLUMNS FROM ".$table);
			$this->transfert['erreur'] = (count($tableSource) != count($tableDestination));
			if($this->transfert['erreur']){
				$this->transfert['message'] .= "Nombre de champs DIFFERENTS entre la source et la destination pour la table : ".$table."\n";
				break;
			}else{
				for($iChamp = 0 ; $iChamp < count($tableSource) ; $iChamp++){
					$differences = array_diff($tableSource[$iChamp],$tableDestination[$iChamp]);
					if(!empty($differences)){
						foreach($differences as $nature => $valeur){
							$erreur .= $table." : ".$tableSource[$iChamp]['Field']." : $nature = ".$valeur."\n";
						}//end foreach
					}//end if
				}//end foreach
			}//end if
		}//end foreach
		if($erreur != ''){
			$this->transfert['erreur'] = true;
			$this->transfert['message'] .= "\n\nstructures de tables différentes entre les 2 bases : \n\n".$erreur;
		}//end if
	}//end function	
		
}//end class