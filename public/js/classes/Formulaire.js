//héritages de la classe globale Objet 
//Formulaire.prototype = new Objet();

//Classe Formulaire
function Formulaire(){
	
	//Extensions de l'héritage
	herite(this,new Regle());
//	herite(this,new Adresse());
	
	//Variables de la classe
	this.session = null;
	this.variables = getVariablesDocument();
	this.formulaireCode = this.variables['var_formulaire_code'];
	this.formulaireXml = null;
	this.reglesXml = null;	
	this.proprietesArray = new Array();	
	this.iconesArray = new Array();
	this.blocsArray = new Array();	
	this.ongletsArray = new Array();
	this.ongletsIndexNomCode = new Array();
	this.controlesIndexChampCode = new Array();
	this.dataArray = new Array();
	this.verrouArray = new Array();

 /*
 ********************************************************************************
 * INITIALISATION
 ******************************************************************************** 
 */
	
	//Récupère les propriétés, objets et données du formulaire	
	this.formulaireCharger = function(){
	
		this.formulaireXml =ajax("formulaire","charger",this.variables);
		var formulaireArray = fileXmlToArray(this.formulaireXml);
		
		//Chargement des variables de session
		this.session = formulaireArray['session'];
		
		//Chargement du tableau des proprietes du formulaire
		this.proprietesArray = formulaireArray['proprietes'];
		
		//Initialisation du tableau des icones
		this.iconesArray = new Array("icone_enregistrer","icone_ajouter","icone_supprimer","icone_selecteur","icone_onglets");
		
		//Initialisation de reglesXml
		this.reglesXml = this.formulaireXml.getElementsByTagName('regles')[0];

		//Chargement du tableau des blocs
		for(var bloc in formulaireArray['blocs']){
			var blocNom = formulaireArray['blocs'][bloc]['zz_bl_nom'];
			this.blocsArray[blocNom] = new Array();
			for(var blocPropriete in formulaireArray['blocs'][bloc]){
				this.blocsArray[blocNom][blocPropriete] = formulaireArray['blocs'][bloc][blocPropriete];
			}//end for
		}//end for
		
		//Chargement du tableau des onglets
		for(var onglet in formulaireArray['onglets']){
			var ongletCode = formulaireArray['onglets'][onglet]['zz_gl_code'];
			this.ongletsArray[ongletCode] = new Array();
			for(var ongletPropriete in formulaireArray['onglets'][onglet]){
				this.ongletsArray[ongletCode][ongletPropriete] = formulaireArray['onglets'][onglet][ongletPropriete];
			}//end for
		}//end for
	
		//Chargement du tableau des données et verrous
		this.dataArray = formulaireArray['data'];
		this.verrouArray = formulaireArray['verrou'];
		
	};//end function

	//Récupère les données et verrous du formulaire
	this.formulaireData = function(cle){
		this.variables['var_formulaire_cle'] = cle;
		var dataXml =ajax("formulaire","data",this.variables);
		this.dataXmlArray = fileXmlToArray(dataXml);
		this.dataArray = this.dataXmlArray['data'];
		this.verrouArray = this.dataXmlArray['verrou'];
	};//end function
	
/*
 ********************************************************************************
 * ACTIONS SUR LE FORMULAIRE
 ******************************************************************************** 
 */

	//Fonctions exécutées lors de l'actualisation d'un formulaire
	this.formulaireActualiser = function(){
		this.formulaireLectureSeule(false);
		this.controlesDataAffecter();
		this.iconesInitialiser();
		this.reglesExecuter(this.formulaireCode + '.onload','all','all');
		this.formulaireVerrouiller();
	};//end function
	
	//Vérification des controles obligatoires 
	this.formulaireControlesObligatoires = function(){
		var enregistrerOk = true;
		var regle = this.reglesXml.firstChild;
		while(regle != null){
			var action = regle.getElementsByTagName('zz_rg_action')[0].firstChild.data;	
			if(action == 'controlesObligatoire'){
				var controles = regle.getElementsByTagName('zz_rg_cibleobjet')[0].firstChild.data;	
				var controlesArray = controles.replace(/\r|\n/g,'').split(',');
				for(var controle in controlesArray){		
					controleId = controlesArray[controle];
					var controleValeur = document.getElementById(controleId).value;
					var controleCondition = (regle.getElementsByTagName('zz_rg_condition')[0].firstChild ? eval(regle.getElementsByTagName('zz_rg_condition')[0].firstChild.data) : true);			
					if((controleValeur == '' || typeof controleValeur == 'undefined')  && controleCondition){			
						enregistrerOk = false;
						break;
					}//end if
				}//end for
			}//end if
			regle = regle.nextSibling;
		}//end while
		if(! enregistrerOk) alert("Vous devez saisir tous les champs OBLIGATOIRES.\n (champs marqués d'une étoile rouge).\n\n");				
		return enregistrerOk;
	};//end function
	
	//Enregistrement des données du formulaire
	this.formulaireEnregistrer = function(){
		var enregistrerOk = (document.getElementById('icone_enregistrer') == null || document.getElementById('icone_enregistrer').src.indexOf('1.png') > -1);
		if(enregistrerOk) enregistrerOk = this.formulaireControlesObligatoires();
		if(enregistrerOk){
			
			//Execution des règles avant enregistrement
			this.reglesExecuter(this.formulaireCode + '.beforesave','all','all');				
			
			//Récupération des variables du formulaire
			var variables = this.variables;
			
			//Elaboration de la liste XML des noms de champs du formulaire et de leur valeur
			var champCle = this.proprietesArray['zz_fo_cle'];
			var tablePrefixe = champCle.substr(0,champCle.lastIndexOf('_')).toLowerCase();
			var controle = this.formulaireXml.getElementsByTagName('controles')[0].firstChild;
			while(controle != null){
				var controleId = controle.getElementsByTagName('zz_gc_code')[0].firstChild.data;
				var controleChamp = (controle.getElementsByTagName('zz_gc_champ')[0].firstChild ? controle.getElementsByTagName('zz_gc_champ')[0].firstChild.data.toLowerCase() : '');
				var controleValeur = (controle.getElementsByTagName('zz_gc_valeur')[0].firstChild ? controle.getElementsByTagName('zz_gc_valeur')[0].firstChild.data : '');
				var controleFormat = (controle.getElementsByTagName('zz_gc_format')[0].firstChild ? controle.getElementsByTagName('zz_gc_format')[0].firstChild.data : '');
				var controleFormatOption = (controle.getElementsByTagName('zz_gc_formatoption')[0].firstChild ? controle.getElementsByTagName('zz_gc_formatoption')[0].firstChild.data : '');
				var controleTagname = controleId.substr(controleId.lastIndexOf('_') + 1);	
				var controleElement = document.getElementById(controleId);				
				var ajouterChamp = true;
				var valeur = '';
				var champPrefixe = controleChamp.substr(0,controleChamp.lastIndexOf('_')).toLowerCase();
				if(champPrefixe == tablePrefixe){
//				if(controleChamp != '' ){
					switch(controleTagname){
						case 'select':
							if(controleElement.selectedIndex >= 0){						
								var optionLibelleChamp = controleChamp.replace(/code/,'libelle');
								var optionLibelleValeur = controleElement.options[controleElement.selectedIndex].text;
								variables[optionLibelleChamp] = optionLibelleValeur;
								valeur = controleElement.value;
							}//end if
							break;
						case 'radio':
							if(controleElement.checked){
								valeur = controleValeur;
							}else{
								ajouterChamp = false;
							}//end if
							break;
						case 'checkbox':
							valeur = (controleValeur != '' ? controleValeur : 1);
							valeur = (controleElement.checked ? valeur : '');
							break;
						default: valeur = controleElement.value; break;		
					}//end switch
					if(controleFormat != ''){
						valeur = formatSupprimer(valeur, controleFormat, controleFormatOption);
					}//end if
					if(ajouterChamp) variables[controleChamp] = valeur;
				}//end if
				controle = controle.nextSibling;
			}//end while
	
			var resultatXML = ajax('formulaire','enregistrer',variables);			

			var resultat = resultatXML.getElementsByTagName('data')[0].firstChild.data;			
			if(resultat.substr(0,8) != 'PROBLEME'){
				this.variables['var_formulaire_cle'] = resultat;
				if(document.getElementById('icone_enregistrer')) document.getElementById('icone_enregistrer').src = document.getElementById('icone_enregistrer').src.replace(/1.png/,'0.png');
				if(document.getElementById('selecteur_precedent')) document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/0.png/,'1.png');				
//alert('cle : ' + this.variables['var_formulaire_cle']);
				this.formulaireData(this.variables['var_formulaire_cle']);
				this.formulaireActualiser();
				if(document.getElementById('selecteur')) document.getElementById('selecteur').value = this.variables['var_formulaire_cle'];				
				//Execution des règles 'aftersave'
				this.reglesExecuter(this.formulaireCode + '.aftersave','all','all');				
			}else{
				alert(resultat);
				this.formulaireData(document.getElementById('selecteur').value);
				this.formulaireActualiser();
			}//end if
		}//end if
	};//end function

	//Ajouter un enregistrement
	this.formulaireAjouter = function(){
		var ajout = true;
		if (document.getElementById('icone_enregistrer').src.indexOf('1.png') > -1){
			ajout = confirm("Etes-vous sûr de vouloir re-initialiser le formulaire présent à l'écran");
		}//end if
		if(ajout){
			this.iconeEnregistrerSource(0);
			this.formulaireDeverrouiller();
			this.selecteurEffacer();
			this.formulaireEffacer();
			this.reglesExecuter(this.formulaireCode + '.onload','all','all');
			//Execution des règles 'icone_ajouter.onclick'
			this.reglesExecuter('icone_ajouter.onclick','all','all');				
		}//end if
	};//end function
	
	this.formulaireEffacer = function(){
		this.dataArray = new Array();
		this.formulaireActualiser();
	};//end if

	this.formulaireVerrouiller = function(){
		if(this.verrouArray['etat'] == 'nok'){
			document.getElementById('icone_enregistrer').style.display = 'none';
			document.getElementById('icone_supprimer').style.display = 'none';			
			this.formulaireLectureSeule(true);
			alert(this.verrouArray['message']);
		}//end if
	};//end function
	
	this.formulaireDeverrouiller = function(){
		this.verrouArray['etat'] = '';
//		var variables = "<var_formulaire_code>" + this.formulaireCode + "</var_formulaire_code>";
		ajax('formulaire','deverrouiller',this.variables);		
	};//end if

	//Formulaire en Lecture seule	
	this.formulaireLectureSeule = function(condition){
		if(this.formulaireXml){
			var controles = new Array();
			var controle = this.formulaireXml.getElementsByTagName('controles')[0].firstChild;
			var iControle = 0;
			while(controle != null){
				var controleId = controle.getElementsByTagName('zz_gc_code')[0].firstChild.data;
				var controleChamp = (controle.getElementsByTagName('zz_gc_champ')[0].firstChild ? controle.getElementsByTagName('zz_gc_champ')[0].firstChild.data.toLowerCase() : '');		
				if(controleChamp != ''){
					controles[iControle] = controleId;
				}//end if
				controle = controle.nextSibling;
			}//end while
			if(controles.length > 0) this.controlesLectureSeule(controles,condition);
		}//end if
	};//end function
	
	//Suppression de l'enregistrement
	this.formulaireSupprimer = function(){
		var cleChamp = this.proprietesArray['zz_fo_cle'];
		var cleValeur = selecteur.value;
		if(cleValeur != '' && confirm("Etes-vous sûr de vouloir supprimer l'enregistrement : " + cleValeur)){
			//Récupération des variables du formulaire
			var variables = getVariablesDocument();				
			variables[cleChamp] = cleValeur;	
			var suppressionXML =ajax('formulaire','supprimer',variables);
			var suppression = suppressionXML.getElementsByTagName('data')[0].firstChild.data;
			if(suppression == 'OK'){
				//Execution des règles 'ondelete' 
				this.reglesExecuter(this.formulaireCode + '.ondelete','all','all');				
				//Effacement des données du formulaire
				this.formulaireEffacer();
				//Si formulaire indépendant, se positionne sur l'enregistrement précédent (sélecteur visible)
				if(document.getElementById('icone_selecteur').style.display != 'none'){
					document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/0.png/,'1.png');				
					this.iconeSelecteur('precedent');
				}//end if
			}else{
				alert("PROBLEME : données NON supprimées !\nVeuillez transmettre la copie de ce message à l'équipe AGILIS.\n\n" + resultat);
			}//end if
		}//end if
	};//end function

	this.formulaireQuitter = function(){
		//Si le formulaire nécessite un enregistrement
		if(document.getElementById('icone_enregistrer') && document.getElementById('icone_enregistrer').style.display != 'none' && document.getElementById('icone_enregistrer').src.indexOf('1.png') > -1){
			if(confirm("Attention : Le formulaire n'a pas été enregistré !\n\nSouhaitez-vous enregistrer les données ?")) this.formulaireEnregistrer();
		}//end if
		this.formulaireDeverrouiller();
		//Execution des règles 'onclose' 
		
		this.reglesExecuter(this.formulaireCode + '.onclose','all','all');			
	};//end function
	
