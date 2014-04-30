<?php
class CarteController extends Zend_Controller_Action{
	private $objet;	
	
	public function afficherAction(){
		self::setObjet();
		$this->view->carte = $this->objet->getCarteView();
	}// end function

	public function chargerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getCarteXml();
		$this->_forward('creer','xml',null,$array);
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Carte();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setCarte($variables);
	}//end function	
	
}// end class