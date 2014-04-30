<?php
class RechercheController extends Zend_Controller_Action {
	private $objet;	
	
	public function afficherAction() {
		self::setObjet();
		$this->view->recherche = $this->objet->getRechercheView();
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Recherche();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setRecherche($variables);
	}//end function

}//end class