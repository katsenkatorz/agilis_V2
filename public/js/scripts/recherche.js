var recherche = new Recherche();
apresChargementExecuter("rechercheChargement()");

function rechercheChargement(){
	recherche.Flotter();
	document.onkeyup = recherche.evenementClavier;
}//end function