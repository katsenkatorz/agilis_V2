//héritage de la classe globale Objet
//Recherche.prototype = new Objet();

//Classe Recherche
function Recherche(){
	
	//Evenements pour les développeurs
	this.evenementClavier = function(){
		//appui sur la touche F8 => Affichage des variables
		if (event.keyCode == "119"){
			if(recherche.session['developpeur'] == '1'){
				recherche.devVariables(recherche.variables);
			}//end if
		}//end if
	};//end function
	
	this.pageAfficher = function(pageCode,formulaireCle){		
		var variables = new Array();
		variables['var_page_code'] = pageCode;
		variables['var_formulaire_cle'] = formulaireCle;
		var variablesXml = arrayToXml(variables);
		uri = url + "/page/afficher?variables=" + ax(variablesXml);
		location.href(uri);
	};//end if
	
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
		setTimeout("recherche.stayTop()", 0);
	};//end function	
	
}//end classe