<?
include $_SERVER["DOCUMENT_ROOT"]."/Php/Global.php";

echo date("d-m-Y H:i:s")." Début de l'importation Derco"."<br>";

//Connexion à la base de données
F_Connexion();

	//Suppression des données de la table CDR_derco
	$Requete = "TRUNCATE TABLE CDR_derco";
	$Resultat = mysql_query($Requete) or die ("Erreur RAZ CDR_derco : ".mysql_error());

	//Importation des données Derco dans la table CDR_derco
	$Requete = "LOAD DATA LOCAL INFILE '../Files/42C/Derco.csv' ";
	$Requete.= "INTO TABLE CDR_derco ";
	$Requete.= "FIELDS TERMINATED BY ';' ";
	$Requete.= "LINES TERMINATED BY '\n' ";
	$Requete.= "IGNORE 1 LINES ";

	$Requete.="( )";
	
	$Resultat = mysql_query($Requete) or die (" Erreur Derco : ".mysql_error());
	echo date("d-m-Y H:i:s")."   Importation Derco terminée"."<br>";

	// ***************** Traitement ***************	
	$Requete = "SELECT * ";
	$Requete .= "FROM CDR_derco ";
	$Requete .= "WHERE cd_dc_CodePostal IS NOT Null ";
	
	$Result = mysql_query($Requete) or die ("Erreur : ".mysql_error()."<br><br>Requete : ".$Requete);
	$NbLignesDossier = mysql_num_rows ($Result,0);
	
	while ($myrow = mysql_fetch_array($Result)) {
		$Annee = substr(date("Y"),2,2);
		$Departement = substr($myrow["cd_dc_CodePostal"],1,2);

		// Ajout d'un Nx Dossier Elagage
		$Requete = "SELECT MAX(cd_do_Code) AS codemax FROM cdr_dossiers ";
		$Requete .= "WHERE LEFT(cd_do_Code,2)=\"" . $Annee . "\" AND ";
		$Requete .= "MID(cd_do_Code,4,2)=\"" . $Departement . "\"";
	
		$result1 = mysql_query($Requete);
		$myrow1 = mysql_fetch_array($result1);
	
		echo "CodeMax: "	.$myrow1["codemax"]."<br>";

		if ($myrow1["codemax"] == null) {
			$Sequence = "0001";
		}else{
			$Sequence = substr(substr($myrow1["codemax"],6,4) + 10001,1,4);
		}//end if
	
		// initialisation
		$Code = "'".$Annee . "-" . $Departement . "-" . $Sequence."'";
		echo "Code:" .$Code;
/*			
		if ($myrow["GDP_DO_Entite"]) {$Entite = "'".$myrow["GDP_DO_Entite"]."'";}
		else {$Entite = "Null";}
		if ($myrow["GDP_DO_As"]) {$AsCode = "'".$myrow["GDP_DO_As"]."'";}
		else {$AsCode = "Null";}
		$Dateimport = "'".date("Y-m-d")."'";
		$Contexte = "'SAV'";
		if ($myrow["GDP_DO_AsCentre"]) {$Centre = "'".$myrow["GDP_DO_AsCentre"]."'";}
		else {$Centre = "Null";}
		if ($myrow["GDP_DO_AsZone"]) {$Zone = "'".$myrow["GDP_DO_AsZone"]."'";}
		else {$Zone = "Null";}
		if ($myrow["GDP_DO_AsNumeroDesignation"]) {$Nd = "'".$myrow["GDP_DO_AsNumeroDesignation"]."'";}
		else {$Nd = "Null";}
		if ($myrow["GDP_DO_DescriptionEquipement"]) {$DescEquip = "'".$myrow["GDP_DO_DescriptionEquipement"]."'";}
		else {$DescEquip = "Null";}
		if ($myrow["GDP_DO_AsCommentaire"]) {$AsCommentaire = "'".addslashes($myrow[(GDP_DO_AsCommentaire)])."'";}
		else {$AsCommentaire = "Null";}
		if ($myrow["C42_CE_Departement"]) {$Departement = "'".$myrow["C42_CE_Departement"]."'";}
		else {$Departement = "Null";}
		if ($myrow["GDP_DO_Commune"]) {$Commune = "\"".$myrow["GDP_DO_Commune"]."\"";}
		else {$Commune = "Null";}
		if ($myrow["GDP_DO_AsDateCreation"]) {$DateCreation = "'".$myrow["GDP_DO_AsDateCreation"]."'";}
		else {$DateCreation = "Null";}
		if ($myrow["GDP_DO_AsDateAnnulation"]) {$DateAnnulation = "'".$myrow["GDP_DO_AsDateAnnulation"]."'";}
		else {$DateAnnulation = "Null";}
		if ($myrow["GDP_DO_AsCommentaireAnnulation"]) {$CommentaireAnnulation = "'".addslashes($myrow[GDP_DO_AsCommentaireAnnulation])."'";}
		else {$CommentaireAnnulation = "Null";}
		if ($myrow["GDP_DO_NumeroDemande42c"]) {$Demande42c = "\"".$myrow["GDP_DO_NumeroDemande42c"]."\"";}
		else {$Demande42c = "Null";}
	
		$Requete = "INSERT INTO CDR_Dossiers( ";
		$Requete .= "EL_DO_Code, ";
		$Requete .= "EL_DO_AsNumero, ";
		$Requete .= "EL_DO_Entite, ";
		$Requete .= "EL_DO_DateImport, ";
		$Requete .= "EL_DO_Contexte, ";
		$Requete .= "EL_DO_Centre, ";
		$Requete .= "EL_DO_Zone, ";
		$Requete .= "EL_DO_Tete, ";
		$Requete .= "EL_DO_AsDateCreation, ";
		$Requete .= "EL_DO_AsCommentaire, ";
		$Requete .= "EL_DO_Departement, ";
		$Requete .= "EL_DO_CommuneLibelle ) ";
		$Requete .= "VALUES ( ";
		$Requete .= "$Code, ";
		$Requete .= "$AsCode, ";
		$Requete .= "$Entite, ";
		$Requete .= "$Dateimport, ";
		$Requete .= "$Contexte, ";
		$Requete .= "$Centre, ";
		$Requete .= "$Zone, ";
		$Requete .= "$DescEquip, ";
		$Requete .= "$DateCreation, ";
		$Requete .= "$AsCommentaire, ";
		$Requete .= "$Departement, ";
		$Requete .= "$Commune )";
		//echo "REQ: ".$Requete."<br>";
			
		//Exécution de la requête SQL
		$insert = mysql_query($Requete) or die("Erreur Import GDP : ".mysql_error());
*/
	}
	echo date("d-m-Y H:i:s")." Importation GDP/Elagage terminée "."<br>";
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	$Connexion = mysql_close();



/*
echo "<script>
	var obj_window = window.open('', '_self');
	obj_window.opener = window;
	obj_window.focus();
	opener=self;
	self.close();
</script>";
*/

?>