<?php

$query   = "LOAD DATA INFILE './files/temp/CDR_Valo.csv' ";
$query  .= "INTO TABLE CD_DossiersImport FIELDS TERMINATED BY ';' LINES TERMINATED BY '\n' ";
$query  .= "IGNORE 1 LINES";

//$query   = "select 1";

$link = mysql_connect("10.135.18.86", "phxdev", "phxdev")
or die("Impossible de se connecter : " . mysql_error());

$db_selected = mysql_select_db('phxdev', $link);
if (!$db_selected) {
	die ('Impossible de s�lectionner la base de donn�es : ' . mysql_error());
}


// Ex�cution de la requ�te
$result = mysql_query($query);

// V�rification du r�sultat
// Ceci montre la requ�te envoy�e � MySQL ainsi que l'erreur. Utile pour d�boguer.
if (!$result) {
	$message  = 'Requ�te invalide : ' . mysql_error() . "</br></br>\n";
	$message .= 'Requ�te : ' . $query;
	die($message);
}

echo $result;

?>