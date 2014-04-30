<?php

$query   = "LOAD DATA INFILE './files/temp/CDR_Valo.csv' ";
$query  .= "INTO TABLE CD_DossiersImport FIELDS TERMINATED BY ';' LINES TERMINATED BY '\n' ";
$query  .= "IGNORE 1 LINES";

//$query   = "select 1";

$link = mysql_connect("10.135.18.86", "phxdev", "phxdev")
or die("Impossible de se connecter : " . mysql_error());

$db_selected = mysql_select_db('phxdev', $link);
if (!$db_selected) {
	die ('Impossible de sélectionner la base de données : ' . mysql_error());
}


// Exécution de la requête
$result = mysql_query($query);

// Vérification du résultat
// Ceci montre la requête envoyée à MySQL ainsi que l'erreur. Utile pour déboguer.
if (!$result) {
	$message  = 'Requête invalide : ' . mysql_error() . "</br></br>\n";
	$message .= 'Requête : ' . $query;
	die($message);
}

echo $result;

?>