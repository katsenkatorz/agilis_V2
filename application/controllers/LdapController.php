<?php
class LdapController extends Zend_Controller_Action {
	private $objet;	
	
	public function individuAction() {
		self::setObjet();		
		$array['resultat'] = $this->objet->getIndividu();
		$this->_forward('creer','xml',null,$array);
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Ldap();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setLdap($variables);
	}//end function	
	
}//end class