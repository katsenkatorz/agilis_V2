//héritage de la classe globale Objet
//Editeur.prototype = new Objet();

//Classe Editeur
function Editeur(){

	//Propriétés de l'éditeur
	this.controlesArray = new Array();
	
	//Constructeur de la classe
	this.initialiser = function(){
		this.controleNouveau();
		this.setControlesArray();
		this.setParentSelect();
		this.elementsAfficher();
		this.elementInitialiser();
	};//end function
	
	//Chargement du tableau des controles à partir de la base de données
	this.setControlesArray = function(){
		var variables = new Array();
		variables['var_requete_code'] = 'rq_zz_gc_007';
		variables['var_onglet_code'] =  top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_onglet_input.value;
		var controlesXml = ajax("requete","executer",variables);
		var controle = controlesXml.getElementsByTagName('data')[0].firstChild;
		while(controle){
			var controleCode = controle.getElementsByTagName('code')[0].firstChild.data;
			this.controlesArray[controleCode] = new Array;
			this.controlesArray[controleCode]['code'] =controle.getElementsByTagName('code')[0].firstChild.data;controle['code'];
			this.controlesArray[controleCode]['type'] = (controle.getElementsByTagName('type')[0].firstChild ? controle.getElementsByTagName('type')[0].firstChild.data : '');
			this.controlesArray[controleCode]['position'] = (controle.getElementsByTagName('position')[0].firstChild ? controle.getElementsByTagName('position')[0].firstChild.data : '');
			this.controlesArray[controleCode]['top'] =  (controle.getElementsByTagName('top')[0].firstChild ? controle.getElementsByTagName('top')[0].firstChild.data : 0);
			this.controlesArray[controleCode]['left'] =  (controle.getElementsByTagName('left')[0].firstChild ? controle.getElementsByTagName('left')[0].firstChild.data : 0);
			this.controlesArray[controleCode]['width'] =  (controle.getElementsByTagName('width')[0].firstChild ? controle.getElementsByTagName('width')[0].firstChild.data : 100);
			this.controlesArray[controleCode]['height'] =  (controle.getElementsByTagName('height')[0].firstChild ? controle.getElementsByTagName('height')[0].firstChild.data : 20);
			this.controlesArray[controleCode]['libelle'] =  (controle.getElementsByTagName('libelle')[0].firstChild ? controle.getElementsByTagName('libelle')[0].firstChild.data :'');
			this.controlesArray[controleCode]['parent'] =  (controle.getElementsByTagName('parent')[0].firstChild ? controle.getElementsByTagName('parent')[0].firstChild.data :'');
			this.controlesArray[controleCode]['champ'] =  (controle.getElementsByTagName('champ')[0].firstChild ? controle.getElementsByTagName('champ')[0].firstChild.data :'');
			this.controlesArray[controleCode]['multiple'] =  (controle.getElementsByTagName('multiple')[0].firstChild ? controle.getElementsByTagName('multiple')[0].firstChild.data :'');			
			controle = controle.nextSibling;
		}//end while
	};//end function

	/*******************************************************************************************************************
	 * EVENEMENTS SOURIS
	 *******************************************************************************************************************
	 */

	//Action déclenchée par le mouseDown sur un élément
	this.elementOnMouseDown = function(elementId){
		var element = document.getElementById(elementId);	
		element.disabled='disabled';			
		this.elementDeselectionner();
		this.controlesArrayToControle(elementId);
		this.deplacementDebut(elementId);
	};//end function

	//Action déclenchée par le mouseUp sur un élément 
	this.elementOnMouseUp = function (elementId){
		document.onmousemove = null;
		this.elementToControle(elementId);
		var element = document.getElementById(elementId);	
		element.disabled = '';
	};//end function
	
	//Action déclenchée par le mouseMove sur un élément 
	this.elementOnMouseMove = function (elementId,deltaX,deltaY){
		this.deplacementExecuter(elementId,deltaX,deltaY);
		this.repereAfficher(elementId);
	};//end function
	
	//Action déclenchée au survol d'un élément 	
	this.elementOnMouseOver = function (elementId,p){
		if(p){
			var element = document.getElementById(elementId);			
			element.parentNode.onmousedown = null;
		}//end if
	};//end function	
	
	//Action déclenchée en fin de survol d'un élément 
	this.elementOnMouseOut = function (elementId,p){
		if(p){	
			var element = document.getElementById(elementId);
			element.parentNode.onmousedown = function(){editeur.elementOnMouseDown(this.id);};
		}//end if
	};//end function	

	/*******************************************************************************************************************
	 * ELEMENTS CLAVIER
	 *******************************************************************************************************************
	 */		
	this.controleOnChange = function(){
		this.controleToControlesArray();
		this.controleToElement();
	};//end function

	/*******************************************************************************************************************
	 * ELEMENTS
	 *******************************************************************************************************************
	 */
	
	this.elementInitialiser = function(){
		var controleCode = top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_controle_input.value;
		if(controleCode != ''){
			this.controlesArrayToControle(controleCode);
			this.elementSelectionner(controleCode);
			this.repereAfficher(controleCode);
		}//end if
	};//end function
	
	//Affichage de tous les éléments à partir du tableau des controles
	this.elementsAfficher = function(){
		for(var controleCode in this.controlesArray){
			this.elementAfficher(controleCode);
		}//end for
	};//end if
	
	//Affichage d'un élément
	this.elementAfficher = function(controleCode){
		switch(this.controlesArray[controleCode]['type']){
			case 'a':	
			case 'button':	
			case 'label':					
			case 'legend':
			case 'p':
			case 'span':
				var element = document.createElement(this.controlesArray[controleCode]['type']);
				var elementLibelle = document.createTextNode(this.controlesArray[controleCode]['libelle']);
				element.appendChild(elementLibelle);
				element.style.width = this.controlesArray[controleCode]['width'];
				element.style.height = this.controlesArray[controleCode]['height'];
				break;
			case 'input':
			case 'textarea':				
				var element = document.createElement(this.controlesArray[controleCode]['type']);
				element.style.width = this.controlesArray[controleCode]['width'];
				element.style.height = this.controlesArray[controleCode]['height'];
				var codeArray = controleCode.split('_');
				element.value = codeArray[3];
				break;
			case 'select':	
				var element = document.createElement(this.controlesArray[controleCode]['type']);
				element.style.width = this.controlesArray[controleCode]['width'];
				element.style.height = this.controlesArray[controleCode]['height'];
				var codeArray = controleCode.split('_');
				element.length = 1;
				element.options[0].text = codeArray[3];
				if(this.controlesArray[controleCode]['multiple']) element.multiple = 'multiple';
				break;
			case 'checkbox':
				var element = document.createElement('input');
				element.type = 'checkbox';
				break;
			case 'radio':
				var element = document.createElement('input');
				element.type = 'radio';
				break;	
			case 'img':
				var element = document.createElement('img');
				element.style.width = this.controlesArray[controleCode]['width'];
				element.style.height = this.controlesArray[controleCode]['height'];					
				element.src = this.controlesArray[controleCode]['libelle'];
				break;				
			case 'file':
				var element = document.createElement('input');
				element.type = 'file';
				element.style.width = this.controlesArray[controleCode]['width'];
				element.style.height = this.controlesArray[controleCode]['height'];
				break;
			case 'fieldset':
			case 'form':
				var element = document.createElement(this.controlesArray[controleCode]['type']);
				element.style.border = 'outset thin black';
				element.style.width = this.controlesArray[controleCode]['width'];
				element.style.height =this.controlesArray[controleCode]['height'];
				break;
		}//end switch
		element.readOnly = true;
		var elementParentId = this.controlesArray[controleCode]['parent'];
		element.id = this.controlesArray[controleCode]['code'];
		element.style.position = 'absolute';
		element.style.top = this.controlesArray[controleCode]['top'];
		element.style.left = this.controlesArray[controleCode]['left'];
		element.onmousedown = function(){editeur.elementOnMouseDown(this.id);};
		if(typeof elementParentId == "undefined" || elementParentId == ''){
			document.body.appendChild(element);
			element.onmouseover = function(){ editeur.elementOnMouseOver(this.id,0);};
			element.onmouseout = function(){ editeur.elementOnMouseOut(this.id,0);};					
		}else{
			var elementParent = document.getElementById(elementParentId);
			elementParent.appendChild(element);
			element.onmouseover = function(){ editeur.elementOnMouseOver(this.id,1);};
			element.onmouseout = function(){ editeur.elementOnMouseOut(this.id,1);};	
		}//end if
	};//end function

	this.elementSelectionner = function(elementId){
		var element = document.getElementById(elementId);
		if(element){
			element.style.backgroundColor = 'red';
			element.style.color = 'white';
		}//end if
	};//end if
	
	//Supprime la sélection d'un élément
	this.elementDeselectionner = function (){
		var elementId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value;
		if(elementId != ''){
			var element = document.getElementById(elementId);	
			if(element){
				element.style.backgroundColor = '';
				element.style.color = '';
			}//end if
			top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_controle_input.value = '';
		}//end if
	};//end function
	
	this.elementSupprimer = function(){
		var elementId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value;
		if(elementId != ''){
			var element = document.getElementById(elementId);
			element.parentNode.removeChild(element);
			this.controlesArray = unset(this.controlesArray,elementId);
			if(elementId.tagName == 'fieldset' || elementId.tagName == 'form') this.setParentSelect();
			this.controleNouveau();
		}//end if
	};//End function

	/*******************************************************************************************************************
	 * AJOUTER
	 *******************************************************************************************************************
	 */

	this.ajouterChamps = function(){
		var champsArray = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_champs_input.value.split(',');
		for(var i = 0 ; i < champsArray.length ; i++){
			var champNomArray = champsArray[i].split('_');
			var controleNom = champNomArray[2].substr(0,1).toLowerCase() + champNomArray[2].substr(1);
			var controleType = (parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value == '' ? 'input' : parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value);
			var controleCode = window.top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_onglet_input.value + '_' + controleNom + '_' + controleType;	
			if(typeof this.controlesArray[controleCode] == 'undefined'){
				//Ajout du label
				var labelArray = new Array();
				var labelCode = window.top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_onglet_input.value + '_' + controleNom + '_label';	
				labelArray['code'] = labelCode;
				labelArray['type'] = 'label';
				labelArray['top'] = 25 * i + 25;
				labelArray['left'] = 1000;				
				labelArray['libelle'] = controleNom;
				labelArray['parent'] = '';
				labelArray = this.ajouterProprietes(labelArray);
				this.controlesArray[labelCode] = labelArray;
				this.elementAfficher(labelCode);					
				//Ajout du controle
				var controleArray = new Array();
				controleArray['code'] =	controleCode;
				controleArray['type'] = controleType;
				controleArray['top'] = 25 * i + 25;
				controleArray['left'] = 1100;
				controleArray['champ'] = champsArray[i];
				controleArray['parent'] = '';			
				controleArray = this.ajouterProprietes(controleArray);
				this.controlesArray[controleCode] = controleArray;
				this.elementAfficher(controleCode);
			}//end if
		}//end for
	};//end function
	
	this.ajouterProprietes = function(controleArray){
		var controlePosition = 0;
		for(var controle in this.controlesArray) if(1 * this.controlesArray[controle]['position'] > controlePosition) controlePosition = 1 * this.controlesArray[controle]['position'];
		controleArray['position'] = controlePosition + 1;
		switch(controleArray['type']){
			case 'a':
			case 'label':
			case 'span':
				controleArray['width'] = 90;
				controleArray['height'] = 15;
				controleArray['champ'] = '';
				break;
			case 'button':
			case 'legend':
				controleArray['width'] = 100;
				controleArray['height'] = 25;
				controleArray['champ'] = '';
				break;
			case 'select':
			case 'input':
				controleArray['libelle'] = '';
				controleArray['width'] = 100;
				controleArray['height'] = 20;					
				break;
			case 'textarea':
				controleArray['libelle'] = '';
				controleArray['width'] = 300;
				controleArray['height'] = 100;					
				break;
			case 'fieldset':
			case 'form':
				controleArray['libelle'] = '';					
				controleArray['width'] = 300;
				controleArray['height'] = 100;
				controleArray['champ'] = '';	
				break;
			case 'img':
				controleArray['width'] = 20;
				controleArray['height'] = 20;
				controleArray['champ'] = '';				
				break;
		}//end switch
		return controleArray;
	};//end function	
	
	/*******************************************************************************************************************
	 * PARENT
	 *******************************************************************************************************************
	 */	
	
	this.setParentSelect = function(){
		var parentSelect = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_parent_select;
		parentSelect.options.length = 1;
		for(var controle in this.controlesArray){
			var controleArray = controle.split('_');
			var controleTagName = controleArray[4];
			if(controleTagName == 'fieldset' || controleTagName == 'form'){
				var optionCode = controle;
				var optionLibelle = controleArray[3] + '_' + controleArray[4];
				var option = new Option(optionLibelle,optionCode);
				parentSelect[parentSelect.options.length] = option;
			}//end if
		}//end for
	};//end function
	
	this.parentAffecter = function(){
		var elementId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value;
		var element = document.getElementById(elementId);
		var elementParentId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_parent_select.value;
		if(elementId != elementParentId){
			this.controlesArray[elementId]['parent'] = elementParentId;				
			if(elementParentId == ''){
				document.body.appendChild(element);
				element.onmouseover = function(){editeur.elementOnMouseOver(this.id,0);};
				element.onmouseout = function(){editeur.elementOnMouseOut(this.id,0);};				
			}else{
				var elementParent = document.getElementById(elementParentId);
				elementParent.appendChild(element);
				element.onmouseover = function(){editeur.elementOnMouseOver(this.id,1);};
				element.onmouseout = function(){editeur.elementOnMouseOut(this.id,1);};			
			}//end if
			element.style.top = 0;
			element.style.left = 0;
			this.repereAfficher(elementId);
		}//end if
	};//end function

	/*******************************************************************************************************************
	 * DEPLACEMENT
	 *******************************************************************************************************************
	 */	
	
	this.deplacementDebut = function(elementId){
		this.repereEffacer();	
		var element = document.getElementById(elementId);
		var mouseX = event.clientX;
		var mouseY = event.clientY;
		var deltaX = parseInt(element.style.left) - mouseX;
		var deltaY = parseInt(element.style.top) - mouseY;
		document.onmouseup = function(){editeur.elementOnMouseUp(elementId);};
		document.onmousemove = function(){editeur.elementOnMouseMove(elementId,deltaX,deltaY);};
		this.repereAfficher(elementId);
		this.elementSelectionner(elementId);		
	};//end function

	this.deplacementExecuter = function(elementId,deltaX,deltaY){
		var element = document.getElementById(elementId);	
		//Calcul du déplacement
		var mouseX = event.clientX;
		var mouseY = event.clientY;
		var elementX = mouseX + deltaX;
		var elementY = mouseY + deltaY;
		elementX = this.aimantationX(elementX);
		elementY = this.aimantationY(elementY);	
		//Limite du déplacement
		var limiteXsup = 1250;
		var limiteYsup = 1000;
		var elementParentId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_parent_select.value;
		if(elementParentId != ''){
			var elementParent = document.getElementById(elementParentId);
			limiteXsup = parseInt(elementParent.style.width);
			limiteYsup = parseInt(elementParent.style.height);
		}//end if
		if(elementX < 0) elementX = 0;
		if(elementY < 0) elementY = 0;
		var elementWidth = (element.style.width == '' ? 0 : parseInt(element.style.width));
		var elementHeight = (element.style.height == '' ? 0 : parseInt(element.style.height));		
		if(elementX + elementWidth > limiteXsup) elementX = limiteXsup - elementWidth;
		if(elementY + elementHeight > limiteYsup) elementY = limiteYsup - elementHeight;		
		//Déplacement
		element.style.left = elementX;
		element.style.top = elementY;		
	};//end function
	
	this.aimantationX = function(elementX){
		var aimantationX = null;
		var aimantationHorizontale = parent.pc_dev_editeur_formulaire.gl_dev_editeurAimantation_horizontal_fieldset.value;
		switch(aimantationHorizontale){
			case '1':
				var aimantationGrilleX = 1;
				aimantationX = (elementX + aimantationGrilleX/2) - (elementX + aimantationGrilleX/2) % aimantationGrilleX;			
				break;
			case '2':
				var aimantationGrilleX = parent.pc_dev_editeur_formulaire.gl_dev_editeurAimantation_horizontal02_select.value;
				aimantationX = (elementX + aimantationGrilleX/2) - (elementX + aimantationGrilleX/2) % aimantationGrilleX;			
				break;
			case '3':
				var elementId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAimantation_horizontal03_input.value;
				aimantationX = (elementId == '' ? 0 : parseInt(document.getElementById(elementId).style.left));
				break;
		}//end switch 	
		return aimantationX;
	};//end function
	
	this.aimantationY = function(elementY){
		var aimantationY = null;
		var aimantationVerticale = parent.pc_dev_editeur_formulaire.gl_dev_editeurAimantation_vertical_fieldset.value;
		switch(aimantationVerticale){
			case '1':
				var aimantationGrilleY = 1;
				aimantationY = (elementY + aimantationGrilleY/2) - (elementY + aimantationGrilleY/2) % aimantationGrilleY;			
				break;
			case '2':
				var aimantationGrilleY = parent.pc_dev_editeur_formulaire.gl_dev_editeurAimantation_vertical02_select.value;
				aimantationY = (elementY + aimantationGrilleY/2) - (elementY + aimantationGrilleY/2) % aimantationGrilleY;			
				break;
			case '3':
				var elementId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAimantation_vertical03_input.value;
				aimantationY = (elementId == '' ? 0 : parseInt(document.getElementById(elementId).style.top));
				break;
		}//end switch 	
		return aimantationY;
	};//end function	

	/*******************************************************************************************************************
	 * REPERES
	 *******************************************************************************************************************
	 */	
	
	this.repereAfficher = function(elementId){
		if(document.getElementById(elementId)){
			if(! document.getElementById('repere_trait_horizontal')) this.repereCreer();
			this.repereDeplacer(elementId);
		}//end if
	};//end function
	
	this.repereCreer = function(){			
		var traitHorizontal = document.createElement('img');		
		traitHorizontal.id = 'repere_trait_horizontal';
		traitHorizontal.style.position = 'absolute';
		traitHorizontal.style.left = 20;		
		traitHorizontal.style.width = 1245;
		traitHorizontal.style.height = 0;
		traitHorizontal.style.border = 'dotted 1 red';	
		document.body.appendChild(traitHorizontal);
		
		var traitVertical = document.createElement('img');
		traitVertical.id = 'repere_trait_vertical';		
		traitVertical.style.position = 'absolute';
		traitVertical.style.top = 10;	
		traitVertical.style.height = 995;
		traitVertical.style.width = 0;
		traitVertical.style.border = 'dotted 1 red';
		document.body.appendChild(traitVertical);		
		
		var etiquetteHorizontal = document.createElement('label');
		etiquetteHorizontal.id = 'repere_etiquette_horizontal';		
		var label = document.createTextNode('');
		etiquetteHorizontal.appendChild(label);
		etiquetteHorizontal.style.position = 'absolute';
		etiquetteHorizontal.style.fontSize = '12';
		etiquetteHorizontal.style.color = 'red';	
		etiquetteHorizontal.style.fontWeight = 'bold';	
		document.body.appendChild(etiquetteHorizontal);	
		
		var etiquetteVertical = document.createElement('label');
		etiquetteVertical.id = 'repere_etiquette_vertical';		
		var label = document.createTextNode('');
		etiquetteVertical.appendChild(label);
		etiquetteVertical.style.position = 'absolute';
//		etiquetteVertical.style.writingMode = 'tb-rl';
		etiquetteVertical.style.fontSize = '12';
		etiquetteVertical.style.color = 'red';
		etiquetteVertical.style.fontWeight = 'bold';
		document.body.appendChild(etiquetteVertical);
	};//end function	

	this.repereDeplacer = function(elementId){
		var element = document.getElementById(elementId);
		var elementTop = parseInt(element.style.top);
		var elementLeft = parseInt(element.style.left);			
		var parentId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_parent_select.value;
		var repereTop = 0 ; var repereLeft = 0 ; 
		if(parentId == ''){
			repereTop = elementTop;
			repereLeft = elementLeft;		
		}else{
			var parentHtml = document.getElementById(parentId);			
			repereTop = elementTop + parseInt(parentHtml.style.top);
			repereLeft = elementLeft + parseInt(parentHtml.style.left);
		}//end if
		document.getElementById('repere_trait_horizontal').style.top = repereTop;
		document.getElementById('repere_trait_vertical').style.left = repereLeft;		
		document.getElementById('repere_etiquette_horizontal').firstChild.data = elementLeft;
		document.getElementById('repere_etiquette_horizontal').style.top = 0;		
		document.getElementById('repere_etiquette_horizontal').style.left = repereLeft - 10;
		document.getElementById('repere_etiquette_vertical').firstChild.data = elementTop;
		document.getElementById('repere_etiquette_vertical').style.top = repereTop - 8 ;		
		document.getElementById('repere_etiquette_vertical').style.left = 0;		
	};//end function
			
	this.repereEffacer = function(){
		if(document.getElementById('repere_trait_horizontal')){
			document.body.removeChild(document.getElementById('repere_trait_horizontal'));
			document.body.removeChild(document.getElementById('repere_trait_vertical'));
			document.body.removeChild(document.getElementById('repere_etiquette_horizontal'));		
			document.body.removeChild(document.getElementById('repere_etiquette_vertical'));				
		}//end if
	};//end function
	
	/*******************************************************************************************************************
	 * CONTROLES
	 *******************************************************************************************************************
	 */

	this.controleInitialiser = function(){
		var controleNom = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_nom_input.value;
		var controleType = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value;
		var controleCode = window.top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_onglet_input.value + '_' + controleNom + '_' + controleType;
		if(typeof this.controlesArray[controleCode] != 'undefined'){
		   alert('Ajout impossible.\nCe controle existe déjà.');
		   this.controlesArrayToControle(controleCode);
		   this.elementSelectionner(controleCode);
		   this.repereAfficher(controleCode);
		}else{		
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value = controleCode;		
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_top_input.value = 0;
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_left_input.value = 0;
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_libelle_input.value = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_nom_input.value;
			var controleArray = new Array();
			controleArray['type'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value;
			controleArray = this.ajouterProprietes(controleArray);
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_width_input.value = controleArray['width'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_height_input.value = controleArray['height'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_position_input.value = controleArray['position'];
			this.controleLectureSeule(true);
			var controleType = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value;
			this.controleLectureSeuleType(controleType);
		}//end if
	};//end function

	this.controleAjouter = function(){
		var controleCode = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value;
		if(typeof this.controlesArray[controleCode] == 'undefined'){		
			this.controleToControlesArray();
			var controleType = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value;			
			if(controleType == 'fieldset' || controleType == 'form') this.setParentSelect();
			this.elementAfficher(controleCode);
			this.elementSelectionner(controleCode);
			this.repereAfficher(controleCode);
		}//end if
	};//end function
	
	this.controleToControlesArray = function(){
		var controle = new Array;
		controle['code'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value;
		controle['position'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_position_input.value;
		controle['top'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_top_input.value;
		controle['left'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_left_input.value;
		controle['type'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value;
		controle['libelle'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_libelle_input.value;
		controle['width'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_width_input.value;
		controle['height'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_height_input.value;
		controle['parent'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_parent_select.value;
		controle['champ'] = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_champ_select.value;		
		this.controlesArray[controle['code']] = controle;
	};//end function

	this.controlesArrayToControle = function(controleCode){
		if(this.controlesArray[controleCode]){
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value = this.controlesArray[controleCode]['code'];
			var codeArray = this.controlesArray[controleCode]['code'].split('_');
			var controleNom = codeArray[3];		
			var controleType = codeArray[4];		
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_nom_input.value = controleNom;
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value = controleType;
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_position_input.value = this.controlesArray[controleCode]['position'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_top_input.value = this.controlesArray[controleCode]['top'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_left_input.value = this.controlesArray[controleCode]['left'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_width_input.value = this.controlesArray[controleCode]['width'];		
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_height_input.value = this.controlesArray[controleCode]['height'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_libelle_input.value = this.controlesArray[controleCode]['libelle'];		
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_parent_select.value = this.controlesArray[controleCode]['parent'];
			parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_champ_select.value = this.controlesArray[controleCode]['champ'];	
			this.controleLectureSeule(true);
			this.controleLectureSeuleType(controleType);
		}//end if
	};//end function
	
	this.controleLectureSeule = function(ok){
		var controlesListeOk = new Array('gl_dev_editeurAccueil_nom_input','gl_dev_editeurAccueil_type_select');
		parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(controlesListeOk,ok);
		var controlesListeNok = new Array('gl_dev_editeurAccueil_parent_select','gl_dev_editeurAccueil_top_input','gl_dev_editeurAccueil_left_input','gl_dev_editeurAccueil_width_input','gl_dev_editeurAccueil_height_input','gl_dev_editeurAccueil_position_input','gl_dev_editeurAccueil_libelle_input','gl_dev_editeurAccueil_champ_select');
		parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(controlesListeNok, ! ok);
	};//end function
	
	this.controleLectureSeuleType = function(controleType){
		var libelle = new Array('gl_dev_editeurAccueil_libelle_input');
		var champ = new Array('gl_dev_editeurAccueil_champ_select');		
		switch(controleType){
			case 'a':
			case 'label':
			case 'span':
			case 'button':
			case 'legend':
			case 'p':
				parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(libelle,false);
				parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(champ,true);				
				break;
			case 'fieldset':
			case 'form':					
				parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(libelle,false);
				parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(champ,false);		
				break;
			case 'select':	
			case 'input':
			case 'radio':
			case 'checkbox':
			case 'textarea':
				parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(libelle,true);
				parent.pc_dev_editeur_formulaire.formulaire.controlesLectureSeule(champ,false);	
				break;
		}//end switch
	};//end function
	
	this.controleNouveau = function(){
		this.elementDeselectionner();
		this.repereEffacer();	
		this.controleLectureSeule(false);	
		document.onmouseup = null;
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value = '';
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_nom_input.value = '';		
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_top_input.value = '';
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_left_input.value = '';
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_width_input.value = '';		
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_height_input.value = '';
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_position_input.value = '';		
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_libelle_input.value = '';		
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_champ_select.value = '';	
	};//end function	

	this.elementToControle = function(elementId){
		var element = document.getElementById(elementId);
		this.controlesArray[elementId]['top'] = parseInt(element.style.top);
		this.controlesArray[elementId]['left'] = parseInt(element.style.left);
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_top_input.value = parseInt(element.style.top);
		parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_left_input.value = parseInt(element.style.left);
		top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_controle_input.value = elementId;
	};//end function

	this.controleToElement = function(){
		var elementId = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_code_input.value;
		var element = document.getElementById(elementId);
		element.style.top = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_top_input.value;
		element.style.left = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_left_input.value;
		element.style.width = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_width_input.value;		
		element.style.height = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_height_input.value;
		var elementType = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_type_select.value;
		if(',a,button,label,legend,p,span,'.indexOf(elementType) > -1) document.getElementById(elementId).firstChild.data = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_libelle_input.value;
		if(elementType == 'img') element.src = parent.pc_dev_editeur_formulaire.gl_dev_editeurAccueil_libelle_input.value;
		this.repereAfficher(elementId);
	};//end function
	
	this.controlesArraySauvegarder = function(){
		var variables = new Array();
		variables['var_onglet_code'] = top.af_dev_entete.pc_dev_entete_menu.gl_dev_menuFormulaire_onglet_input.value;
		for(var controleCode in this.controlesArray){
			variables[controleCode] =  this.controlesArray[controleCode]['code'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['position'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['champ'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['libelle'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['top'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['left'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['width'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['height'] + '³³'; 
			variables[controleCode] += this.controlesArray[controleCode]['parent'] ;
		}//end for
		ajax("editeur","sauvegarder",variables);
	};//end function
	
};//end class