/*
 ********************************************************************************
 * ONGLETS
 ******************************************************************************** 
 */
	//Affichage de l'ensemble des onglets
	this.ongletsAfficher = function(action){
		for(var onglet in this.ongletsArray){
			var ongletId = this.ongletsArray[onglet]['zz_gl_code'];
			this.ongletAfficher(ongletId,action);
		}//end for
	};//end function
	
	//Affichage d'un onglet selon l'action demandée et en respectant les règles d'ouverture
	this.ongletAfficher = function(ongletId,action){
		if(action == 0){
			this.ongletOuvrir(ongletId,false);
		}else{
			this.ongletOuvrir(ongletId,true);
			this.reglesExecuter('all','ongletOuvrir',ongletId);			
		}//end if
	};//end function
	
	//Clic sur un onglet
	this.ongletClick = function(ongletId){
		var ongletLegende = document.getElementById('legende_' + ongletId);
		//si onglet déjà sélectionné -> Ouvrir/Fermer sinon -> Sélectionner
		if(ongletLegende.style.backgroundColor.toUpperCase() == couleurP0.toUpperCase()){
			var bloc = document.getElementById(ongletId).parentNode;
			var action = (bloc.style.height == '20px' ? 1 : 0);
			this.ongletAfficher(ongletId,action);	
		}else{
			this.ongletSelectionner(ongletId);		
		}//end if
	};//end function	
	
	//Ouvrir un onglet
	this.ongletOuvrir = function(ongletId,condition){
		var bloc = document.getElementById(ongletId).parentNode;
		if(condition){
			var ongletLegende = document.getElementById('legende_' + ongletId);		
			var ongletFieldset = document.getElementById('fieldset_' + ongletId);
			bloc.style.height = ongletFieldset.style.height;
			if(ongletLegende.style.backgroundColor.toUpperCase() == couleurP0.toUpperCase()){		
				ongletFieldset.style.display = 'block';
			}//end if
		}else{
			bloc.style.height = '20px';
			var onglet = bloc.firstChild;
			while(onglet != null){
				var ongletFieldset = document.getElementById('fieldset_' + onglet.id);	
				ongletFieldset.style.display = 'none';			
				onglet = onglet.nextSibling;
			}//end while
		}//end if
	};//end function	

	//Sélection de l'onglet à afficher
	this.ongletSelectionner = function(ongletId){		
		var bloc = document.getElementById(ongletId).parentNode;
		var onglet = bloc.firstChild;		
		while(onglet != null){
			ongletLegende = document.getElementById('legende_' + onglet.id);
			ongletFieldset = document.getElementById('fieldset_' + onglet.id);	
			if(onglet.id == ongletId){
				ongletLegende.style.backgroundColor = couleurP0;				
				ongletFieldset.style.display = bloc.style.display;
			}else{
				ongletLegende.style.backgroundColor = couleurS1;
				ongletFieldset.style.display = 'none';			
			}//end if
			onglet = onglet.nextSibling;
		}//end while
	};//end function	
	
	//Exécution des règles associées à un clic sur l'onglet
	this.ongletExecuter = function(ongletId){
		this.ongletSelectionner(ongletId);
		this.reglesExecuter(ongletId + '.onclick','all','all');
	};//end function
