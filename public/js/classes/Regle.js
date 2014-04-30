//Classe des règles
function Regle(){
	
	//Déclaration des variables privées
	var actions = new Array();
	var regleArray = new Array();

	//Constructeur de la classe
	actions = setActions();
	
	//***************************************************************************************
	//  Méthodes publiques de la classe
	//***************************************************************************************
	
	//Retourne le tableau des propriétés d'une action
	this.getAction = function(action){
		return actions[action];
	};//end function
	
	//Exécution des règles
	this.reglesExecuter = function(declencheurs,action,cibleObjet){
		var regleXml = this.reglesXml.firstChild;
		while(regleXml != null){
			setRegle(regleXml);	
			if((declencheurs == 'all' || regleArray['declencheurs'].indexOf(declencheurs) > -1) && (action == 'all' || regleArray['action'] == action) && (cibleObjet == 'all' || regleArray['cibleObjet'] == cibleObjet)){
				regleExecuter();
			}//end if
			regleXml = regleXml.nextSibling;
		}//end while
	};//end function

	
	//***************************************************************************************
	// Fonctions privées de la classe
	//***************************************************************************************
	
	//Intialisation du tableau des actions
	function setActions(){
		var t = new Array();
		var a = 'adresseVerifier'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=0; t[a]['ex']=1;		
		var a = 'applicationCharger'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=1;
		var a = 'applicationLister'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'applicationSupprimer'; 		t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=0; t[a]['ex']=1;		
		var a = 'applicationTransferrer'; 		t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=0; t[a]['ex']=1;		
		var a = 'carteActualiser'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=1;
		var a = 'cadresAfficher'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'cadresEntourer'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=0;
		var a = 'controlesLectureSeule'; 		t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'controlesAfficher'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'controlesObligatoire'; 		t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'controlesSelectActualiser'; 	t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'controleUnique'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'dossierSupprimer'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'expressionEvaluer'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=0; t[a]['ex']=1;
		var a = 'fichiersAjouter'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'fichiersEnvoyer'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=0; t[a]['ex']=0;
		var a = 'fichiersLister'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'fichiersOuvrir'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'fichiersSupprimer'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'formulaireActualiser'; 		t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=1;
		var a = 'formulaireAfficher'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'formulaireEffacer'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=0;
		var a = 'formulaireEnregistrer'; 		t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=0;
		var a = 'iconesAfficher'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'iconeLectureSeule'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'listeareaActualiser'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'listeareaInitialiser'; 		t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=0;
		var a = 'listeareaInserer'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'listeareaModifier'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=1;
		var a = 'listeareaSupprimer'; 			t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=0;
		var a = 'listeActualiser'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=1;
//		var a = 'listeSelectionner'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=0; t[a]['ex']=1;
		var a = 'mailEnvoyer'; 					t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=0; t[a]['ex']=1;
		var a = 'ongletsAfficher'; 				t[a] = new Array(); t[a]['cf']=0; t[a]['cc']=0; t[a]['co']=1; t[a]['ex']=0;
		var a = 'ongletLectureSeule'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'ongletOuvrir'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'ongletSelectionner'; 			t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=0;
		var a = 'pageAfficher'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=1;
		var a = 'requeteExecuter'; 				t[a] = new Array(); t[a]['cf']=1; t[a]['cc']=1; t[a]['co']=1; t[a]['ex']=1;
		return t;
	}//end function
	
	function setRegle(regleXml){
		regleArray['declencheurs'] = regleXml.getElementsByTagName('zz_rg_declencheurs')[0].firstChild.data;
		regleArray['action'] = regleXml.getElementsByTagName('zz_rg_action')[0].firstChild.data;
		var cibleFenetre = 'window';
		if(regleXml.getElementsByTagName('zz_rg_ciblefenetre')[0].firstChild){
			cibleFenetre = regleXml.getElementsByTagName('zz_rg_ciblefenetre')[0].firstChild.data;
			if(cibleFenetre.substr(0,1) == '=') eval('cibleFenetre' + cibleFenetre);
		}//end if
		regleArray['cibleFenetre'] = cibleFenetre;
		var cibleCadre = '';
		if(regleXml.getElementsByTagName('zz_rg_ciblecadre')[0].firstChild){
			cibleCadre = regleXml.getElementsByTagName('zz_rg_ciblecadre')[0].firstChild.data;
			if(cibleCadre.substr(0,1) == '=') eval('cibleCadre' + cibleCadre);
		}//end if
		regleArray['cibleCadre'] = cibleCadre;
		var cibleObjet = null;
		if(regleXml.getElementsByTagName('zz_rg_cibleobjet')[0].firstChild){
			cibleObjet = regleXml.getElementsByTagName('zz_rg_cibleobjet')[0].firstChild.data;
			if(cibleObjet.substr(0,1) == '=') eval('cibleObjet' + cibleObjet);
		}//end if
		regleArray['cibleObjet'] = cibleObjet;		
		regleArray['expression'] = (regleXml.getElementsByTagName('zz_rg_expression')[0].firstChild ? regleXml.getElementsByTagName('zz_rg_expression')[0].firstChild.data : null);			
		regleArray['condition'] = (regleXml.getElementsByTagName('zz_rg_condition')[0].firstChild ? regleXml.getElementsByTagName('zz_rg_condition')[0].firstChild.data : true);			
	}//end function
	
	function regleExecuter(){	
		var action = regleArray['action'];
		if(actions[action]) eval('action_' + action + '()');
	}//end function
	
	//***********************************************************************************************
	// ACTIONS
	// *********************************************************************************************

	//Vérification d'une adresse postale via ORAS
	function action_adresseVerifier(){
//		if(eval(regleArray['condition'])){
//			eval(regleArray['expression']);
//			var fieldset = formulaire.variables['var_adresse_fieldset'];
//			formulaire.adresseInitialiser(fieldset);		
		
		
		
		if(eval(regleArray['condition'])){
			var fieldset = regleArray['cibleObjet'];
			var adresse = fieldset.substring(0,fieldset.lastIndexOf('_'));
			window[adresse] = new Adresse();
			window[adresse].adresseInitialiser(adresse);
//		if(eval(regleArray['condition'])){
//		var controlesArray = regleArray['expression'].replace(/\r|\n/g,'').split(',');
//		for(var i = 0 ; i != controlesArray.length; i++){
//			formulaire.adresseInitialiser(controlesArray[i]);
//		}
		
		
		}//end if
	}//end function

	//Chargement d'une application
	function action_applicationCharger(){
		if(eval(regleArray['condition'])){
		    var variables = new Array();
			eval(regleArray['expression']);
			var variablesXml = ax(arrayToXml(variables));
			var uri = url + "/habilitation/initialiser?variables=" + variablesXml;		
			switch(regleArray['cibleFenetre']){
				case 'popup' :
					var parametres = variables['var_popup_parametres'];
					w = window.open(uri,'',parametres);
					break;
				default :
					var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));				
					cadre.location.href(uri);
			}//end switch
		}//end if
	}//end function
	
	//Lister les applications présentes sur un serveur
	function action_applicationLister(){
		if(eval(regleArray['condition'])){		
			var select = document.getElementById(regleArray['cibleObjet']);
			select.options.length = 0;
			var variables = new Array();
			eval(regleArray['expression']);
			var applicationsXml =ajax('application','lister',variables);
			var application = applicationsXml.getElementsByTagName('data')[0].firstChild;
			while(application != null){
				optionCode = application.firstChild.firstChild.data;
				select.options[select.length] = new Option(optionCode,optionCode);	
				application = application.nextSibling;
			}//end while
		}//end if
	}//end function

	//Suppression d'une application sur un serveur 
	function action_applicationSupprimer(){
		if(eval(regleArray['condition'])){			
			var variables = new Array();
			eval(regleArray['expression']);
			var suppressionXml =ajax("application","supprimer",variables);	
			var message = suppressionXml.getElementsByTagName('data')[0].firstChild.data;
			alert(message);
		}//end if		
	}//end function
	
	//Transfert d'une application d'un serveur à un autre
	function action_applicationTransferrer(){
		if(eval(regleArray['condition'])){	
			if(formulaire.formulaireControlesObligatoires()){
				var variables = new Array();
				eval(regleArray['expression']);	
				var transfertXml =ajax("application","transferrer",variables);	
				var message = transfertXml.getElementsByTagName('data')[0].firstChild.data;
				alert(message);
			}//end if
		}//end if
	}//end function

	//Affichage ou masquage des cadres d'une fenêtre
	function action_cadresAfficher(){
		var variables = new Array();
		eval(regleArray['expression']);
		var fenetre = eval(regleArray['cibleFenetre']);
		var cadresArray = fenetre.document.getElementsByTagName('iframe');
		for(var i = 0 ; i < cadresArray.length ; i++){
			if(regleArray['cibleObjet'].indexOf(cadresArray[i].id) > -1){
				cadresArray[i].style.display = (eval(regleArray['condition']) ? '' : 'none');
			}else{	
				cadresArray[i].style.display = (eval(regleArray['condition']) ? 'none' : '');		
			}//end if
		}//end for
	}//end function		

	function action_carteActualiser(){
		if(eval(regleArray['condition'])){
			var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
			var variables = new Array();
			eval(regleArray['expression']);
			cadre.carte.carteActualiser(variables);
		}//end if		
	};//end if
	
	//Attribut Lecture seule
	function action_controlesLectureSeule(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
		var controlesArray = regleArray['cibleObjet'].replace(/\r|\n/g,'').split(',');
		cadre.formulaire.controlesLectureSeule(controlesArray,eval(regleArray['condition']));
	}//end function

	//Attribut Masqué
	function action_controlesAfficher(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
		var controlesArray =regleArray['cibleObjet'].replace(/\r|\n/g,'').split(',');
		for(var controle in controlesArray){
			controleId = controlesArray[controle];
			var controleElement = cadre.document.getElementById(controleId);
			controleElement.style.display = (eval(regleArray['condition']) ? '' : 'none');
		}//end for
	}//end function	

	//Attribut de saisie obligatoire
	function action_controlesObligatoire(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
		var controlesArray = regleArray['cibleObjet'].replace(/\r|\n/g,'').split(',');
		cadre.formulaire.controlesObligatoire(controlesArray,eval(regleArray['condition']));
	}//end function	

	//Alimente les options d'une liste déroulante
	function action_controlesSelectActualiser(){
		if(eval(regleArray['condition'])){		
			var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
			var controlesArray =regleArray['cibleObjet'].replace(/\r|\n/g,'').split(',');
			for(var controle in controlesArray){
				controleId = controlesArray[controle];		
				cadre.formulaire.controleSelectActualiser(controleId);
			}//end for
		}//end if
	}//end function

	//Vérifie l'unicité de la valeur du controle dans le champ correspondant de la table rattachée au formulaire
	function action_controleUnique(){
		if(eval(regleArray['condition'])){		
			eval(regleArray['expression']);
			var controleId = regleArray['cibleObjet'];
			var controleElement = document.getElementById(controleId);
			var controleValeur = controleElement.value;
			if(controleValeur != ''){
				var variables = new Array();
				variables['var_controle_code'] = controleId;
				variables['var_controle_valeur'] = controleValeur;
				variables['var_table_nom'] = formulaire.proprietesArray['zz_fo_table'];
				var requeteXml = ajax("controle","unique",variables);	
				if(requeteXml.getElementsByTagName('data')[0].firstChild){
					declencheurElement = document.getElementById(regleArray['declencheurs'].substr(0,regleArray['declencheurs'].indexOf('.')));
					declencheurElement.value = '';
					controleElement.value = '';
					try{window.focus();declencheurElement.focus();declencheurElement.select();} catch(e){} finally{};				
					alert('Saisie interdite : ' + controleValeur + ' est une valeur déjà existante.');
				}//end if
			}//end if
		}//end if
	}//end function

	//Supprime le dossier contenant des pièces jointes sur le serveur
	function action_dossierSupprimer(){
		if(eval(regleArray['condition'])){				
			var variables = new Array();
			eval(regleArray['expression']);
			ajax("fichier","detruire",variables);
		}//end if
	}//end function

	//Evaluation d'une expression
	function action_expressionEvaluer(){
		if(eval(regleArray['condition'])){
			var variables = new Array();
			eval(regleArray['expression']);
		}//end if
	}//end function

	//Ouvre une fenêtre pour l'ajout de fichiers
	function action_fichiersAjouter(){
		if(eval(regleArray['condition'])){
			var variables = new Array();
			eval(regleArray['expression']);
			variables['var_page_code'] = 'pg_ag2_piecesJointes';
			variables['var_fichier_liste'] = regleArray['cibleObjet'];
			var variablesXml = arrayToXml(variables);	
			var uri = url + "/page/afficher?variables=" + ax(variablesXml);
			var parametres = 'top=10,left=10,width=700,height=300,dependent=yes';		
			w = window.open(uri,'',parametres);
		}//end if
	}//end function
		
	//Envoi des fichiers sur le serveur
	function action_fichiersEnvoyer(){
		if(eval(regleArray['condition'])){
			document.getElementById('gl_ag2_piecesJointes_dossier_input').value = formulaire.variables['var_fichier_dossier'];
			document.getElementById('gl_ag2_piecesJointes_liste_input').value = formulaire.variables['var_fichier_liste'];		
			var form = document.getElementById('gl_ag2_piecesJointes_fichier_form');
			form.action = '/agilis_V2/library/agilis/upload.php';
			form.submit();
		}//end if
	}//end function
	
	//Liste les fichiers présents dans un dossier du serveur
	function action_fichiersLister(){
		if(eval(regleArray['condition'])){
			var variables = new Array();
			eval(regleArray['expression']);
			var fichiersXml =ajax("fichier","lister",variables);	
			if(fichiersXml.getElementsByTagName('data')[0]){
				var fichier = fichiersXml.getElementsByTagName('data')[0].firstChild;
				document.getElementById(regleArray['cibleObjet']).options.length = 0;
				var iFichier = 0;
				while(fichier != null){
					var fichierNom = fichier.firstChild.data;
					document.getElementById(regleArray['cibleObjet']).options[iFichier++] = new Option(fichierNom,fichierNom);			
					fichier = fichier.nextSibling;
				}//end while
			}//end if
		}//end if
	}//end function

	//Ouvre un fichier stocké sur le serveur
	function action_fichiersOuvrir(){
		if(eval(regleArray['condition'])){		
			var variables = new Array();
			eval(regleArray['expression']);
			var variablesXml = arrayToXml(variables);	
			var dossier = variables['var_fichier_dossier'];
			var fichiersListe = document.getElementById(regleArray['cibleObjet']);
			for(var i = 0 ; i < fichiersListe.options.length ; i++){
				if(fichiersListe.options[i].selected){
					window.open(encodeURI(url + '/files/pj' + dossier + '/' + fichiersListe.options[i].value));
				}//end if
			}//end for
		}//end if
	}//end function	
	
	//Supprime les fichiers présents dans un dossier du serveur
	function action_fichiersSupprimer(){
		if(eval(regleArray['condition'])){		
			if(confirm('Voulez-vous supprimer le(s) fichier(s) sélectionné(s) ?')){
				var variables = new Array();
				eval(regleArray['expression']);
				var fichiersSupprimer = '';
				var fichiersListe = document.getElementById(regleArray['cibleObjet']);
				for(var i = 0 ; i < fichiersListe.options.length ; i++){
					if(fichiersListe.options[i].selected){
						if(fichiersSupprimer != '') fichiersSupprimer += ';';
						fichiersSupprimer += fichiersListe.options[i].value;
					}//end if
				}//end for
				variables['var_fichier_supprimer'] = fichiersSupprimer;
				ajax("fichier","supprimer",variables);			
				action_fichiersLister();
			}//end if
		}//end if
	}//end function

	//Actualisation d'un formulaire
	function action_formulaireActualiser(){
		if(eval(regleArray['condition'])){
			var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
			var variables = new Array();
			eval(regleArray['expression']);
			for(variableNom in variables){
				cadre.formulaire.variables[variableNom] = variables[variableNom];
			}//end for
			var formulaireCle = variables['var_formulaire_cle'];
			if(typeof formulaireCle == 'undefined' || formulaireCle == ''){
				cadre.formulaire.formulaireAjouter();
			}else{
				cadre.formulaire.iconeSelecteur('aller',formulaireCle);
			}//end if
		}//end if
	}//end function	
	
	//Affichage d'un formulaire dans la fenêtre principale ou dans une popup
	function action_formulaireAfficher(){
		if(eval(regleArray['condition'])){		
			var formulaireCode = regleArray['cibleObjet'];
			var variables = new Array();
			eval(regleArray['expression']);
			var uri = '';
			variables['var_formulaire_code'] = formulaireCode;
			var variablesXml = arrayToXml(variables);	
			uri = url + "/formulaire/afficher?variables=" + ax(variablesXml);
			switch(regleArray['cibleFenetre']){
				case 'popup' :
					var parametres = variables['var_popup_parametres'];
					w = window.open(uri,formulaireCode,parametres);
					break;
				case 'window' :
					top.page.location.href(uri);
					break;
				default :
					var fenetre = eval(regleArray['cibleFenetre']);
					fenetre.location.href(uri);
			}//end if
		}//end if
	}//end function
	
	//Efface le contenu d'un formulaire
	function action_formulaireEffacer(){
		if(eval(regleArray['condition'])){
			var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));	
			cadre.formulaire.formulaireEffacer();
		}//end if
	}//end function
	
	//Enregistre le contenu d'un formulaire
	function action_formulaireEnregistrer(){
		if(eval(regleArray['condition'])){
			var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
			var iconeEnregistrer = cadre.document.getElementById('icone_enregistrer');
			if(iconeEnregistrer) iconeEnregistrer.src = iconeEnregistrer.src.replace(/0.png/,'1.png');
			cadre.formulaire.formulaireEnregistrer();
		}//end if
	}//end function	
	
	//Affichage ou masquage d'une icone
	function action_iconesAfficher(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));	
		var iconesArray =regleArray['cibleObjet'].replace(/\r|\n/g,'').split(',');
		cadre.formulaire.iconesAfficher(iconesArray,eval(regleArray['condition']));
	}//end function
	
	//Icone en Lecture Seule
	function action_iconeLectureSeule(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
		var iconeId = regleArray['cibleObjet'];
		var iconeElement = cadre.document.getElementById(iconeId);
		if(eval(regleArray['condition'])){
			iconeElement.src = iconeElement.src.replace(/1.png/,'0.png');		
		}else{
			iconeElement.src = iconeElement.src.replace(/0.png/,'1.png');							
		}//end if
	}//end function	

	//Actualise les controles associés à la listearea
	function action_listeareaActualiser(){		
		if(eval(regleArray['condition'])){
			var textarea = document.getElementById(regleArray['cibleObjet'] + '_textarea');
			var position = document.getElementById(regleArray['cibleObjet'] + 'Position_select');
			var textareaArray = textarea.value.split('\r\n');
			var variables = new Array();
			eval(regleArray['expression']);
			var controlesId = variables['var_controles_id'].split(',');
			for(var j = 0 ; j < controlesId.length ; j++){
				document.getElementById(regleArray['cibleObjet'] + controlesId[j]).value = '';
			}//end for		
			for(var i = 0 ; i < textareaArray.length ; i++){
			   if(i == (1 * position.value) - 1){
				   var extrait = textareaArray[i].substr(5);
				   for(var j = 0 ; j < controlesId.length ; j++){
					   var controleArray = controlesId[j].split('_');
					   if(controleArray[1] == 'select') formulaire.controleSelectActualiser(regleArray['cibleObjet'] + controlesId[j]);
					   var controleFin = (extrait.indexOf('   ') == -1 ? extrait.length : extrait.indexOf('   '));
					   document.getElementById(regleArray['cibleObjet'] + controlesId[j]).value = extrait.substring(0,controleFin);
					   extrait = extrait.substr(controleFin + 3);
				   }//end for
				   break;
			   }//end if
			}//end for	
		}//end if
	}//end function

	//Initialise la liste des positions de la listearea
	function action_listeareaInitialiser(){
		if(eval(regleArray['condition'])){
			var textarea = document.getElementById(regleArray['cibleObjet'] + '_textarea');
			var position = document.getElementById(regleArray['cibleObjet'] + 'Position_select');
			var textareaArray = textarea.value.split('\r\n');
			if(textarea.value == '') textareaArray.length = 0;
			position.length = 0;
			for(var i = 0 ; i <= textareaArray.length ; i++){
			   var numero = i + 1;
			   var libelle = (numero < 10 ? '' + '0' + numero : '' + numero);
			   var valeur = libelle;
			   var option = new Option(libelle,valeur);
			   position.options[i] = option;
			}//end for
			position.selectedIndex = textareaArray.length;
		}//end if
	}//end function
	
	//Insertion dans la listearea
	function action_listeareaInserer(){
		if(eval(regleArray['condition'])){
			var textarea = document.getElementById(regleArray['cibleObjet'] + '_textarea');
			var position = document.getElementById(regleArray['cibleObjet'] + 'Position_select');
			var textareaArray = textarea.value.split('\r\n');
			if(textarea.value == '') textareaArray.length = 0;
			var variables = new Array();
			eval(regleArray['expression']);
			var controlesId = variables['var_controles_id'].split(',');
			var nouveauTextarea = '';
			var iAncien = 0;
			for(var i = 0 ; i <= textareaArray.length ; i++){
			   var n = i + 1;
			   var nouveauPosition = (n < 10 ? '0' + n : '' + n);
			   if(nouveauTextarea != '') nouveauTextarea += '\n';
			   nouveauTextarea += nouveauPosition;
			   if(nouveauPosition == position.value){
				   for(var j = 0 ; j < controlesId.length ; j++){
					   nouveauTextarea += '   ' + document.getElementById(regleArray['cibleObjet'] + controlesId[j]).value;
				   }//end for
			   }else{
				   nouveauTextarea += textareaArray[iAncien++].substr(2);
			   }//end if
			}//end for
			textarea.value = nouveauTextarea;
		}//end if
	}//end function
	
	//Modification dans la listearea
	function action_listeareaModifier(){	
		if(eval(regleArray['condition'])){
			var textarea = document.getElementById(regleArray['cibleObjet'] + '_textarea');
			var position = document.getElementById(regleArray['cibleObjet'] + 'Position_select');
			var textareaArray = textarea.value.split('\r\n');
			var variables = new Array();
			eval(regleArray['expression']);
			var controlesId = variables['var_controles_id'].split(',');
			var nouveauTextarea = '';	
			for(var i = 0 ; i < textareaArray.length ; i++){
			   var n = i + 1;
			   var nouveauPosition = (n < 10 ? '0' + n : '' + n);
			   if(nouveauTextarea != '') nouveauTextarea += '\n'; 
			   nouveauTextarea += nouveauPosition;
			   if(nouveauPosition == position.value){
				   for(var j = 0 ; j < controlesId.length ; j++){
					   nouveauTextarea += '   ' + document.getElementById(regleArray['cibleObjet'] + controlesId[j]).value;
				   }//end for
			   }else{
				   nouveauTextarea += textareaArray[i].substr(2);
			   }//end if		   
			}//end for
			textarea.value = nouveauTextarea;	
		}//end if
	}//end function

	//Suppression dans la listearea
	function action_listeareaSupprimer(){
		if(eval(regleArray['condition'])){
			var textarea = document.getElementById(regleArray['cibleObjet'] + '_textarea');
			var position = document.getElementById(regleArray['cibleObjet'] + 'Position_select');
			var textareaArray = textarea.value.split('\r\n');
			var nouveauTextarea = '';	
			var n = 1;
			for(var i = 0 ; i < textareaArray.length ; i++){
			   if(textareaArray[i].substr(0,2) != position.value){
			      var nouveauPosition = (n < 10 ? '0' + n : '' + n);
			      if(nouveauTextarea != '') nouveauTextarea += '\n';
			      nouveauTextarea += nouveauPosition + textareaArray[i].substr(2);
			      n++;
			   }//end if
			}//end for
			textarea.value = nouveauTextarea;
		}//end if
	}//end function

	//Actualisation d'une liste
	function action_listeActualiser(){	
		if(eval(regleArray['condition'])){
			var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));		
			var variables = cadre.liste.variables;
			variables['var_liste_clic_id'] = '';
			if(regleArray['expression'] != '') eval(regleArray['expression']);
			var variablesXml = arrayToXml(variables);
			cadre.location.replace(url + "/liste/afficher?variables=" + ax(variablesXml));				
		}//end if
	}//end function	
		
	function action_mailEnvoyer(){
		if(eval(regleArray['condition'])){
			var variables = new Array();
			if(regleArray['expression'] != '') eval(regleArray['expression']);
			var variablesXml = '';
			for(var variable in variables){
				variablesXml += '<' + variable + '>' + variables[variable] + '</' + variable + '>';
			}//end for
			post("mail","envoyer",variablesXml);
		}//end if
	}//end function	

	//Afficher/masquer les onglets d'un bloc
	function action_ongletsAfficher(){	
		var ongletArray = regleArray['cibleObjet'].split(',');
		var bloc = document.getElementById(ongletArray[0]).parentNode;
		var onglet = bloc.firstChild;
		var position = 5;
		while(onglet){
			if(regleArray['cibleObjet'].indexOf(onglet.id) > -1){
				if(eval(regleArray['condition'])){
					var legende = document.getElementById('legende_' + onglet.id);
					legende.style.left = position;				
					position += parseInt(legende.style.width) + 5;
					onglet.style.display = 'block';
				}else{
					onglet.style.display = 'none';
				}//end if
			}else{
				if(onglet.style.display != 'none'){
					var legende = document.getElementById('legende_' + onglet.id);
					legende.style.left = position;					
					position += parseInt(legende.style.width) + 5;			
				}//end if
			}//end if
			onglet = onglet.nextSibling;
		}//end while
	}//end function

	//Attribut lecture seule pour l'ensemble des controles d'un onglet
	function action_ongletLectureSeule(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
		var ongletId = regleArray['cibleObjet'];
		var controlesArray = new Array();
		var iControle = 0;
		var controle = cadre.formulaire.formulaireXml.getElementsByTagName('controles')[0].firstChild;
		while(controle != null){
			var controleId = controle.getElementsByTagName('zz_gc_code')[0].firstChild.data;
			if(controleId.indexOf(ongletId + '_') > -1){
				var controleTagname = controleId.substr(controleId.lastIndexOf('_')+1);	
				if(controleTagname == 'input' || controleTagname == 'textarea' || controleTagname == 'select'|| controleTagname == 'radio' || controleTagname == 'checkbox' || controleTagname == 'button'){
					controlesArray[iControle++] = controleId;
				}//end if
			}//end if
			controle = controle.nextSibling;
		}//end while
		cadre.formulaire.controlesLectureSeule(controlesArray,eval(regleArray['condition']));		
	}//end function

	//Ouvrir un onglet
	function action_ongletOuvrir(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));
		var ongletId = regleArray['cibleObjet'];
		cadre.formulaire.ongletOuvrir(ongletId,eval(regleArray['condition']));
	}//end function
	
	//Sélectionner un onglet
	function action_ongletSelectionner(){
		var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));	
		var ongletId = regleArray['cibleObjet'];
		cadre.formulaire.ongletSelectionner(ongletId);
	}//end function

	//Affichage d'une page dans une fenetre cible
	function action_pageAfficher(){
		if(eval(regleArray['condition'])){
			var pageCode = regleArray['cibleObjet'];
			var variables = new Array();
			eval(regleArray['expression']);
			var uri = '';
			if(pageCode == 'pg_externe'){
				uri = variables['var_lien'];
			}else{
				variables['var_page_code'] = pageCode;
				var variablesXml = arrayToXml(variables);	
				uri = url + "/page/afficher?variables=" + ax(variablesXml);
			}//end if
			switch(regleArray['cibleFenetre']){
				case 'popup' :
					var parametres = variables['var_popup_parametres'];
					w = window.open(uri,pageCode,parametres);
					break;
				default :
					var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));			
					cadre.location.href(uri);
			}//end switch
		}//end if
	}//end function
	
	//Execution d'une requête et affectation éventuelle de la valeur résultat au controle cible
	function action_requeteExecuter(){
		if(eval(regleArray['condition'])){
			var requeteCode = regleArray['cibleObjet'];
			var variables = new Array();
			eval(regleArray['expression']);
			variables['var_requete_code'] = requeteCode;
			var requeteXml = ajax("requete","executer",variables);
			if(typeof variables['var_requete_resultat'] != 'undefined'){		
				var controleCible = variables['var_requete_resultat'];
				if(typeof controleCible != 'undefined'){
					var controleProprietes = formulaire.getControleProprietes(controleCible);
					var valeur = '';				
					if(requeteXml.getElementsByTagName('data')[0].firstChild != null && requeteXml.getElementsByTagName('data')[0].firstChild.firstChild.firstChild != null) valeur = requeteXml.getElementsByTagName('data')[0].firstChild.firstChild.firstChild.data;
					var format = controleProprietes['zz_gc_format'];
					if(format != ''){
						var formatOption = controleProprietes['zz_gc_formatoption'];
						var formatBlanc = controleProprietes['zz_gc_formatblanc'];
						valeur = formatAppliquer(valeur,format,formatOption,formatBlanc);
					}//end if
					var cadre = eval(regleArray['cibleFenetre'] + (regleArray['cibleCadre'] != '' ? '.' + regleArray['cibleCadre'] : ''));			
					cadre.document.getElementById(controleCible).value = valeur;
				}//end if
			}//end if
		}//end if
	}//end function
		
}//end class