<?php
//Chargement des fonctions globales
include $_SERVER["DOCUMENT_ROOT"]."/Php/Global.php";

$Masque = $_POST["Masque"];
$Chemin = $_SERVER["DOCUMENT_ROOT"].$_POST["Chemin"];
$Complet = $_POST["Complet"];

//Inclusion du répertoire PEAR dans le chemin de recherche
//ini_set("include_path",($_SERVER["DOCUMENT_ROOT"]."/PEAR"));
//Chargement du module FileFind
include "File/Find.php";

$ListeFichiers = File_Find::search($Masque, $Chemin ,"shell",true);

//************* CREATION DU FICHIER XML *************************************************************
header ('Content-type: text/xml');
echo "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>\n";
echo "<Data>\n";

foreach($ListeFichiers as $Fichier) {
	if ($Complet == "0") $Fichier = basename($Fichier);
	echo "<Script><![CDATA[".utf8_decode(urldecode($Fichier))."]]></Script>\n";
}//end while
echo "</Data>\n";
?>