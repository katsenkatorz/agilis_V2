<?php
class RequeteController extends Zend_Controller_Action {
	private $objet;	
	
	public function executerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getRequeteResultat();
		$this->_forward('creer','xml',null,$array);
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Requete();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setRequete($variables);
	}//end function	
	
}//end class