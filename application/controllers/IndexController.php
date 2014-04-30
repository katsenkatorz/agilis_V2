<?php
//require_once 'Zend/Session.php';

class IndexController extends Zend_Controller_Action {
	
	public function indexAction(){
		//démarrage de la session
		Zend_Session::setOptions(array('cache_limiter'=>'private, must-revalidate'));
		self::setObjet();
		$this->objet->identifier();
		$variables['variables'] = ax(arrayToXml($this->objet->getVariables()));
		$this->_forward('initialiser','habilitation',null,$variables);
	}//end function
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Index();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setVariables($variables);
	}//end function
		
}//end class