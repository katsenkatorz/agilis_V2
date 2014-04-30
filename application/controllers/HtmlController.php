<?php
class HtmlController extends Zend_Controller_Action {
	private $objet;	
	
	public function afficherAction(){
		self::setObjet();		
		$this->view->html = $this->objet->getHtmlView();
	}//end function

	public function chargerAction(){
		self::setObjet();
		$array['resultat'] = $this->objet->getHtmlXml();
		$this->_forward('creer','xml',null,$array);
	}//end function	
	
	public function blancAction(){
	}//end function	
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Html();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setHtml($variables);
	}//end function	
	
}//end class