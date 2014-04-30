<?php
class Agilis_Model_Formulaire {
	private $db;
	private $variables;
	private $session;
	private $formulaire;
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->session = new Zend_Session_Namespace('session');
		$this->formulaire = array();
	}//end function

	public function setFormulaire($variables){
		$this->variables = $variables;		
		$this->formulaire['variables'] = $variables;
		$this->formulaire['session'] = self::formulaireSession();
		$this->formulaire['code'] = $variables['var_formulaire_code'];
		$this->formulaire['proprietes'] = self::formulaireProprietes();
		$this->formulaire['cle'] = self::formulaireCle();
		$this->formulaire['onglets'] =	self::formulaireOnglets();	
		$this->formulaire['controles'] = self::formulaireControles();
		$this->formulaire['largeur'] =	self::formulaireLargeur();	
		$this->formulaire['regles'] = self::formulaireRegles();
		$this->formulaire['data'] = self::formulaireData();
		$this->formulaire['verrou'] = self::verrouPoser();
	}//end function

	public function getFormulaire(){
		return $this->formulaire;
	}//end function
	
	public function getDataXml(){
		$dataXml["data"] = $this->formulaire['data'];
		$dataXml["verrou"] = $this->formulaire['verrou'];
		return $dataXml;
	}//end function	
	
	private function formulaireSession(){
		$session = new Agilis_Model_Session();
		return $session->getSessionXml();
	}//end function
	
	private function formulaireProprietes(){
		$requete = "SELECT * FROM zz5_formulaires WHERE zz_fo_code = '".$this->formulaire['code']."'";
		$formulaireProprietes = $this->db->fetchRow($requete);
		return $formulaireProprietes;
	}//end function

	private function formulaireCle(){
		$formulaireCle = (empty($this->variables['var_formulaire_cle']) ? '' : $this->variables['var_formulaire_cle']);
		return $formulaireCle;
	}//end function	
	
	private function formulaireOnglets(){
		$requete  = "SELECT zz5_onglets.*,zz5_formulairesonglets.* FROM zz5_onglets ";
		$requete .= "INNER JOIN zz5_formulairesonglets ON zz_fg_onglet = zz_gl_code	";
		$requete .= "WHERE SUBSTRING_INDEX(zz_fg_code,'_',3) = '".$this->formulaire['code']."' ";
		$requete .= "ORDER BY zz_fg_code";
		$formulaireOnglets = $this->db->fetchAll($requete);
		return $formulaireOnglets;
	}//end function
	
	private function formulaireControles(){
		$requete  = "SELECT zz5_ongletscontroles.* FROM zz5_ongletscontroles ";
		$requete .= "WHERE SUBSTRING_INDEX(zz_gc_code, '_', 3) IN ";
		$requete .= "(SELECT zz_fg_onglet FROM zz5_formulairesonglets ";
		$requete .= "WHERE SUBSTRING_INDEX(zz_fg_code, '_', 3) = '".$this->formulaire['code']."') ";
		$requete .= "ORDER BY SUBSTRING_INDEX(zz_gc_code, '_', 3),zz_gc_position";		
		$formulaireControles = $this->db->fetchAll($requete);
		return $formulaireControles;
	}//end function
	
	private function formulaireRegles(){
		$formulaireRegles = array();			
		$requete = "SELECT * FROM zz5_regles WHERE zz_rg_code like '".$this->variables['var_regles_code']."\\_%' ORDER BY zz_rg_code";
		$formulaireRegles = $this->db->fetchAll($requete);
		return $formulaireRegles;
	}//end function
	
	private function formulaireData(){
		$formulaireData = array();
		$formulaireTable = $this->formulaire['proprietes']["zz_fo_table"];
		$formulaireChampCle = $this->formulaire['proprietes']["zz_fo_cle"];
		$formulaireRequeteCode = $this->formulaire['proprietes']["zz_fo_requete"];
// 		if($formulaireRequeteCode AND !empty($this->formulaire['cle'])) {
		if($formulaireRequeteCode) {			
			//Récupération des données à partir d'une requête
			$requeteVariables = $this->variables;
			$requeteVariables['var_requete_code'] = $formulaireRequeteCode;
			if($this->formulaire['proprietes']["zz_fo_requetevariables"]){
				$variablesDefaut = xmlToArray($this->formulaire['proprietes']["zz_fo_requetevariables"]);
				$requeteVariables = array_merge($variablesDefaut,$requeteVariables);
			}//end if			
			$requeteObjet = new Agilis_Model_Requete();
			$requeteObjet->setRequete($requeteVariables);			
			$formulaireDataArray = $requeteObjet->getRequeteResultat();
			if(! empty($formulaireDataArray[0])) $formulaireData = $formulaireDataArray[0];
		}else{
			//Récupération des données à partir d'une table
			if($formulaireTable AND !empty($this->formulaire['cle'])) {
				$requete = "SELECT * FROM $formulaireTable WHERE $formulaireChampCle = '".$this->formulaire['cle']."'";
				$formulaireData = $this->db->fetchRow($requete);
			}//end if
		}//end if
		return $formulaireData;
	}//end function	

	private function formulaireLargeur(){
		$formulaireLargeur = 1250;
		if(! empty($this->variables['popup'])){
			$requete = "SELECT zz_pp_width FROM zz5_popup WHERE zz_pp_code = '".$this->variables['popup']."'";
			$formulaireLargeur = $this->db->fetchOne($requete);			
		}//end if
		return $formulaireLargeur;
	}//end function
	
	//Recherche l'existence de la valeur d'une clé dans la table associée au formulaire
	public function verifierCle(){
		$requete = "SELECT ".$this->formulaire['proprietes']['zz_fo_cle']." FROM ".$this->formulaire['proprietes']['zz_fo_table']." WHERE ".$this->formulaire['proprietes']['zz_fo_cle']." = '".$this->formulaire['cle']."'";
		$resultat = $this->db->fetchOne($requete);
		return $resultat;
	}//end function	
	
	//Retourne la valeur de la clé au sélecteur
	public function selecteur(){
		switch($this->variables['bouton']){
			case "premier": $requete = "SELECT ".$this->formulaire['proprietes']['zz_fo_cle']." FROM ".$this->formulaire['proprietes']['zz_fo_table']." ORDER BY ".$this->formulaire['proprietes']['zz_fo_cle']." LIMIT 1";break;
			case "precedent": $requete = "SELECT ".$this->formulaire['proprietes']['zz_fo_cle']." FROM ".$this->formulaire['proprietes']['zz_fo_table']." WHERE ".$this->formulaire['proprietes']['zz_fo_cle']." < '".$this->variables['cle']."' ORDER BY ".$this->formulaire['proprietes']['zz_fo_cle']." DESC LIMIT 1";break;
			case "suivant": $requete = "SELECT ".$this->formulaire['proprietes']['zz_fo_cle']." FROM ".$this->formulaire['proprietes']['zz_fo_table']." WHERE ".$this->formulaire['proprietes']['zz_fo_cle']." > '".$this->variables['cle']."' ORDER BY ".$this->formulaire['proprietes']['zz_fo_cle']." LIMIT 1";break;
			case "dernier": $requete = "SELECT ".$this->formulaire['proprietes']['zz_fo_cle']." FROM ".$this->formulaire['proprietes']['zz_fo_table']." ORDER BY ".$this->formulaire['proprietes']['zz_fo_cle']." DESC LIMIT 1";break;
		}//end switch
		$resultat = $this->db->fetchOne($requete);
		return $resultat;
	}//end function		

	public function enregistrer() {
		//Récupération de la clé
		$cle = $this->formulaire['proprietes']["zz_fo_cle"];
		$this->formulaire['cle'] = $this->variables[$cle];
						
		$verrou = self::verrouPoser();
		if($verrou['etat'] == 'nok'){
			$messageEnregistrer = $verrou['message'];
		}else{
			//Incrémentation éventuelle de la clé primaire
			if($this->variables[$cle] == '' and $this->formulaire['proprietes']["zz_fo_clerequete"] != ''){
				$requeteVariables = $this->variables;	
				$requeteVariables['var_requete_code'] = $this->formulaire['proprietes']["zz_fo_clerequete"];
				$cleVariables = xmlToArray($this->formulaire['proprietes']["zz_fo_clerequetevariables"]);
				foreach($cleVariables as $cleVariable => $champ){
					$requeteVariables[$cleVariable] = $this->variables[strtolower($champ)];
				}//end foreach
				$requeteObjet = new Agilis_Model_Requete();
				$requeteObjet->setRequete($requeteVariables);
				$codeNouveau = $requeteObjet->getRequeteResultat();
				$this->variables[$cle] = $codeNouveau[0]['codenouveau'];
			}//end if

			//Elaboration de la liste de maj pour la requête SQL
			$listeMaj = '';
			foreach($this->variables as $majChamp=>$majValeur){
				if(substr($majChamp,0,6) == substr($cle,0,6)){
					if($listeMaj != '') $listeMaj .= ",";
					if($majValeur == ''){
						$listeMaj .= $majChamp."=NULL";				
					}else{
						$listeMaj .= $majChamp."=\"".addslashes($majValeur)."\"";
					}//end if
				}//end if
			}//end foreach

			//Maj de la table
			$formulaireTable = $this->formulaire['proprietes']["zz_fo_table"];			
			$requete = "INSERT INTO $formulaireTable SET $listeMaj ON DUPLICATE KEY UPDATE $listeMaj";	
					
			$messageEnregistrer = (empty($this->variables[$cle]) ? 'Ok' : $this->variables[$cle]);
				
			try {$this->db->query($requete);} 
			catch (Exception $e) {$messageEnregistrer = "PROBLEME : données NON enregistrées !\nVeuillez transmettre la copie de ce message à l'équipe AGILIS.\n\n".$e->getMessage();}
		
			//Enregistrement de la requête dans le journal
//			if ($messageEnregistrer == $this->variables) {
				$data = array(
			    'ag2_jo_date' => date("Y-m-d H:i:s"),
			    'ag2_jo_habilitation' => $this->session->habilitation,
			    'ag2_jo_nom' => utf8_encode($this->session->prenom . " " . $this->session->nom),
			    'ag2_jo_libelle'=> utf8_encode($requete)
				);
				$this->db->insert('ag2_journal', $data);
//			}//end if
			
		}//end if
		return ($messageEnregistrer);
	}//end function	
	
	public function supprimer() {
		$formulaireTable = $this->formulaire['proprietes']["zz_fo_table"];
		$formulaireCle = $this->formulaire['proprietes']["zz_fo_cle"];	
		$requete = "DELETE FROM $formulaireTable WHERE $formulaireCle = '".$this->variables[$formulaireCle]."'";
		$messageSupprimer = "OK";
		try {$this->db->query($requete);} 
		catch (Exception $e) {$messageSupprimer = $e->getMessage();}
		return ($messageSupprimer);
	}//End function	

