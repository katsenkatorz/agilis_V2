<?php
class AdresseController extends Zend_Controller_Action {
	private $objet;	
	
	public function verifierAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->verifier();
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Adresse();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setAdresse($variables);	
	}//end function	
		
}//end class