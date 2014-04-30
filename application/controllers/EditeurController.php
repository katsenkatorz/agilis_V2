<?php
class EditeurController extends Zend_Controller_Action {
	private $objet;	
	
	public function sauvegarderAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->sauvegarder();
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Editeur();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setEditeur($variables);	
	}//end function	
		
}//end class