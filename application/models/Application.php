<?php
class Agilis_Model_Application {
	private $variables;
	private $db;
	private $application;

	public function __construct($variables){
		$this->variables = $variables;
		$this->db = Zend_Registry::get('db');
		$this->application = array();
	}//end function

	private function setApplicationTables(){
		$this->application['tablesNom'] = array('zz5_applications','zz5_applicationsFrames','zz5_pages','zz5_pagesCadres','zz5_html','zz5_formulaires','zz5_formulairesOnglets','zz5_onglets','zz5_ongletsControles','zz5_Listes','zz5_ListesColonnes','zz5_Etats','zz5_EtatsControles','zz5_Cartes','zz5_Regles','zz5_Recherches','zz5_RecherchesChamps','zz5_RecherchesDomaines');
		$this->application['tablesCle'] = array('zz_ap_code','zz_af_code','zz_pg_code','zz_pc_code','zz_ht_code','zz_fo_code','zz_fg_code','zz_gl_code','zz_gc_code','zz_li_code','zz_lc_code','zz_et_code','zz_ec_code','zz_ca_code','zz_rg_code','zz_re_code','zz_rc_code','zz_rd_code');
	}//end function	
	
	public function lister(){
		$this->application['serveurCible'] = $this->variables['var_serveur_cible'];
		self::setApplicationDb('Cible');
		$requete = "SELECT zz_ap_code FROM zz5_applications ORDER BY zz_ap_code";		
		$resultat = $this->application['dbCible']->fetchAll($requete);		
		return $resultat;
	}//end function
	
	public function supprimer(){
		$this->application['serveurCible'] = $this->variables['var_serveur_cible'];
		$this->application['code'] = $this->variables['var_application_code'];
		$this->application['erreur'] = '';
		//Etablit la connexion avec le serveur
		self::setApplicationDb('Cible');
		//Suppressions dans les tables zz
		if(empty($this->application['erreur'])) self::supprimerTables();
		//Cloture de la connexion
		if($this->application['dbCible']) $this->application['dbCible']->closeConnection();
		$resultat = ($this->application['erreur'] ? "ECHEC DE SUPPRESSION :\n\n" : "Suppression réussie.\n\n");
		$resultat .= $this->application['message'];
		return $resultat;
	}//end function	
	
	private function supprimerTables(){
		self::setApplicationTables();
		if(empty($this->application['erreur'])){
			$this->application['message'] =  "Tables : \n";
			for($iTables = 0 ; $iTables < count($this->application['tablesNom']) ; $iTables++){
				$table = $this->application['tablesNom'][$iTables];
				if($table == 'zz5_applications'){
					$condition = "ZZ_AP_Code = LEFT('".$this->application['code']."_',3)";
				}else{
					$condition = "SUBSTRING(".$this->application['tablesCle'][$iTables].",4,3) = LEFT('".$this->application['code']."_',3)";
				}//end if
				//Suppression des données de la table
				$this->application['dbCible']->query("DELETE FROM ".$table." WHERE ".$condition);
				$this->application['message'] .= $table." ";
			}//end foreach
		}//end if
	}//End function
	
	public function transferrer(){
		$this->application['code'] = $this->variables['var_application_code'];		
		$this->application['serveurSource'] = $this->variables['var_serveur_source'];
		$this->application['serveurDestination'] = $this->variables['var_serveur_destination'];	
		$this->application['message'] = '';
		$this->application['erreur'] = '';
		$tables = $this->variables['var_transfert_tables'];
		$requetes = $this->variables['var_transfert_requetes'];					
		$habilitations = $this->variables['var_transfert_habilitations'];
		$this->application['erreur'] = ($tables == 'false' and $requetes == 'false' and $habilitations == 'false');		
		if($this->application['erreur']){
			$this->application['message'] = 'Aucun objet à transferrer.'; 
		}else{
			$this->application['erreur'] = ($this->application['serveurSource'] == $this->application['serveurDestination']);
			if($this->application['erreur']){
				$this->application['message'] = 'La source est identique à la destination';
			}else{
				//Connexions aux serveurs
				self::setApplicationDb('Source');
				self::setApplicationDb('Destination');
			}//end if
		}//end if

		//Transfert des tables zz
		if(empty($this->application['erreur']) and $tables == 'true') self::transfertTables();
	
		//Transfert des requêtes appelées par l'application
		if(empty($this->application['erreur']) and $requetes == 'true') self::transfertRequetes();
		
		//Cloture du transfert
		if($this->application['dbSource']) $this->application['dbSource']->closeConnection();
		if($this->application['dbDestination']) $this->application['dbDestination']->closeConnection();
		$resultat = ($this->application['erreur'] ? "ECHEC DE TRANSFERT :\n\n" : "Transfert réussi.\n\n");
		$resultat .= $this->application['message'];
		return $resultat;
	}//end function

	private function setApplicationDb($type){
		$requete = "SELECT * FROM dev_serveurs WHERE dev_se_code = '".$this->application['serveur'.$type]."'";
		$serveur = $this->db->fetchRow($requete);
		$adapter = "pdo_mysql";
		$params['host'] = $serveur['dev_se_adresse'];
		$params['username'] = $serveur['dev_se_utilisateur'];
		$params['password'] = $serveur['dev_se_password'];
		$params['dbname'] = $serveur['dev_se_database'];
		$params['charset'] = "latin1";
		$params['persistent'] = true;
		try{
			$this->application['db'.$type] = Zend_Db::factory($adapter,$params);
			$this->application['db'.$type]->getConnection();
		}catch (Zend_Db_Adapter_Exception $e){
			$erreur = $e->getMessage();
			exit();
		}//end try		
	}//end function

