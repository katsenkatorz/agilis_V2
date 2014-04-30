<?php
include_once 'global.php';
$dossier = $_POST['dossier'];
$liste = $_POST['liste'];

//echo "<body onUnload=\"uploadClose('".$liste."','".$dossier."');\">";
echo "<body onUnload=\"uploadClose('".$liste."');\">";

$uploadResultat = "";
$uploadTransfert = false;
$uploadDossier = AGILIS_ROOT.'/public/files/pj'.$dossier;
if (! is_dir($uploadDossier)) mkdir($uploadDossier,0777,true);

foreach ($_FILES["uploadfile"]["error"] as $key => $error) {
    if ($_FILES["uploadfile"]["error"][$key] == UPLOAD_ERR_OK) {
        $tmp_name = $_FILES["uploadfile"]["tmp_name"][$key];
        $name = $uploadDossier.'/'.utf8_encode($_FILES['uploadfile']['name'][$key]);
        $erreur = ! move_uploaded_file($tmp_name, $name);
    }else{
    	$erreur = ($_FILES["uploadfile"]["error"][$key] != UPLOAD_ERR_NO_FILE);
    }//end if
    if ($erreur) {
   		$uploadResultat .= "Fichier NON téléchargé : ".basename($_FILES['uploadfile']['name'][$key]);
    }else{
    	$uploadTransfert = True;
    }//end if
}//end for

if ($uploadTransfert && $uploadResultat == "") {
	$uploadResultat = "Fichier(s) transferé(s) avec succès.";
}//end if

echo $uploadResultat;
echo "</br></br>";
echo "</body>\n";

echo "<script type='text/javascript' src='".URL."/js/scripts/upload.js'></script>\n";
echo "<button onclick='window.close();'>Fermer</button>";