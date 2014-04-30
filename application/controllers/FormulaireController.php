<?php
class FormulaireController extends Zend_Controller_Action {
	private $_objet;
	
	public function afficherAction(){
		self::setObjet();
		$this->view->formulaire = $this->_objet->getFormulaire();
	}//end function

	public function chargerAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->getFormulaire();
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	public function dataAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->getDataXml();		
		$this->_forward('creer','xml',null,$array);
	}//end function	

	public function enregistrerAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->enregistrer();
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	public function supprimerAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->supprimer();
		$this->_forward('creer','xml',null,$array);
	}//end function	

	public function verifiercleAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->verifierCle();
		$this->_forward('creer','xml',null,$array);	
	}//end function
	
	public function selecteurAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->selecteur();
		$this->_forward('creer','xml',null,$array);	
	}//end function
	
	public function deverrouillerAction(){
		self::setObjet();
		$array['resultat'] = $this->_objet->verrouSupprimer();
		$this->_forward('creer','xml',null,$array);
	}//end function	

	private function setObjet(){
		$this->_objet = new Agilis_Model_Formulaire();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->_objet->setFormulaire($variables);			
	}//end function
	
}//end class