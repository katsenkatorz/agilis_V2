function uploadClose(cible){
	window.opener.formulaire.reglesExecuter('all','fichiersLister',cible);
	window.opener.formulaire.reglesExecuter(cible + '.afterupload','all','all');
	window.close();
}//end function