/*
 ********************************************************************************
 * CONTROLES
 ******************************************************************************** 
 */
	this.getControleProprietes = function(controleInput){
		var controleProprietes = new Array();
		var controle = this.formulaireXml.getElementsByTagName('controles')[0].firstChild;
		while(controle != null){		
			var controleId = controle.getElementsByTagName('zz_gc_code')[0].firstChild.data;
			if(controleInput == controleId){
				var propriete = controle.firstChild;
				while(propriete != null){
					proprieteCode = propriete.tagName.toLowerCase();
					proprieteValeur = (propriete.firstChild ? propriete.firstChild.data : '');
					controleProprietes[proprieteCode] = proprieteValeur;
					propriete = propriete.nextSibling;
				}//end while
				break;
			}//end if
		controle = controle.nextSibling;
		}//end while
		return controleProprietes;
	};//end function
	
	//Affecte les valeurs à l'ensemble des controles après le chargement du formulaire
	this.controlesDataAffecter = function(){
		var controle = this.formulaireXml.getElementsByTagName('controles')[0].firstChild;
		while(controle != null){
			//Récupération des propriétés du controle
			var controleId = controle.getElementsByTagName('zz_gc_code')[0].firstChild.data;
			var controleChamp = (controle.getElementsByTagName('zz_gc_champ')[0].firstChild ? controle.getElementsByTagName('zz_gc_champ')[0].firstChild.data.toLowerCase() : '');
			var controleDefaut = (controle.getElementsByTagName('zz_gc_defaut')[0].firstChild ? controle.getElementsByTagName('zz_gc_defaut')[0].firstChild.data : '');
			var controleFormat = (controle.getElementsByTagName('zz_gc_format')[0].firstChild ? controle.getElementsByTagName('zz_gc_format')[0].firstChild.data : '');
			var controleFormatOption = (controle.getElementsByTagName('zz_gc_formatoption')[0].firstChild ? controle.getElementsByTagName('zz_gc_formatoption')[0].firstChild.data : '');
			var controleFormatBlanc = (controle.getElementsByTagName('zz_gc_formatblanc')[0].firstChild ? controle.getElementsByTagName('zz_gc_formatblanc')[0].firstChild.data : '');
			//Calcul de la valeur
			var controleValeur = (controleChamp != '' && typeof this.dataArray[controleChamp] != 'undefined' ? this.dataArray[controleChamp] : '');
			if(controleValeur == '' && controleDefaut != '') controleValeur = eval(controleDefaut);			
			if(controleFormat != '') controleValeur = formatAppliquer(controleValeur,controleFormat,controleFormatOption,controleFormatBlanc);
			//Affectations complémentaires
			var controleElement = document.getElementById(controleId);	
			var controleTagName = controleId.substr(controleId.lastIndexOf('_') + 1);
			//Affectation selon le tagName
			switch(controleTagName){
				case 'input':
					controleElement.value = controleValeur;
					break;
				case 'select':
					var optionCode = controleValeur;
					var optionLibelle = controleValeur;
					if(controleChamp != ''){
						var optionlibelleChamp = controleChamp.replace(/code/,'libelle');
						if(typeof this.dataArray[optionlibelleChamp] != 'undefined') optionLibelle = this.dataArray[optionlibelleChamp];	
					}//end if					
					controleElement.options.length = 0;
					controleElement.options[0] = new Option(optionLibelle,optionCode);
					break;
				case 'radio':
					if(controleElement.value == controleValeur){
						controleElement.checked = 'checked';
						//Enregistre la valeur par defaut dans la value du fieldset
						var controleIdArray = controleId.split('_');
						var fieldsetId = controleIdArray[0] + '_' + controleIdArray[1] + '_' + controleIdArray[2] + '_' + controleIdArray[3].substr(0,controleIdArray[3].length - 2) + '_fieldset';
						document.getElementById(fieldsetId).value = document.getElementById(controleId).value;						
					}else{
						controleElement.checked = '';
					}//end if
					break;
				case 'checkbox':
					if(controleValeur != '') {controleElement.checked = 'checked';} else {controleElement.checked = '';};
					controleElement.value = controleValeur;
					break;
				case 'textarea':
					if(controleElement.hasChildNodes()){
						controleElement.value = controleValeur;						
					}else{
						var nodeTexte = document.createTextNode('');
						controleElement.appendChild(nodeTexte);				
						controleElement.value = controleValeur;
					}//end if
					break;
				case 'span':
					var nodeTexte = document.createTextNode(controleValeur);
					controleElement.appendChild(nodeTexte);					
					break;
			}//end switch
		controle = controle.nextSibling;
		}//end while	
	};//end function
	
	//Fonction exécutée après évènement sur un controle (appel html)
	this.controleEvenement = function(controleId,evenement){
		var controleTagname = controleId.substr(controleId.lastIndexOf('_') + 1);
		switch(controleTagname){
			case 'input':
				if(evenement == 'onkeyup') this.iconeEnregistrerSource(1);
				if(evenement == 'onblur'){
					this.controleFormatVerifier(controleId);
					this.reglesExecuter('all','controleObligatoire',controleId);					
				}//end if
				break;
			case 'textarea':
				if(evenement == 'onkeyup') this.iconeEnregistrerSource(1);	
				if(evenement == 'onblur'){
					this.controleFormatVerifier(controleId);
					this.reglesExecuter('all','controleObligatoire',controleId);					
				}//end if
				break;
			case 'radio':
				if(evenement == 'onclick'){
					this.iconeEnregistrerSource(1);
					var controleIdArray = controleId.split('_');
					var fieldsetId = controleIdArray[0] + '_' + controleIdArray[1] + '_' + controleIdArray[2] + '_' + controleIdArray[3].substr(0,controleIdArray[3].length - 2) + '_fieldset';
					var radioArray = document.getElementById(fieldsetId).getElementsByTagName('input');
					for(var radio in radioArray) radioArray[radio].checked = false;
					document.getElementById(controleId).checked = true;
					document.getElementById(fieldsetId).value = document.getElementById(controleId).value;
				}//end if
			break;
			case 'checkbox':
				if(evenement == 'onclick') this.iconeEnregistrerSource(1);break;
			case 'select':
				if(evenement == 'onchange'){
					this.iconeEnregistrerSource(1);
					this.reglesExecuter(this.formulaireCode + '.onload','controleObligatoire',controleId);					
				}//end if
				if(evenement == 'onmousedown'){
					if(document.getElementById(controleId).length <= 1){
						if(document.getElementById(controleId).length == 1) document.getElementById(controleId).selectedIndex = 0;
						this.controleSelectActualiser(controleId);
					}//end if
				}//end if
			break;
		}//end switch
		this.reglesExecuter(controleId + '.' + evenement,'all','all');		
	};//end function

	//Formatage d'un champ input sur sortie du curseur
	this.controleFormatVerifier = function(controleId){
		var controleProprietes = this.getControleProprietes(controleId);
		var controleFormat = controleProprietes['zz_gc_format'];
		if(controleFormat != ''){
			var controleFormatOption = controleProprietes['zz_gc_formatoption'];		
			var controleFormatBlanc = controleProprietes['zz_gc_formatblanc'];
			var controleElement = document.getElementById(controleId);
			formatVerifier(controleElement, controleFormat,controleFormatOption,controleFormatBlanc);
		}//end if
	};//end function
	
	this.controlesLectureSeule = function(controles,condition){
		for(var controle in controles){
			var controleId = controles[controle];
			var controleElement = document.getElementById(controleId);
			switch(controleElement.tagName){
				case 'SELECT':	
				case 'BUTTON':
					if(condition){
						controleElement.setAttribute("disabled", "disabled");
						controleElement.style.backgroundColor = couleurP1;
					}else{
						controleElement.removeAttribute("disabled");
						controleElement.style.backgroundColor = '';
						controleElement.style.color = 'black';							
					}//end if
					break;	
				case 'IMG':
					if(condition){
						controleElement.src = controleElement.src.replace(/1.png/,'0.png');
						controleElement.setAttribute("disabled", true);
					}else{
						controleElement.src = controleElement.src.replace(/0.png/,'1.png');	
						controleElement.removeAttribute("disabled");				
					}//end if
					break;
				case 'INPUT':
					if(controleElement.type == 'text'){
						if(condition){
							controleElement.style.backgroundColor = couleurP1;
							controleElement.readOnly = true ;						
						}else{
							controleElement.style.backgroundColor = '';
							controleElement.style.color = 'black';		
							controleElement.readOnly = false;						
						}//end if						
					}else{
						if(condition){
							controleElement.style.backgroundColor = couleurP1;
							controleElement.setAttribute("disabled", true);
						}else{
							controleElement.style.backgroundColor = '';
							controleElement.removeAttribute("disabled");				
						}//end if
					}//end if	
					break;					
				default :
					if(condition){					
						controleElement.style.backgroundColor = couleurP1;
						controleElement.readOnly = true ;						
					}else{
						controleElement.style.backgroundColor = '';
						controleElement.style.color = 'black';		
						controleElement.readOnly = false;						
					}//end if
					break;					
			}//end switch
		}//end for
	};//end function			
	
	//Attribut de saisie obligatoire
	this.controlesObligatoire = function(controlesArray,condition){
		for(var controle in controlesArray){
			controleId = controlesArray[controle];
			var controleElement = document.getElementById(controleId);
			if(condition){
				var obligatoire = document.createElement('span');
				var obligatoireLibelle = document.createTextNode('*');
				obligatoire.id = controleId + '_obligatoire';
				obligatoire.style.position = 'absolute';				
				obligatoire.style.top = parseInt(controleElement.style.top) - 10;
				obligatoire.style.left = parseInt(controleElement.style.left) - 5;
				obligatoire.style.fontSize = '30';
				obligatoire.style.color = 'red';	
				obligatoire.appendChild(obligatoireLibelle);
				controleElement.parentNode.appendChild(obligatoire);					
			}else{
				if(document.getElementById(controleId + '_obligatoire')){
					var obligatoire = document.getElementById(controleId + '_obligatoire');
					controleElement.parentNode.removeChild(obligatoire);
				}//end if
			}//end if
		}//end for
	};//end function
	
	this.controleSelectActualiser = function(controleId){
		var controleElement = document.getElementById(controleId);
		
		//Récupère les propriétés du controle
		var controleProprietes = this.getControleProprietes(controleId);		
		
		//Sauvegarde de la valeur initiale
		var selectValue = controleElement.value;

		//Récupère les données de la liste déroulante
		var variables  = formulaire.variables;
		variables['var_controle_code'] = controleId;
		if(controleProprietes['zz_gc_requetevariables']) eval(controleProprietes['zz_gc_requetevariables']);
		var selectXml =ajax("controle","selectInitialiser",variables);

		//Alimente la liste déroulante si non vide
		if(selectXml.getElementsByTagName('data')[0].firstChild){
			
			//Vide la liste des options
			controleElement.options.length = 0;
					
			//Ajout éventuel d'une option à blanc sur la première ligne du select
			if(! controleProprietes["zz_gc_selectobligatoire"]){
				controleElement.options[0] = new Option("","");
			}//end if
			
			var select = selectXml.getElementsByTagName('data')[0].firstChild;
			while(select != null){
				optionCode = (select.getElementsByTagName('code')[0].firstChild ? select.getElementsByTagName('code')[0].firstChild.data : '');	
				if(select.getElementsByTagName('libelle')[0]){
					optionLibelle = (select.getElementsByTagName('libelle')[0].firstChild ? select.getElementsByTagName('libelle')[0].firstChild.data : '');	
				}else{
					optionLibelle = optionCode;
				}//end if
				controleElement.options[controleElement.length] = new Option(optionLibelle,optionCode);			
				select = select.nextSibling;
			}//end while
		}//end if
		
		//Sélection de la valeur initiale
		controleElement.value = selectValue;
		
		//Sélection de l'option si unique
		if(controleElement.length == 1) controleElement.value = controleElement.options[0].value;	

	};//end function
