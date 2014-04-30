<?php
class ControleController extends Zend_Controller_Action {
	private $objet;	
	
	public function selectinitialiserAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getSelectData();
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	public function uniqueAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->estUnique();
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Controle();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setControle($variables);	
	}//end function	
		
}//end class