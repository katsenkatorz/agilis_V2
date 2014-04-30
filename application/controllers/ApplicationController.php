<?php
class ApplicationController extends Zend_Controller_Action {
	private $objet;
	
	public function listerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->lister();
		$this->_forward('creer','xml',null,$array);
	}//end function	
	
	public function transferrerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->transferrer();		
		$this->_forward('creer','xml',null,$array);
	}//end function	
	
	public function supprimerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->supprimer();
		$this->_forward('creer','xml',null,$array);
	}//end function	
	
	private function setObjet(){
		$v = $this->_request->getParam('variables');
		$variables = xmlToArray(xa($this->_request->getParam('variables')));	
		$this->objet = new Agilis_Model_Application($variables);
	}//end function
	
}//end class