/*
 ********************************************************************************
 * ICONES
 ******************************************************************************** 
 */
	//Affichage ou masquage des onglets après clic sur l'icone onglets
	this.iconeOnglets = function(){
		var bloc = document.getElementById('contenu').firstChild;
		var action = 1;
		while(bloc != null){
			if(bloc.style.height != '20px') action = 0;
			bloc = bloc.nextSibling;
		}//end while
		this.ongletsAfficher(action);
	};//end function
	
	this.iconeEnregistrerSource = function(valeur){
		if(document.getElementById('icone_enregistrer')){
			if(valeur == 0){
				document.getElementById('icone_enregistrer').src = document.getElementById('icone_enregistrer').src.replace(/1.png/,'0.png');
			}else{
				document.getElementById('icone_enregistrer').src = document.getElementById('icone_enregistrer').src.replace(/0.png/,'1.png');			
			}//end if
		}//end if
	};//end function

	//Affichage des icones par défaut
	this.iconesInitialiser = function(){
		if(this.proprietesArray['zz_fo_barreicones'] == '1'){ 
			var icones = new Array();		
			if(this.proprietesArray['zz_fo_table'] != ''){
				icones = new Array('icone_enregistrer','icone_ajouter','icone_supprimer','icone_selecteur');				
			}//end if
			this.iconesAfficher(icones,true);
		}//end if
	};//end function

	this.iconesAfficher = function(icones,condition){
		for(var icone in icones){
			iconeId = icones[icone];			
			var iconeElement = document.getElementById(iconeId);
			iconeElement.style.display = (condition ? 'block' : 'none');
		}//end for
	};//end function
	
	//Affichage du sélecteur
	this.iconeSelecteur = function(bouton,valeur){
		var selecteurValeur = valeur;
		if(typeof valeur == 'undefined'){
			selecteurValeur = document.getElementById('selecteur').value;
		}else{
			document.getElementById('selecteur').value = valeur;
		}//end if 
		switch(bouton){
		case "premier":
			if(document.getElementById('selecteur_premier').src.indexOf('1.png') > -1){
				document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/1.png/,'0.png');								
				this.variables['bouton'] = 'premier';
				var selecteurXml =ajax("formulaire","selecteur",this.variables);	
				if(selecteurXml.getElementsByTagName('data')[0].firstChild){
					document.getElementById('selecteur').value = selecteurXml.getElementsByTagName('data')[0].firstChild.data;
				}//end if
				document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/1.png/,'0.png');
				document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/1.png/,'0.png');				
				document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/0.png/,'1.png');
				document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/0.png/,'1.png');				
				if(document.getElementById('selecteur').value != '') this.formulaireData(document.getElementById('selecteur').value);
				this.formulaireActualiser();				
				window.setTimeout("document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/0.png/,'1.png')",100);	
			}//end if
			break;
		case "precedent":
			if(document.getElementById('selecteur_precedent').src.indexOf('1.png') > -1){
				document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/1.png/,'0.png');								
				this.variables['bouton'] = 'precedent';
				this.variables['cle'] = selecteurValeur;
				var selecteurXml =ajax("formulaire","selecteur",this.variables);
				if(selecteurXml.getElementsByTagName('data')[0].firstChild){
					document.getElementById('selecteur').value = selecteurXml.getElementsByTagName('data')[0].firstChild.data;
					document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/0.png/,'1.png');
					document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/0.png/,'1.png');				
				}else{
					document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/1.png/,'0.png');
					document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/1.png/,'0.png');				
				}//end if
				if(document.getElementById('selecteur').value != '') this.formulaireData(document.getElementById('selecteur').value);
				this.formulaireActualiser();				
				window.setTimeout("document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/0.png/,'1.png')",100);	
			}//end if
			break;
		case "aller":
			if(document.getElementById('selecteur').value != ''){
				document.getElementById('selecteur_aller').src = document.getElementById('selecteur_aller').src.replace(/1.png/,'0.png');				
//				variables += "<var_formulaire_cle>" + selecteurValeur + "</var_formulaire_cle>";
				this.variables['var_formulaire_cle'] = selecteurValeur;				
				var cleXml =ajax("formulaire","verifierCle",this.variables);					
				if(! cleXml.getElementsByTagName('data')[0].firstChild){
					alert("Code inexistant.");
				}else{
					document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/0.png/,'1.png');
					document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/0.png/,'1.png');				
					document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/0.png/,'1.png');
					document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/0.png/,'1.png');				
				}//end if
				if(document.getElementById('selecteur').value != '') this.formulaireData(document.getElementById('selecteur').value);
				this.formulaireActualiser();				
				window.setTimeout("document.getElementById('selecteur_aller').src = document.getElementById('selecteur_aller').src.replace(/0.png/,'1.png')",100);	
			}//end if
			break;
		case "suivant":
			if(document.getElementById('selecteur_suivant').src.indexOf('1.png') > -1){
				document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/1.png/,'0.png');				
