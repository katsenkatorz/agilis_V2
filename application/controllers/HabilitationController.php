<?php
class HabilitationController extends Zend_Controller_Action {
	private $objet;	
	
	public function initialiserAction(){
		self::setObjet();
		$this->objet->initialiser();
		$this->objet->frameSet();
		$habilitation = $this->objet->getHabilitation();
		if($habilitation['frameset']){
			$this->view->habilitation = $habilitation;
		}else{
			$variables['variables'] = ax(arrayToXml($habilitation['variables']));
			$this->_forward('afficher','page',null,$variables);
		}//end if
	}//end function	
	
	private function setObjet(){
		$this->objet = new Agilis_Model_Habilitation();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setVariables($variables);
	}//end function
	
}//end class