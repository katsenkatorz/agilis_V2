//héritage de la classe globale Objet
//Liste.prototype = new Objet();

//Classe Liste
function Liste(){
	
	//Extension de l'héritage
	herite(this,new Regle());

	this.variables = getVariablesDocument();
	this.listeCode = this.variables['var_liste_code'];
	this.listeCadre = this.variables['var_cadre_code'];	
	this.session = new Array;
	this.colonnesXml = null;
	this.reglesXml = null;

 /*******************************************************************************
 * INITIALISATION
 ******************************************************************************** 
 */
	//Initialiser la liste
	this.listeInitialiser = function(){
		this.listeCharger();
		this.listePositionner();
		this.selectionInitialiser();
		this.filtreAfficher();
		this.reglesExecuter(this.listeCode + '.onload','all','all');
	};//end function

	//Récupère les colonnes et règles de la liste
	this.listeCharger = function(){
		while(typeof document.getElementsByTagName('variable') == 'undefined');
		var listeXml = ajax("liste","charger",this.variables);
		this.colonnesXml = listeXml.getElementsByTagName('colonnes')[0];
		this.reglesXml = listeXml.getElementsByTagName('regles')[0];
		
		//Chargement des variables de session
		var listeArray = fileXmlToArray(listeXml);
		this.session = listeArray['session'];
	
	};//end function

 /*******************************************************************************
 * LISTE
 ******************************************************************************** 
 */	
	//Se positionne sur la ligne sélectionnée et déclenche éventuellement le clic
	this.listePositionner = function(){
		if( (typeof this.variables['var_liste_clic_id'] == 'undefined' || this.variables['var_liste_clic_id'] == '' ) && this.variables['var_liste_clic_valeur']){	
			this.variables['var_liste_clic_id'] = this.listeClicValeurToId(this.variables['var_liste_clic_valeur']);
		}//end if	
		if(this.variables['var_liste_clic_id']){
			if(document.getElementById(this.variables['var_liste_clic_id'])){
				var ligneTop = document.getElementById(this.variables['var_liste_clic_id']).parentNode.parentNode.offsetTop;
				window.scrollBy(0, ligneTop);
				this.ligneEncadrer(this.variables['var_liste_clic_id']);				
			}//end if
		}//end if
		if(this.variables['var_liste_clic']){
			this.listeCliquer();	
		}//end if
	};//end if
	
	//Affichage de la liste
	this.listeAfficher = function(){
		var variables = ax(arrayToXml(this.variables));
		location.replace(url + "/liste/afficher?variables=" + variables);
	};//end function
	
	//Simule un clic sur la liste
	this.listeCliquer = function(){
		if(this.variables['var_liste_clic_id']){
			var ligneId = this.variables['var_liste_clic_id'];
			if(document.getElementById(ligneId) == null){
				var colonneNom = ligneId.substring(0,ligneId.lastIndexOf('_'));
				var ligneNombre = Number(ligneId.substring(ligneId.lastIndexOf('_') + 1)) - 1;
				this.variables['var_liste_clic_id'] = (ligneNombre < 0 ? colonneNom + '_' : colonneNom + '_' + String(ligneNombre));
			}//end if
			this.celluleClick(this.variables['var_liste_clic_id']);
		}//end if
		this.variables[var_liste_clic] = null;
	};//end function
	
	this.listeClicValeurToId = function(valeur){
		var id = null;
		var elementsArray = document.getElementsByTagName('a');
		for(var element in elementsArray){
			if(elementsArray[element].value == valeur){
				id = elementsArray[element].id;
				break;
			}//end if
		}//end for
		return id;
	};//end if
	
/********************************************************************************
 * CELLULES
 ******************************************************************************** 
 */		
	//Fonction exécutée sur clic d'une cellule 
	this.celluleClick = function(celluleId){
		if(document.getElementById(celluleId)){	
			//Encadre la ligne sélectionnée
			this.ligneEncadrer(celluleId);
			//Sauvegarde l'Id de la cellule et sa valeur
			this.variables['var_liste_clic_id'] = celluleId;
			var celluleValeur = document.getElementById(celluleId).value;
			this.variables['var_liste_clic_valeur'] = celluleValeur;
			this.variables['var_liste_clic_libelle'] = (document.getElementById(celluleId).firstChild ? document.getElementById(celluleId).firstChild.data :'');	
			this.variables['var_liste_clic_ligne'] = celluleId.substr(celluleId.lastIndexOf('_')+1);
		}//end if	
		//Execution de la règle correspondant au lien
		var colonneId = celluleId.substring(0,celluleId.lastIndexOf('_'));
		this.reglesExecuter(colonneId + '.onclick','all','all');
	};//end function

/********************************************************************************
 * LIGNES
 ******************************************************************************** 
 */
	//Encadre une ligne
	this.ligneEncadrer = function(celluleId){
		if(typeof celluleId == 'undefined') celluleId = this.variables['var_liste_clic_id'];
		var idClicPrecedent = this.variables['var_liste_clic_id'];
		if(celluleId != idClicPrecedent && typeof idClicPrecedent != 'undefined' && idClicPrecedent != '' && idClicPrecedent != null){
			var ligneTdPrecedente = document.getElementById(idClicPrecedent).parentNode.parentNode.getElementsByTagName('td');				
			for(var i = 0 ; i < ligneTdPrecedente.length ; i++){
				ligneTdPrecedente[i].style.borderStyle = 'none';
			}//end foreach
		}//end if
		if(document.getElementById(celluleId)){
			var ligneTd = document.getElementById(celluleId).parentNode.parentNode.getElementsByTagName('td');				
			for(var i = 0 ; i < ligneTd.length ; i++){
				ligneTd[i].style.borderStyle = 'inset';
			}//end foreach
			 this.variables['var_liste_clic_id'] = celluleId;
		}//end if
	};//end function
	
/********************************************************************************
 * TRI
 ******************************************************************************** 
 */		
	//Modification de l'ordre de tri et ré-affichage de la liste
	this.tri = function(colonneId){
		var colonneAlias = colonneId.substr(colonneId.lastIndexOf('_') + 1);
		if(typeof this.variables['var_sql_orderby'] == 'undefined') this.variables['var_sql_orderby'] = 'null';
		if(colonneAlias == 'liste'){
			this.variables['var_sql_orderby'] = 'null';
			window.setTimeout('liste.listeAfficher()',250);
		}else{
			triArrayInput = new Array();
			triArrayOutput = new Array();
			if(this.variables['var_sql_orderby'] != 'null') triArrayInput = this.variables['var_sql_orderby'].split(",");
		
			var regexp = new RegExp('^'+colonneAlias+'$|^'+colonneAlias+'[, ]|[, ]'+colonneAlias+'[, ]|[, ]'+colonneAlias+'$'); 
			if(regexp.test(this.variables['var_sql_orderby'])){
				var champRegexp = new RegExp('^' + colonneAlias + ' |^'+ colonneAlias);
				for(var i=0 ; i < triArrayInput.length ; i++){
					if(champRegexp.test(triArrayInput[i])){
						var sensRegexp = / desc$/;
						if(sensRegexp.test(triArrayInput[i]) == false){						
							triArrayOutput.push(colonneAlias + " " + 'desc');	
						}//end if
					}else{
						triArrayOutput.push(triArrayInput[i]);
					}//end if
				}//end for
			}else{
				triArrayOutput = triArrayInput;
				triArrayOutput.push(colonneAlias + " " + 'asc');
			}//end if
			this.variables['var_sql_orderby'] = triArrayOutput.join(",");
			if(this.variables['var_sql_orderby'] == '') this.variables['var_sql_orderby'] = 'null';
			window.setTimeout('liste.listeAfficher()',250);
		}//end if
	};//end function

/********************************************************************************
 * FILTRES
 ********************************************************************************
 */	
	//Ré-affichage de la liste en appliquant les valeurs du filtre
	this.filtreAppliquer = function(){
		var filtre = '';
		
		for(var iColonne=0 ; iColonne < colonneCode.length ; iColonne++){
			for(var iLigne=0 ; iLigne < 2 ; iLigne++){
				filtreOperateur = eval("filtreOperateur" + iLigne);
				filtreValeur = eval("filtreValeur" + iLigne);				
				if(filtreOperateur[iColonne].value != '' && filtreValeur[iColonne].value != ''){
					var colonneNom = colonneCode[iColonne].value;
					var colonneAlias = colonneNom.substring(colonneNom.lastIndexOf('_') + 1);
					if(filtre != '') filtre += ' AND ';
					if(colonneCode[iColonne].type == 'date'){
						filtre += "STR_TO_DATE(" + colonneAlias + ",'%Y-%m-%d')";						
						filtre += filtreOperateur[iColonne].value;
						filtre += "STR_TO_DATE('" + filtreValeur[iColonne].value + "','%d/%m/%Y')";
					}else{
						filtre += colonneAlias;					
						var valeur = filtreValeur[iColonne].value;
						switch(filtreOperateur[iColonne].value){
							case "=" : 	filtre += " like '" + valeur + "'";break;
							case "<=" : filtre += " <= '" + valeur + "'";break;
							case ">=" : filtre += " >= '" + valeur + "'";break;
							case "<>" : filtre += " not like '" + valeur + "'";break;
						}//end switch
					}//end if	
				}//end if
			}//end for
		}//end for
		if(filtre == '') filtre = 'TRUE';
		if(this.variables['var_sql_having'] != filtre){
			this.variables['var_sql_having'] = filtre;
			this.listeAfficher();
		}//end if	
	};//end function

	//Ré-affichage de la liste après avoir supprimé les valeurs du filtre	
	this.filtreSupprimer = function(){
		if(this.variables['var_sql_having'] != 'TRUE'){		
			this.variables['var_sql_having'] = 'TRUE';
			this.listeAfficher();
		}//end if
	};//end function

	//Affichage des valeurs à l'intérieur du filtre à partir des données reçues par la liste
	this.filtreAfficher = function(){
		if(document.getElementById("filtre")){
			var filtre = (typeof this.variables["var_sql_having"] != 'undefined' ? this.variables["var_sql_having"] : 'TRUE');
			if(filtre != 'TRUE'){
				havingArray = filtre.split("AND");
				for(var iFiltre=0 ; iFiltre < havingArray.length ; iFiltre++){
					//Nettoyage des filtres avec dates
					if(havingArray[iFiltre].indexOf("STR_TO_DATE") > -1){
						havingArray[iFiltre] = havingArray[iFiltre].replace(/STR_TO_DATE./g,"");
						havingArray[iFiltre] = havingArray[iFiltre].replace(/,'%Y-%m-%d'./g,"");
						havingArray[iFiltre] = havingArray[iFiltre].replace(/,'%d.%m.%Y'./g,"");
					}//end if
					//Détection de l'opérateur
					var operateur = '=';
					if(havingArray[iFiltre].indexOf("like") > -1) operateur = 'like';					
					if(havingArray[iFiltre].indexOf("<=") > -1) operateur = '<=';
					if(havingArray[iFiltre].indexOf(">=") > -1) operateur = '>=';					
					if(havingArray[iFiltre].indexOf("<>") > -1) operateur = '<>';
					if(havingArray[iFiltre].indexOf("not like") > -1) operateur = 'not like';						
					var aliasValeur = havingArray[iFiltre].split(operateur);
					var alias = aliasValeur[0].replace(/\s/g,'');
					var valeur = aliasValeur[1];
					valeur = valeur.replace(/^\s/g,'');
					valeur = valeur.replace(/\s$/g,'');
					valeur = valeur.replace(/^'/,'');
					valeur = valeur.replace(/'$/,'');
					if(operateur == 'like') operateur = '=';
					if(operateur == 'not like') operateur = '<>';					
					for(var iColonne = 0 ; iColonne < colonneCode.length ; iColonne++){
						var colonneNom = colonneCode[iColonne].value;
						var colonneAlias = colonneNom.substring(colonneNom.lastIndexOf('_') + 1);						
						if(colonneAlias == alias){
							if(filtreOperateur0[iColonne].value == ''){
								filtreOperateur0[iColonne].value = operateur;
								filtreValeur0[iColonne].value = valeur;
							}else{
								filtreOperateur1[iColonne].value = operateur;
								filtreValeur1[iColonne].value = valeur;							
							}//end if
						}//end if
					}//end for
				}//end for
			}//end if
		}//end if
	};//end function

/********************************************************************************
* SELECTION
********************************************************************************
*/
	
	this.selectionClick = function(iClick){
		if(this.variables['var_selection_unique']){
			var selectionArray = document.getElementsByName('selection');
			for(var i = 0 ; i < selectionArray.length  ; i++){
				if(i == iClick){
					document.getElementsByName('selection')[i].checked = document.getElementsByName('selection')[i].checked;
				}else{
					document.getElementsByName('selection')[i].checked = false;
				}//end if
			}//end for
		}//end if
	};//end function
	
	this.selectionInitialiser = function(){
		if(this.variables['var_selection_formulaire']){
			//Affichage de la case à cocher dans l'entete si sélection multiple
			if(typeof this.variables['var_selection_unique'] == 'undefined'){
				document.getElementById('selection_entete').style.display = 'inline';
			}//end if
			//Boucle pour cocher les cases au chargement
			var formulaireSelection = this.variables['var_selection_formulaire'].split(',');
			var formulaireCodeId = formulaireSelection[0];
			var formulaireCodeValeurs = top.opener.document.getElementById(formulaireCodeId).value;
			var selectionArray = document.getElementsByName('selection');
			for(var i = 0 ; i < selectionArray.length  ; i++){
				var listeCodeValeur = document.getElementById(this.listeCode + '_code_' + selectionArray[i].value).firstChild.data;
				if(formulaireCodeValeurs.indexOf(listeCodeValeur) > -1){
					selectionArray[i].checked = 'checked';
				}//end if
			}//end for
		}//end if
	};//end function
	
	this.selectionEntete = function(){
		var selectionArray = document.getElementsByName('selection');
		for(var i = 0 ; i < selectionArray.length  ; i++){
			selectionArray[i].checked = document.getElementById('selection_entete').checked;
		}//end for
	};//end function
	
	//Affecte les données des lignes sélectionnées au formulaire appelant
	this.selectionValider = function(){
		var formulaireSelection = this.variables['var_selection_formulaire'].split(',');
		var listeSelection = this.variables['var_selection_liste'].split(',');
		//Initialisation du formulaire appelant
		for(var iElement = 0 ; iElement < formulaireSelection.length ; iElement ++){
			top.opener.document.getElementById(formulaireSelection[iElement]).value = '';
		}//end for
		//Affectation des données
		var selectionHtml = document.getElementsByName('selection');
		for(var iLigne = 0 ; iLigne < selectionHtml.length  ; iLigne++){
			if(selectionHtml[iLigne].checked){
				var ligne = selectionHtml[iLigne].value;
				for(var iElement = 0 ; iElement < formulaireSelection.length ; iElement ++){
					var formulaireId = formulaireSelection[iElement];
					var listeId = this.listeCode + '_' + listeSelection[iElement] + '_' + ligne;
					top.opener.document.getElementById(formulaireId).value += (top.opener.document.getElementById(formulaireId).value == '' ? '' : ',');
					top.opener.document.getElementById(formulaireId).value += (document.getElementById(listeId).firstChild ? document.getElementById(listeId).firstChild.data : '');							
				}//end for
			}//end if
		}//end for
		//Active l'icone d'enregistrement si présente dans le formulaire appelant
		var iconeElement = top.opener.document.getElementById('icone_enregistrer');
		if(iconeElement){
			iconeElement.src = iconeElement.src.replace(/0.png/,'1.png');		
		}//end if
		//Execution de la règle associée à la sélection
		this.reglesExecuter('icone_valider.onclick','all','all');
	};//end function
	
	this.selectionSupprimer = function(){
		this.variables['var_selection_codes_supprimer'] = '';
		var selectionHtml = document.getElementsByName('selection');
		for(var iLigne = 0 ; iLigne < selectionHtml.length  ; iLigne++){
			if(selectionHtml[iLigne].checked){
				this.variables['var_selection_codes_supprimer'] += (this.variables['var_selection_codes_supprimer'] == '' ? '' : ',');
				var listeId = this.listeCode + '_code_' + selectionHtml[iLigne].value;
				this.variables['var_selection_codes_supprimer'] += document.getElementById(listeId).firstChild.data;
			}//end if
		}//end for
		if(this.variables['var_selection_codes_supprimer'] && confirm("Etes-vous sûr de vouloir supprimer les lignes sélectionnées (" + this.variables['var_selection_codes_supprimer'] + ")")){
			this.reglesExecuter('icone_supprimer.onclick','all','all');			
		}//end if
	};//end function
	
/********************************************************************************
* AUTRES
********************************************************************************
*/		
	
	//Evenements pour les développeurs
	this.evenementClavier = function(){
		//appui sur la touche F8 => Affichage des variables
		if (event.keyCode == "119"){
			if(liste.session['developpeur'] == '1'){
				devVariables(liste.variables);
			}//end if
		}//end if
	};//end function
	
	//Permet de faire flotter l'entete de liste
	this.Flotter = function() {
		var objetFlottant = document.getElementById("enteteFixe");		
		objetFlottant.sP = function(y){this.style.top=y;};
		objetFlottant.y = 0;
		this.stayTop();
	};//end function
	
	this.stayTop = function(){
		var objetFlottant = document.getElementById("enteteFixe");
		var startY = 0;
		var pY = document.body.scrollTop;
		objetFlottant.y += (pY + startY - objetFlottant.y)/4;
		objetFlottant.sP(objetFlottant.y);
		setTimeout("liste.stayTop()", 0);
	};//end function	
	
}//end classe