formulaire = new Formulaire();
apresChargementExecuter("formulaireInitialiser()");

function formulaireInitialiser(){
	formulaire.formulaireCharger();
	formulaire.formulaireActualiser();
	document.onkeyup = formulaire.evenementClavier;	
}//end function