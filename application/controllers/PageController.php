<?php
class PageController extends Zend_Controller_Action {
	private $objet;	
	
	public function afficherAction(){
		self::setObjet();
		$page = $this->objet->getPage();
		$controleur = $page['controleur'];
		//Si page sans cadre
		if($controleur){
			$variables['variables'] = ax(arrayToXml($page['variables']));
			$this->_forward('afficher',$controleur,null,$variables);
		}else{
			$this->view->page = $page;
		}//end if
	}//end function

	private function setObjet(){
		$this->objet = new Agilis_Model_Page();
		$variables = xmlToArray(xa($this->_request->getParam('variables')));
		$this->objet->setPage($variables);
	}//end function	
	
}//end class