<?php
class EtatController extends Zend_Controller_Action{
	private $objet;	
	
	public function afficherAction(){
		self::setObjet();
		$this->view->etat = $this->objet->getEtatView();
	}// end function

	private function setObjet(){	
		$this->objet = new Agilis_Model_Etat();		
		$variables = xmlToArray(xa($this->_request->getParam('variables')));		
		$this->objet->setEtat($variables);	
	}// end function
	
}// end class