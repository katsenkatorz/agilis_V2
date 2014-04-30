<?php
class ListeController extends Zend_Controller_Action {
	private $objet;
	
	public function afficherAction(){
		self::setObjet();
		$this->view->liste = $this->objet->getListeView();
	}//end function
	
	public function chargerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getListeXml();
		$this->_forward('creer','xml',null,$array);
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Liste();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setListe($variables);
	}//end function	

}//end class