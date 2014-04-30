<?php
$action = $_POST["Action"];
$parametres = $_POST["Parametres"];

//Chargement des fonctions globales
include $_SERVER["DOCUMENT_ROOT"]."/Php/Global.php";
//Connexion à la base de données
F_Connexion();

switch($action) {
	case "Renumerote":
		renumerote($parametres);
		break;
}//end switch

function renumerote($formulaireCode) {
	//Chargement des controles du formulaire	
	$requete = "SELECT ZZ_FC_Code, ZZ_FC_Parent FROM ZZ_FormulairesControles WHERE ZZ_FC_Code like '$formulaireCode%' ORDER BY ZZ_FC_Code";
	$controles = mysql_query($requete);

	//Elaboration de la table de MAJ
	$tableCodes = array();	
	$numero = 0;
	while ($controle = mysql_fetch_assoc($controles)) {
		$code = $controle["ZZ_FC_Code"];
		$parent = $controle["ZZ_FC_Parent"];
		$tableCodes[$code]['newCode'] = $formulaireCode."-".substr("00".++$numero,-3);
		if($parent) $tableCodes[$code]['newParent'] = $tableCodes[$parent]['newCode'];
	}//end while

	//Suffixe sur les anciens codes pour contourner la clé primaire
	$requete = "UPDATE ZZ_FormulairesControles SET ZZ_FC_Code = CONCAT(ZZ_FC_Code,'Z') WHERE ZZ_FC_Code like '$formulaireCode%'";
	mysql_query($requete);
	
	//Mise à jour des codes
	foreach($tableCodes as $oldCode => $ligneCodes) {
		$requete = "UPDATE ZZ_FormulairesControles SET ";
		$requete .= "ZZ_FC_Code = '".$ligneCodes['newCode']."',";
		if($ligneCodes['newParent'] == '') {
			$requete .= "ZZ_FC_Parent = NULL ";			
		}else{
			$requete .= "ZZ_FC_Parent = '".$ligneCodes['newParent']."' ";
		}//end if
		$requete .= "WHERE ZZ_FC_Code ='".$oldCode."Z'";
		echo $requete."<br>";
		mysql_query($requete);
	}//end while
}//end function
?>