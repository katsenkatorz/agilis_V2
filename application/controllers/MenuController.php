<?php
class MenuController extends Zend_Controller_Action {
	private $objet;	
	
	public function afficherAction(){
		self::setObjet();
		$this->objet->setSession();
		$this->view->menu = $this->objet->getMenuView();
	}//end function

	public function chargerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getMenuXml();
		$this->_forward('creer','xml',null,$array);		
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Menu();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setMenu($variables);
	}//end function	
	
}//end class