<?php
class Agilis_Model_Habilitation {
	private $db;
	private $session;
	private $variables;
	private $habilitation;
	private $application;
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->session = new Zend_Session_Namespace('session');
	}//end function

	public function setVariables($variables){
		$this->variables = $variables;
	}//end function
	
	public function initialiser(){
		$habilitation = (empty($this->variables['var_habilitation_code']) ? '-ag2-' : $this->variables['var_habilitation_code']);
		$habilitationArray = split('-',strtolower($habilitation));
		$this->application = $habilitationArray[1];

/*		
		//Initialisation de session restreinte pour le développeur (DEV)
		if($this->application == 'dev'){
			$requete = "SELECT * FROM ag2_habilitations WHERE ag2_ha_code='".$habilitation."' AND ag2_ha_application = 'dev'";
			$resultat = $this->db->fetchRow($requete);
			$this->session->entite = $resultat['ag2_ha_entite'];
			$this->session->entiteLibelle = $resultat['ag2_ha_entitelibelle'];			
		}else{	
*/		
		if($this->application != 'dev'){		
			$this->session->habilitation = '-ag2-';
			$this->session->applicationCode = 'ag2';
			$this->session->applicationLibelle = 'Agilis';
			$this->session->profil = null;
			$this->session->perimetre = null;
			
			//Si le code habilitation n'est pas vide
			if(! empty($habilitation)){
				//Accès à DIESE à tous les utilisateurs ayant au moins une habilitation dans Agilis OU vérification de l'habilitation
				if($habilitationArray[1] == 'die'){
					$requete = "SELECT * FROM ag2_habilitations WHERE ag2_ha_identifiant='".$this->session->identifiant."' LIMIT 1";
				}else{
					$requete = "SELECT * FROM ag2_habilitations WHERE ag2_ha_code='".$habilitation."' AND ag2_ha_identifiant='".$this->session->identifiant."'";
				}//end if
				$resultat = $this->db->fetchRow($requete);
				//Pas de création de session si pas d'habilitation ou Atelier de développement (DEV)
				if($resultat == ''){
					unset($this->variables['var_frame_code']);
					unset($this->variables['var_page_code']);
					unset($this->variables['var_formulaire_cle']);
				}else{
					$this->session->habilitation = $habilitation;
					$this->session->applicationCode = $habilitationArray[1];
					$this->session->applicationLibelle = $resultat['ag2_ha_applicationlibelle'];
					$this->session->profil = $habilitationArray[1].'-'.$habilitationArray[3];
					$this->session->entite = $resultat['ag2_ha_entite'];
					$this->session->entiteLibelle = $resultat['ag2_ha_entitelibelle'];
					$this->session->perimetre = $resultat['ag2_ha_perimetre'];
					self::connexionEnregistrer($habilitation,$this->session->nom);
				}//end if
			}//end if
		}//end if	
	}//end function
	
	public function frameSet(){
		$requete = "SELECT ZZ_AP_Page,ZZ_AP_FrameSet FROM zz5_applications WHERE zz_ap_code = '".$this->application."' ";
		$resultat = $this->db->fetchRow($requete);
		$this->habilitation['frameset'] = $resultat['zz_ap_frameset'];
		if(empty($this->habilitation['frameset'])){
			if(empty($this->variables['var_page_code'])) $this->variables['var_page_code'] = $resultat['zz_ap_page'];
		}else{	
			$requete = "SELECT * FROM zz5_applicationsframes WHERE zz_af_code like 'af_".$this->application."%' ORDER BY zz_af_position";
			$resultat = $this->db->fetchAll($requete);
			$this->habilitation['frames'] = $resultat;
		}//end if
	}//end function
	
	public function getHabilitation(){
		$this->habilitation['variables'] = $this->variables;
		$this->habilitation['applicationCode'] = $this->application;
		return $this->habilitation;
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