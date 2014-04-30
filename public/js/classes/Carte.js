//héritage de la classe Objet
//Carte.prototype = new Objet();

function Carte(){

	this.carteCode = document.getElementById('code').value;
	this.variables = new Array();
	this.carteArray = new Array();
	this.marqueurArray = new Array();

	this.carteActualiser = function(variables){
		this.variables = variables;
		this.carteCharger();
		if(this.carteArray['marqueurs']['item0']) this.carteAfficher();
	};//end function
	
	//Charge les propriétés et marqueurs de la carte
	this.carteCharger = function(){
		this.variables['var_carte_code'] = this.carteCode;
		var carteXml = carte.ajax("carte","charger",this.variables);
		this.carteArray = fileXmlToArray(carteXml);
	};//end function
	
	//Construction de la carte GoogleMaps
	this.carteAfficher = function(){
		
		//Affichage du titre
		if(document.getElementById('titre').hasChildNodes()){
			document.getElementById('titre').removeChild(document.getElementById('titre').firstChild);
		}//end if
		var titre = document.createTextNode(this.carteArray['proprietes']['zz_ca_libelle']);
		document.getElementById('titre').appendChild(titre);

		//Affichage de la légende
		while(document.getElementById('legende').hasChildNodes()){
			document.getElementById('legende').removeChild(document.getElementById('legende').firstChild);
		}//end if
		this.legendeCheckboxAjouter('Tous');
		this.legendeLabelAjouter('Tous');
		for (var icone in this.carteArray['legende']){
			var iconeNom = this.carteArray['legende'][icone];
			this.legendeCheckboxAjouter(iconeNom);
			this.legendeImageAjouter(iconeNom);
			this.legendeLabelAjouter(iconeNom);
		}//end for
		
		//Création de la carte
		var carteOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP};
		var map = new google.maps.Map(document.getElementById('map'),carteOptions);
		//Utilisation de limites dynamiques pour la carte
		var limites = new google.maps.LatLngBounds();
		
		//Création du tableau des marqueurs
		for(var icone in this.carteArray['legende']){
			var iconeNom = this.carteArray['legende'][icone].toLowerCase();
			this.marqueurArray[iconeNom] = new Array();
		}//end for
		
		//Affichage des marqueurs
		for(var marqueur in this.carteArray['marqueurs']){
			var latitude = parseFloat(this.carteArray['marqueurs'][marqueur]['latitude']);
			var longitude = parseFloat(this.carteArray['marqueurs'][marqueur]['longitude']);	
			var position = new google.maps.LatLng(latitude,longitude);
			var titre = this.carteArray['marqueurs'][marqueur]['titre'];
			var iconeNom = this.carteArray['marqueurs'][marqueur]['icone'].toLowerCase();
			var icone = url + '/images/cartes/' + carte.getVariableSession('application_code') + '/' + iconeNom + '.png';
			var marqueurOptions = {
				position: position,
				map: map,
				title: titre,
				icon: icone};
			//Alimentation du tableau des marqueurs
			this.marqueurArray[iconeNom][marqueur] = new google.maps.Marker(marqueurOptions);

			//Extension des limites de la carte au marqueur en cours
			limites.extend(position);
		}//end for
		
		//Ajustement de la carte aux limites dynamiques
		map.fitBounds(limites);
		
	};//end function

	//Ajoute une checkbox à la légende
	this.legendeCheckboxAjouter = function(icone){
		var checkbox = document.createElement('input');
		checkbox.setAttribute('id',icone.toLowerCase());
		checkbox.setAttribute('type','checkbox');
		checkbox.setAttribute('checked',true);
		checkbox.setAttribute('onclick',function() {carte.legendeClic(icone.toLowerCase());});
		document.getElementById('legende').appendChild(checkbox);
		checkbox.checked = true;		
	};//end function
		
	//Ajoute un label à la légende
	this.legendeLabelAjouter = function(icone){	
		var label = document.createTextNode(icone);		
		document.getElementById('legende').appendChild(label);	
	};//end function
	
	//Ajoute une image à la légende
	this.legendeImageAjouter = function(icone){	
		var image = document.createElement('img');	
		var src = document.createAttribute('src');
		src.nodeValue = url + "/images/cartes/" + carte.getVariableSession('application_code') + "/" + icone.toLowerCase() + ".png";		
		image.setAttributeNode(src);
		document.getElementById('legende').appendChild(image);
	};//end function
	
	//Sélection des marqueurs à afficher
	this.legendeClic = function(iconeClic){
		if(iconeClic == 'tous'){
			for(var icone in this.carteArray['legende']){
				var iconeId = this.carteArray['legende'][icone].toLowerCase();
				document.getElementById(iconeId).checked = document.getElementById('tous').checked;
			}//end for
		}//end if
		for(var icone in this.carteArray['legende']){
			var iconeId = this.carteArray['legende'][icone].toLowerCase();
			for(var marqueur in this.marqueurArray[iconeId]){
				this.marqueurArray[iconeId][marqueur].setVisible(document.getElementById(iconeId).checked);
			}//end for
		}//end for
	};//end function
	
}//end classe