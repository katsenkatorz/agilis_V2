<?php
class Agilis_Model_Editeur{
	private $db;
	private $editeur;		
	
	public function __construct(){
		$this->db = Zend_Registry::get('db');
		$this->editeur = array();				
	}//end function
	
	public function setEditeur($variables){
		
//		$variables['var_onglet_code'] = 'gl_dmo_clientsFiche';
//		$variables['gl_dmo_clientsFiche_code_input'] = 'gl_dmo_clientsFiche_code_input��1��champ2��valeur1��100��200��300��400��parent';
//		$variables['gl_xxx_test_code_input'] = 'gl_xxx_test_code_input��2��champ2��valeur2��100��200��300��400��parent';
//		$variables['gl_xxx_test_code_select'] = 'gl_xxx_test_code_select��4��champ3��valeur3��100��200��300��400��parent';
		
		$this->editeur['onglet'] = $variables['var_onglet_code'];
		unset($variables['var_onglet_code']);
		$this->editeur['controles'] = $variables;
	}//end function
	
	public function sauvegarder(){
		$requete = "SELECT LOWER(zz_gc_code) FROM zz5_ongletsControles WHERE SUBSTRING_INDEX(zz_gc_code,'_',3) = '".$this->editeur['onglet']."'";
		$controlesTables = $this->db->fetchCol($requete);
		$champs = array('code','position','champ','valeur','top','left','width','height','parent');

		foreach($this->editeur['controles'] as $cle => $valeurs){
			$valeursArray = split('��',$valeurs);
			$listeMaj = '';
			for($i = 0 ; $i < count($champs); $i++){
				if($listeMaj != '') $listeMaj .= ',';
				$valeur = ($valeursArray[$i] == '' ? "NULL" : "'".$valeursArray[$i]."'");
				$listeMaj .= "zz_gc_".$champs[$i]."=".$valeur;
			}//end for

			if(in_array($cle,$controlesTables)){
				$requete = "UPDATE zz5_ongletsControles SET $listeMaj WHERE zz_gc_code = '$cle'";
				$this->db->query($requete);
			}else{
				$requete = "INSERT INTO zz5_ongletsControles SET $listeMaj";
				$this->db->query($requete);	
			}//end if
		}//end foreach

		$listeMaj = '';	
		foreach($controlesTables as $controleTables){
			if(! array_key_exists($controleTables,$this->editeur['controles'])){
				if($listeMaj != '') $listeMaj .= ',';				
				$listeMaj .= "'".$controleTables."'";
			}//end if
		}//end foreach
		if($listeMaj != ''){
			$requete = "DELETE FROM zz5_ongletsControles WHERE zz_gc_code IN ($listeMaj)";
			$this->db->query($requete);
		}//end if			
	}//end function

}//end class	