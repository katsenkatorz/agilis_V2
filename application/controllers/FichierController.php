<?php
class FichierController extends Zend_Controller_Action {
	private $objet;	
	
	public function listerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getFichierXml();		
		$this->_forward('creer','xml',null,$array);
	}//end function
	
	public function supprimerAction(){
		self::setObjet();
		$this->objet->supprimeFichiers();	
	}//end function

	public function detruireAction(){
		self::setObjet();
		$this->objet->supprimeDossier();
	}//end function	
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Fichier();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setFichier($variables);		
	}//end function	
	
}//end class