//				variables += "<bouton>suivant</bouton><cle>" + selecteurValeur + "</cle>";
				this.variables['bouton'] = 'suivant';
				this.variables['cle'] = selecteurValeur;				
				var selecteurXml =ajax("formulaire","selecteur",this.variables);	
				if(selecteurXml.getElementsByTagName('data')[0].firstChild){
					document.getElementById('selecteur').value = selecteurXml.getElementsByTagName('data')[0].firstChild.data;
					document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/0.png/,'1.png');
					document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/0.png/,'1.png');				
				}else{					
					document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/1.png/,'0.png');
					document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/1.png/,'0.png');				
				}//end if
				if(document.getElementById('selecteur').value != '') this.formulaireData(document.getElementById('selecteur').value);
				this.formulaireActualiser();				
				window.setTimeout("document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/0.png/,'1.png')",100);	
			}//end if
			break;
		case "dernier":
			if(document.getElementById('selecteur_dernier').src.indexOf('1.png') > -1){	
				document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/1.png/,'0.png');								
//				variables += "<bouton>dernier</bouton>";
				this.variables['bouton'] = 'dernier';				
				var selecteurXml =ajax("formulaire","selecteur",this.variables);
				if(selecteurXml.getElementsByTagName('data')[0].firstChild){
					document.getElementById('selecteur').value = selecteurXml.getElementsByTagName('data')[0].firstChild.data;
				}//end if
				document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/0.png/,'1.png');
				document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/0.png/,'1.png');				
				document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/1.png/,'0.png');
				document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/1.png/,'0.png');				
				if(document.getElementById('selecteur').value != '') this.formulaireData(document.getElementById('selecteur').value);
				this.formulaireActualiser();				
				window.setTimeout("document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/0.png/,'1.png')",100);	
			}//end if
			break;
		}//end switch
	};//end function	
	
	this.selecteurEffacer = function(){
		document.getElementById('selecteur').value = '';
		document.getElementById('selecteur_premier').src = document.getElementById('selecteur_premier').src.replace(/0.png/,'1.png');
		document.getElementById('selecteur_precedent').src = document.getElementById('selecteur_precedent').src.replace(/1.png/,'0.png');				
		document.getElementById('selecteur_suivant').src = document.getElementById('selecteur_suivant').src.replace(/1.png/,'0.png');
		document.getElementById('selecteur_dernier').src = document.getElementById('selecteur_dernier').src.replace(/0.png/,'1.png');									
	};//end function
	
	this.evenementClavier = function(){
		//appui sur la touche Entrée
		if (event.keyCode == "13"){
			formulaire.reglesExecuter('entree.onkeyup','all','all');
		}//end if
		
		//appui sur la touche F8 => Affichage des variables
		if (event.keyCode == "119"){
			if(formulaire.session['developpeur'] == '1'){
				devVariables(formulaire.variables);
			}//end if
		}//end if
	};//end function
	
}//end classe