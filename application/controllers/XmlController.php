<?php
class XmlController extends Zend_Controller_Action {
	
	public function creerAction() {
		$this->view->resultat = $this->_request->getParam('resultat');
	}//end function

}//end class