	private function transfertTables(){
		self::setApplicationTables();		
		self::transfertStructuresVerifier();
		if(empty($this->application['erreur'])){
			$this->application['message'] =  "Tables : \n";
			for($iTables = 0 ; $iTables < count($this->application['tablesNom']) ; $iTables++){
				$table = $this->application['tablesNom'][$iTables];
				if($table == 'zz5_applications'){
					$condition = "ZZ_AP_Code = LEFT('".$this->application['code']."_',3)";
				}else{
					$condition = "SUBSTRING(".$this->application['tablesCle'][$iTables].",4,3) = LEFT('".$this->application['code']."_',3)";
				}//end if
				//Suppression des données de la table destination
				$this->application['dbDestination']->query("DELETE FROM ".$table." WHERE ".$condition);
				//Elaboration de la liste des champs
				$champsSource = self::transfertChampsSource($table);
				//Transfert des données	
				self::transfertInsert($table,$champsSource,$condition);
				$this->application['message'] .= $table." ";
			}//end foreach
		}//end if
	}//End function	
	
	private function transfertChampsSource($table){
		$champsSource = " (";
		$tableSource = $this->application['dbSource']->fetchAll("SHOW COLUMNS FROM ".$table);
		for($iChamp = 0 ; $iChamp < count($tableSource) ; $iChamp++){
			if($champsSource != " (") $champsSource .= ",";
			$champsSource .= $tableSource[$iChamp]["Field"];
		}//end while
		$champsSource .= ") ";
		return($champsSource);
	}//end function
	
	private function transfertInsert($table,$champsSource,$condition){
		$tableSource = $this->application['dbSource']->fetchAll("SELECT * FROM ".$table." WHERE ".$condition);
		for($iligne = 0 ; $iligne < count($tableSource) ; $iligne++){
			$ligneSource = "(";
			foreach($tableSource[$iligne] as $champ){
				if($ligneSource != "(") $ligneSource .= ",";
				$valeur = ($champ == '' ? "null" : "\"".addslashes($champ)."\"");				
				$ligneSource .= $valeur;
			}//end foreach
			$ligneSource .= ")";
//			$this->application['dbDestination']->query("REPLACE INTO ".$table.$champsSource." VALUES ".$ligneSource);
			$this->application['dbDestination']->getConnection()->exec("REPLACE INTO ".$table.$champsSource." VALUES ".$ligneSource);
		}//end while
	}//end function

	private function transfertRequetes(){
		if(count($this->application['code']) == 2) $this->application['code'] .= "_";
		$requete = "SELECT DISTINCT	zz_fo_clerequete AS requete FROM zz5_formulaires WHERE zz_fo_clerequete IS NOT NULL AND SUBSTRING(zz_fo_code, 4, 3) = '".$this->application['code']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_fo_requete AS requete FROM zz5_formulaires WHERE zz_fo_requete IS NOT NULL AND SUBSTRING(zz_fo_code, 4, 3) = '".$this->application['code']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_gc_requete AS requete FROM zz5_ongletsControles WHERE zz_gc_requete IS NOT NULL AND SUBSTRING(zz_gc_code, 4, 3) = '".$this->application['code']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_li_requete AS requete FROM zz5_listes WHERE zz_li_requete IS NOT NULL AND SUBSTRING(zz_li_code, 4, 3) = '".$this->application['code']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_et_requete AS requete FROM zz5_etats WHERE zz_et_requete IS NOT NULL AND SUBSTRING(zz_et_code, 4, 3) = '".$this->application['code']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT zz_ca_requete AS requete FROM zz5_cartes WHERE zz_ca_requete IS NOT NULL AND SUBSTRING(zz_ca_code, 4, 3) = '".$this->application['code']."' ";
		$requete .= "UNION ";
		$requete .= "SELECT DISTINCT ZZ_RG_CibleObjet AS Requete FROM zz5_regles WHERE ZZ_RG_Action = 'requeteExecuter' AND SUBSTRING(zz_rg_code, 4, 3) = '".$this->application['code']."' ";
		$requetesArray = $this->application['dbSource']->fetchAll($requete);
		$requeteListe = '';
		foreach($requetesArray as $requeteItem) $requeteListe .= $requeteItem['requete'].",";
		$table = "zz5_requetes";
		$champsSource = self::transfertChampsSource($table);
		$condition = "LOCATE(zz_rq_code,'".$requeteListe."')";
		self::transfertInsert($table,$champsSource,$condition);
		$this->application['message'] .= "\n\nRequêtes : ".$requeteListe;
	}//end function	
	
	private function transfertStructuresVerifier(){
		$erreur = '';
		foreach($this->application['tablesNom'] as $table){
			$tableSource = $this->application['dbSource']->fetchAll("SHOW COLUMNS FROM ".$table);
			$tableDestination = $this->application['dbDestination']->fetchAll("SHOW COLUMNS FROM ".$table);
			$this->application['erreur'] = (count($tableSource) != count($tableDestination));
			if($this->application['erreur']){
				$this->application['message'] .= "Nombre de champs DIFFERENTS entre la source et la destination pour la table : ".$table."\n";
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
			$this->application['erreur'] = true;
			$this->application['message'] .= "\n\nstructures de tables différentes entre les 2 bases : \n\n".$erreur;
		}//end if
	}//end function	
		
}//end class