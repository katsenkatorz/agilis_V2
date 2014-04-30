<?php
class DevController extends Zend_Controller_Action {
	private $objet;
	
	public function transfertapplicationslisterAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getTransfertApplications();
		$this->_forward('creer','xml',null,$array);
	}//end function	
	
	public function transferrerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->transferrer();		
		$this->_forward('creer','xml',null,$array);
	}//end function	
	
	private function setObjet(){
		$v = $this->_request->getParam('variables');
		$variables = xmlToArray(xa($this->_request->getParam('variables')));	
		$this->objet = new Agilis_Model_Dev($variables);
	}//end function
	
}//end class