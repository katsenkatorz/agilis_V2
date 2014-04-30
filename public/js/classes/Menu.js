//héritage de la classe globale Objet
Menu.prototype = new Objet();

//Classe Menu
function Menu(){
	
	//Extension de l'héritage
	this.herite(this,new Regle());
	this.menuXml = null;
	this.reglesXml = null;
	this.variables = this.getVariablesDocument();

	//Chargement du menu
	this.menuCharger = function(){
		this.menuXml = this.ajax("menu","charger",this.variables);
	};//end function	
	
	//Actualiser le menu
	this.menuActualiser = function(menuPositionActualise){
		this.menuEffacer();
		this.menuAfficher(menuPositionActualise);
		this.reglesXml = this.menuXml.getElementsByTagName('regles')[0];
		//Affectation des règles aux items du menu
		this.reglesAffecter();
		//Affichage d'une page blanche
		top.page.location.href(menu.url + "/html/blanc");
		//Exécution des règles sur chargement du menu
		var declencheur = 'mn_' + menu.getVariableSession('application_code') + '.onload';
		this.reglesExecuter(this.reglesXml,declencheur,'all','all');
		//Affichage éventuel d'une page 
		if(typeof this.variables['var_page_code'] != 'undefined' ){
			var variables =  this.ax(this.arrayToXml(this.variables));
			top.page.location.href(menu.url + "/page/afficher?variables=" + variables);	
		}//end if		
	};//end function

	//Afficher les items du menu
	this.menuAfficher = function(menuPositionActualise){
		var item = this.menuXml.getElementsByTagName('items')[0].firstChild;
		while(item != null){
			var menuCode = item.getElementsByTagName('zz_mn_code')[0].firstChild.data;
			var menuLibelle = item.getElementsByTagName('zz_mn_libelle')[0].firstChild.data;
			var menuPosition = item.getElementsByTagName('zz_mn_position')[0].firstChild.data;			
			if(menuPosition == menuPositionActualise){			
				menuSpan = document.createElement('span');				
				menuSpan.id = menuCode;
				menuSpan.value = menuPosition;				
				menuSpan.onclick = function() {menu.menuParent(this.value);};				
				menuSpan.style.backgroundColor = 'black';
				menuSpan.style.color = 'white';					
				menuSpan.onmouseover =  function() {this.style.color='silver';};
				menuSpan.onmouseout =  function() {this.style.color='white';};
				menuSpanLibelle = document.createTextNode(menuLibelle + ' <<');
				menuSpan.appendChild(menuSpanLibelle);
				document.getElementById('menuLigne').appendChild(menuSpan);
			}//end if
			if(menuPosition.substr(0,menuPosition.length -1) == menuPositionActualise){	
				menuSpan = document.createElement('span');
				menuSpan.id = menuCode;
				menuSpan.value = menuPosition;				
				if(menu.menuFils(menuPosition)) menuSpan.onclick = function() {menu.menuActualiser(this.value);};				
				menuSpan.onmouseover =  function() {this.style.color='white';};
				menuSpan.onmouseout =  function() {this.style.color='black';};
				menuSpanLibelle = document.createTextNode(menuLibelle);
				menuSpan.appendChild(menuSpanLibelle);
				document.getElementById('menuLigne').appendChild(menuSpan);	
			}//end if
			item = item.nextSibling;
		}//end while
	};//end function	
	
	this.menuEffacer = function(){
		var menuLigne = document.getElementById('menuLigne').firstChild;
		while(menuLigne != null){
			document.getElementById('menuLigne').removeChild(menuLigne);
			menuLigne = document.getElementById('menuLigne').firstChild;
		}//end while
	};//end function	

	this.menuParent = function(menuPositionFils){
		var menuParent = menuPositionFils.substr(0,menuPositionFils.length - 1);
		this.menuActualiser(menuParent);
	};//end function
	
	this.menuFils = function(menuPositionParent){
		var menuFils = false;
		var item = this.menuXml.getElementsByTagName('items')[0].firstChild;
		while(item != null){		
			var menuPosition = item.getElementsByTagName('zz_mn_position')[0].firstChild.data;			
			if(menuPosition.substr(0,menuPosition.length -1) == menuPositionParent){
				menuFils = true;
				break;
			}//end if
			item = item.nextSibling;
		}//end while
		return menuFils;
	};//end function

	this.pageAccueil = function(){
		var variables = new Array();
		variables['var_habilitation_code'] = menu.getVariableSession('habilitation');
		menu.applicationCharger(variables);
	};//end function
	
	this.applicationCharger = function(variables){
//		if(typeof variables['var_page_code'] == 'undefined') variables['var_page_code'] = '';
		var variablesXml = this.ax(this.arrayToXml(variables));
		top.menu.location.href(menu.url + "/menu/afficher?variables=" + variablesXml);
	};//end if	
	
	//Affectation des règles de menu
	this.reglesAffecter = function(){
		var regle = this.reglesXml.firstChild;
		while(regle != null){
			var declencheurs = regle.getElementsByTagName('zz_rg_declencheurs')[0].firstChild.data;
			var objetEvenement = declencheurs.split('.');			
			var objet = objetEvenement[0];
			var evenement = objetEvenement[1];
			if(evenement == 'onclick'){
				if(document.getElementById(objet)){
					var reglesExecuter = "menu.reglesExecuter(top.menu.menu.reglesXml,'" + declencheurs + "','all','all')";
					this.evenementAjouter(objet,evenement,reglesExecuter);
				}//end if
			}//end if
			regle = regle.nextSibling;
		}//end while
	};//end function
	
	this.agilis = function(){
		var variables = new Array();
		variables['var_habilitation_code'] = '';		
		menu.applicationCharger(variables);
	};//end function	
	
	this.developpeur = function(){
		//appui sur la touche F8
		if (event.keyCode == "119"){
			if(menu.getVariableSession('developpeur') == '1'){
				var variables = menu.ax("<var_session_variable></var_session_variable>");
				var url = menu.url + "/session/lire?variables=" + variables;
				w = window.open(url,'menuXml','width=600,height=800,scrollbars=yes,resizable=yes');				
			}//end if
		}//end if
		//appui sur la touche F2
		if (event.keyCode == "113"){
			if(menu.getVariableSession('developpeur') == '1'){			
				var variablesXml = "<var_page_code>pg_dev_accueil</var_page_code>";
				var uri = menu.url + "/page/afficher?variables=" + menu.ax(variablesXml);
				var popup = "top=0,left=0,width=500,height=50,dependent=yes";
				w = window.open(uri,'',popup);				
			}//end if
		}//end if	
	};//end function

}//end class