<?php
class Agilis_Model_Mail{
	private $mail;

	public function __construct() {
		$this->mail = array();
	}//end function

	public function setMail($variables){
		$this->mail['expediteur'] = $variables['var_mail_expediteur'];
		$this->mail['destinataires'] = $variables['var_mail_destinataires'];
		$this->mail['copies'] = $variables['var_mail_copies'];	
		$this->mail['cachees'] = $variables['var_mail_cachees'];		
		$this->mail['objet'] = $variables['var_mail_objet'];
		$this->mail['contenu'] = $variables['var_mail_contenu'];
		$this->mail['fichiers'] = $variables['var_mail_fichiers'];		
	}//end function	

	public function send(){
		$zendMailObjet = new Zend_Mail();
		$zendMailObjet->setFrom('', $this->mail['expediteur']);
		$destinataires = split(';',$this->mail['destinataires']);
		foreach($destinataires as $destinataire) $zendMailObjet->addTo($destinataire);
		$copies = split(';',$this->mail['copies']);
		foreach($copies as $copie) $zendMailObjet->addCc($copie);
		$cachees = split(';',$this->mail['cachees']);
		foreach($cachees as $cachee)$zendMailObjet->addBcc($cachee);
		$zendMailObjet->setSubject($this->mail['objet']);
		$zendMailObjet->setBodyHtml($this->mail['contenu']);
		if($this->mail['fichiers'] != ''){
			$fichiers = split(';',$this->mail['fichiers']);
			foreach($fichiers as $fichier){
				$fichierContenu = file_get_contents(AGILIS_ROOT.$fichier);
				$attachement = $zendMailObjet->createAttachment($fichierContenu);
				$attachement->filename = basename($fichier);
			}//foreach
		}//end if
		$zendMailObjet->send();
	}//end function	
		
}//end class	