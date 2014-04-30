<?php
class Agilis_Model_Menu {
	private $db;
	private $session;
	private $variables;
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->session = new Zend_Session_Namespace('session');
		$this->variables = array();
	}//end function

	public function setMenu($variables){
		$this->variables = $variables;
	}//end function	
	
	public function setSession(){
		$this->session->habilitation = '-ag2-';
		$this->session->applicationCode = 'ag2';
		$this->session->applicationLibelle = 'Agilis';
		$this->session->profil = null;
//		$this->session->entite = null;
		$this->session->entitelibelle = null;
		$this->session->perimetre = null;
		
		//Si code habilitation dans l'URL
		if(! empty($this->variables['var_habilitation_code'])){
			$habilitation = $this->variables['var_habilitation_code'];
			$habilitationArray = split('-',strtolower($habilitation));			
			//Accès à DIESE à tous les utilisateurs ayant au moins une habilitation dans Agilis OU vérification de l'habilitation
			if($habilitationArray[1] == 'die'){
				$requete = "SELECT * FROM ag2_habilitations WHERE ag2_ha_identifiant='".$this->session->identifiant."' LIMIT 1";
			}else{
				$requete = "SELECT * FROM ag2_habilitations WHERE ag2_ha_code='".$habilitation."' AND ag2_ha_identifiant='".$this->session->identifiant."'";
			}//end if
			$resultat = $this->db->fetchRow($requete);
			if($resultat == ''){
				unset($this->variables['var_page_code']);
				unset($this->variables['var_formulaire_cle']);
			}else{
				$this->session->habilitation = $habilitation;
				$this->session->applicationCode = $habilitationArray[1];
				$this->session->applicationLibelle = self::applicationLibelle();
				$this->session->profil = $habilitationArray[1].'-'.$habilitationArray[3];
				$this->session->entite = $resultat['ag2_ha_entite'];
				$this->session->entiteLibelle = $resultat['ag2_ha_entitelibelle'];				
				$this->session->perimetre = $resultat['ag2_ha_perimetre'];
				self::connexionEnregistrer($habilitation,$this->session->nom);
			}//end if
		}//end if
	}//end function

	public function getMenuView(){
		$menuView['variables'] = $this->variables;
		$menuView['application']['libelle'] = $this->session->applicationLibelle;
		if($this->session->identifiant){
			$menuView['prenomNom'] = $this->session->prenom." ".$this->session->nom;
		}else{
			$menuView['prenomNom'] = "Identifiant non reconnu";
		}//end if
		$menuView['developpeur'] = $this->session->developpeur;
		return $menuView;
	}//end function
	
	public function getMenuXml(){
		$menuXml = array();
		$menuXml["items"] = self::menuItems();
		$menuXml["regles"] = self::menuRegles();
		return $menuXml;
	}//end function	
	
	private function applicationLibelle(){
		$requete = "SELECT zz_ap_libelle FROM zz5_applications WHERE zz_ap_code = '".$this->session->applicationCode."'";
		$applicationLibelle = $this->db->fetchOne($requete);
		return $applicationLibelle;
	}//end function

	private function menuItems(){
		$requete = "SELECT * FROM zz5_menus WHERE SUBSTRING_INDEX(zz_mn_code,'_',2) = 'mn_".$this->session->applicationCode."' ORDER BY zz_mn_position";
		$menuItems = $this->db->fetchAll($requete);
		return $menuItems;
	}//end function

	private function menuRegles(){
		$requete  = "SELECT * FROM zz5_regles ";
		$requete .= "WHERE zz_rg_code like 'rg_".$this->session->applicationCode."_accueil_menu\\_%' ";
		if($this->session->developpeur){
			$requete .= "OR zz_rg_code like 'rg_ag2_accueil_menu\\_%' ";
		}//end if
		$requete .= "ORDER BY zz_rg_code";
		$menuRegles = $this->db->fetchAll($requete);
		return $menuRegles;
	}//end function	

	private function connexionEnregistrer($habilitation,$nom){
		$data = array(
			'ag2_co_date' => new Zend_Db_Expr('NOW()'),
			'ag2_co_habilitation' => $habilitation,
			'ag2_co_nom' => $nom
		);
		$this->db->insert('ag2_connexions', $data);
	}//end function
	
}//end class