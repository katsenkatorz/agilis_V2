<?php
class MailController extends Zend_Controller_Action {
	private $objet;	
	
	public function envoyerAction() {
		self::setObjet();
		$this->objet->send();
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Mail();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setMail($variables);
	}//end function	
	
}//end class
?>