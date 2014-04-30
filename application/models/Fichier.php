<?php
//Chargement des fonctions globales
//include_once 'global.php';

class Agilis_Model_Fichier{
	private $variables;
	private $fichier;

	public function __construct() {
		$this->fichier = array();
	}//end function

	public function setFichier($variables){
		$this->variables = $variables;
		$this->fichier['dossier'] = $variables['var_fichier_dossier'];
		if(!empty ($variables['var_fichier_supprimer'])) $this->fichier['supprimer'] = $variables['var_fichier_supprimer'];
		$this->fichier['chemin'] = AGILIS_ROOT.'/public/files/pj'.$this->fichier['dossier'];		
	}//end function	

	public function getFichierXml(){
		$fichierXml = array();
		if(is_dir($this->fichier['chemin'])){
			$fichierArray = scandir($this->fichier['chemin']);
			foreach($fichierArray as $fichier){
				if(is_file($this->fichier['chemin'].'/'.$fichier)) $fichierXml[] = utf8_decode($fichier);
			}//end foreach
		}//end if
		return $fichierXml;
	}//end function
	
	public function supprimeFichiers(){
		$fichierArray = split(';',$this->fichier['supprimer']);
		foreach($fichierArray as $fichierNom){
			$fichier = utf8_encode($this->fichier['chemin'].'/'.$fichierNom);
			if(is_file($fichier)) unlink($fichier);
		}//end foreach
	}//end function
	
	public function supprimeDossier(){
		$dossier = utf8_encode(AGILIS_ROOT.'/public/files/pj'.$this->fichier['dossier']);
		clearDir($dossier);
	}//end function

}//end class