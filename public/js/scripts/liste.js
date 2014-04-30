var liste = new Liste();
apresChargementExecuter("listeChargement()");

function listeChargement(){
	liste.listeInitialiser();
	liste.Flotter();
	document.onkeyup = liste.evenementClavier;
}//end function