/*******************************************************************************
 * Gestion des Verrous
 *******************************************************************************
 */ 
	private function verrouPoser(){
		$verrou['etat'] = '';
		self::verrouSupprimer();
		if($this->formulaire['cle'] != ''){
			$verrou = self::verrouRechercher();
			if(empty($verrou)){
				$verrou = self::verrouInserer();
				$verrou['etat'] = 'ok';
			}else{
				$verrou['etat'] = 'nok';
				$verrou['message'] = "L'enregistrement ".$verrou['ad_ve_cle']." est actuellement verrouillé par ".$verrou['ad_ve_nom']." depuis le ".$verrou['ad_ve_date'].".\nLes modifications, enregistrement et suppression sont donc impossibles sur cet enregistrement.";
			}//end if
		}//end if
		return $verrou;
	}//end function

	private function verrouRechercher(){
		$requete = "SELECT AD_VE_Cle,AD_VE_Identifiant,AD_VE_Date,AD_VE_Nom FROM AD_Verrou WHERE AD_VE_Cle = '".$this->formulaire['cle']."' AND AD_VE_Table = '".$this->formulaire['proprietes']['zz_fo_table']."'";
		$verrou = $this->db->fetchRow($requete);
		return $verrou;
	}//end function
	
	private function verrouInserer(){
		$verrou = array(
			'ad_ve_date' 		=> date("Y-m-d H:i:s"),
			'ad_ve_cle' 		=> $this->formulaire['cle'],
			'ad_ve_table' 		=> $this->formulaire['proprietes']['zz_fo_table'],
			'ad_ve_identifiant'	=> $this->session->identifiant,
			'ad_ve_nom'			=> $this->session->prenom.' '.$this->session->nom
		);
		$this->db->insert('ad_verrou', $verrou);
		return $verrou;
	}//end function
	
	public function verrouSupprimer(){
		$requete = "DELETE FROM AD_Verrou WHERE AD_VE_Identifiant = '".$this->session->identifiant."' AND AD_VE_Table = '".$this->formulaire['proprietes']['zz_fo_table']."'";
		$this->db->query($requete);
	}//end function
	
}//end class
?>