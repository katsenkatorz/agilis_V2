<?php
class SessionController extends Zend_Controller_Action {
	private $objet;	
	
	public function lireAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getSessionXml();
		$this->_forward('creer','xml',null,$array);		
	}//end function
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Session();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setSession($variables);
	}//end function
		
}//end class