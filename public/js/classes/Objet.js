//Classe globale à l'ensemble des objets
function Objet(){

	//Variables globales à Agilis
	this.url = "//" + location.host + "/agilis_V2/public";
	
	this.couleurP0 = "#FF6600";	//orange
	this.couleurP1 = "#FFE0B2";	//orange clair
	this.couleurS0 = "#000000";	//noir
	this.couleurS1 = "#A9A9A9";	//gris foncé
	this.couleurS2 = "#D3D3D3"; //gris clair
	this.couleurS3 = "#FFFFFF";	//blanc

	//Appel d'un controleur PHP avec retour d'un fichier XML à la fonction appelante
	this.ajax = function(controleur,action,variables) {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		xhr.open("POST",this.url + "/" + controleur + "/" + action,false);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
/*	
w = window.open();
w.document.write(this.url + "/" + controleur + "/" + action + '?variables=' +this.ax(this.arrayToXml(variables)));
w.document.write("</br></br>");
w.document.write(this.arrayToXml(variables));
*/
		xhr.send('variables=' + this.ax(this.arrayToXml(variables)));
		while(xhr.readyState != 4 || ! xhr.responseXML) setTimeout('',100); 
		return(xhr.responseXML);
	};//end function

	//Appel d'un contrôleur par Post
	this.post = function(controleur,action,variables) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
		xhr.open("POST",this.url + "/" + controleur + "/" + action,false);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send('variables=' + this.ax(variables));
	};//end function
	
	//Attente de la fin du chargement de tous les cadres de la page puis exécution d'une fonction
	this.apresChargementExecuter = function(fonctionExecuter){
		intervalChargement = window.setInterval(function() {
			var windowReady = true;
			for(var i=0; i < parent.frames.length ; i++){ 
				if(parent.frames[i].document.readyState != "complete"){
					windowReady = false;
				}//end if
			}//end for
			if(windowReady){
			     window.clearInterval(intervalChargement);
			     eval(fonctionExecuter);				
			}//end if
		;}, 250);
	};//end function

	//Récupère les variables du document en cours
	this.getVariablesDocument = function(){
		var elementsVariable = document.getElementsByTagName('variable');
		var variables = new Array();
		for(var i = 0 ; i < elementsVariable.length ; i++){
			variables[elementsVariable[i].id] = elementsVariable[i].value;
		}//end for
		return variables;
	};//end function
	
	this.getVariableSession = function(variableNom){
		return this.session[variableNom];
	};//end function
	
	
	//Affiche les variables de session
	this.sessionAfficher = function(){
		var message = '';
		for(variable in formulaire.session){
			message += variable + ' = ' + formulaire.session[variable] + '\n';
		}//end for
		alert(message);
	};//end if	
	
	//Affiche les variables de l'objet (réservée développeurs)
	this.devVariables = function(variables){
		w = window.open('','variables','width=400,height=400,scrollbars=yes,resizable=yes');
		w.document.write('<table style="text-align: left; width: 100%;" border="1" cellpadding="2" cellspacing="2" >');
		w.document.write('<tr style="background-color:black;color:white"><td>Variables</td><td>Valeur</td></tr>');				
		for(var variable in variables){
			w.document.write('<tr>');
			w.document.write('<td>' + variable + '</td>');
			w.document.write('<td>' + variables[variable] + '</td>');
			w.document.write('<tr>');					
		}//end for
		w.document.write('</table>');
	};//end function		
	
	//héritage de la classe Parent vers la classe Fille
	this.herite = function(classeFille,classeParent){
		for(var methode in classeParent) classeFille[methode] = classeParent[methode];
	};//end function	

	//transforme un fichier XML en tableau
	this.fileXmlToArray = function(objetXml){
		var arrayNode = new Array();
		var node = objetXml.getElementsByTagName("data")[0];
		arrayResultat = this.nodeToArray(node,arrayNode);
		return arrayResultat;
	};//end function

	//transforme un fichier XML en tableau - fonction récursive de construction du tableau	
	this.nodeToArray = function(node,arrayNode){
		node = (node.firstChild == null ? null : node.firstChild);
		while(node != null){
			if(node.nodeType == 4){
				return node.nodeValue;
			}else{
				var nodeName = node.nodeName.toLowerCase();
				arrayNode[nodeName] = new Array();
				arrayNode[nodeName] = this.nodeToArray(node,arrayNode[nodeName]);				
			}//end if
			node = node.nextSibling;
		}//end while
		return arrayNode;
	};//end function
	
	//Convertit une liste XML en tableau (ex de liste Xml : <M1>val1</M1><M2>val2</M2>)
	this.xmlToArray = function(listeXml){
		var listeArray = new Array;
		while(listeXml.length > 0){
			var debutTagOuvert = listeXml.indexOf("<");
			var finTagOuvert = listeXml.indexOf(">");
			var nomTag = listeXml.substr(debutTagOuvert+1,finTagOuvert-debutTagOuvert-1);
			var debutTagClose = listeXml.indexOf("</"+nomTag+">");
			var valeurTag = listeXml.substr(finTagOuvert+1,debutTagClose-finTagOuvert-1);
			listeArray[nomTag] = valeurTag;
			listeXml = listeXml.substr(debutTagClose + nomTag.length + 3);
		}//end while
		return listeArray;
	};//end function

	//Convertit un tableau sous la forme d'une liste XML (ex de liste Xml : <M1>val1</M1><M2>val2</M2>)
	this.arrayToXml = function(listeArray){
		var listeXml = '';
		for(variableNom in listeArray){
			variableValeur = listeArray[variableNom];
			listeXml += "<" + variableNom + ">" + variableValeur + "</" + variableNom + ">";
		}//end for
		return listeXml;
	};//end function

	//Evalue les conditions javascript entre crochets
	this.evaluerCrochets = function(chaine){
		var newChaine = "";
		while(chaine.length > 0){
			crochetOuvrant = chaine.indexOf("[[");
			if(crochetOuvrant > -1){
				newChaine += chaine.substring(0,crochetOuvrant);				
				crochetFermant = chaine.indexOf("]]");
				condition = chaine.substring(crochetOuvrant + 2,crochetFermant);
				valeur = eval(condition);
				newChaine += valeur;
				chaine = chaine.substring(crochetFermant + 2);
			}else{
				newChaine += chaine;
				chaine = "";
			}//end if
		}//end while
		return newChaine;
	};//end function 	

	//Ajoute un attribut évènement à un élément HTML
	this.evenementAjouter = function(elementId,evenementNom,evenementAction){
		var getEvenement = String(eval("document.getElementById('" + elementId + "')." + evenementNom));
		var evenement = (getEvenement ? evenementAction : getEvenement.substring(getEvenement.indexOf('{')+1,getEvenement.indexOf('}')) + ';' + evenementAction);
		var setEvenement = "document.getElementById('" + elementId + "')." + evenementNom + " = function(){" + evenement + ";}";
		eval(setEvenement);
//alert(eval("document.getElementById('" + elementId + "')." + evenementNom))	;	
	};//end function	
	
	//Supprime une entrée d'un tableau
	this.unset = function(inputArray, index){
		var outputArray = new Array();
		for(var i in inputArray){
			if(i != index) outputArray[i]=inputArray[i];
		}//end for
		return outputArray;
	};//end function
	
/************************************************************************************
 * FORMATS
 ************************************************************************************
 */	
	
	//Vérifier le format d'une donnée 
	this.formatVerifier = function(controleElement,format,option,blanc){
		var controleValeur = controleElement.value;
		var valeurSansFormat = '';
		if (controleValeur != "") {
			var erreur = false;
			if(format != 'date') valeurSansFormat = this.formatSupprimer(controleValeur,format,option);
			switch(format){	
				case "pourcentage":	if(isNaN(valeurSansFormat)) erreur = "un pourcentage"; break;
				case "euros": if(isNaN(valeurSansFormat)) erreur = "un montant"; break;
				case "nombre": if(isNaN(valeurSansFormat)) erreur = "un nombre"; break;	
				case "telephone": if(isNaN(valeurSansFormat)) erreur = "un numéro de téléphone"; break;
				case "regexp":
					condition = new RegExp(option);
					if(! condition.test(controleValeur)) erreur = "";	
					break;
				case "date": 
					//Détection de l'option saisie pour la date				
					var optionSaisie = '';
					if(/^\D{3,9}\s+\d{2,4}/.test(controleValeur)) optionSaisie = 'moisAnnee';
					if(/^\d{1,2}\s+\D{3,9}\s+\d{2,4}/.test(controleValeur)) optionSaisie = 'jourMoisAnnee';	
					if(/^\D{5,8}\s+\d{1,2}\s+\D{3,9}\s+\d{2,4}/.test(controleValeur)) optionSaisie = 'complet';					
					if(/^(\d{1,2})\D+(\d{1,2})\D+(\d{2,4})\s+(\d{2})\D+(\d{2})\D+(\d{2})/.test(controleValeur)){
						optionSaisie = 'dateHeure';
						var jour = (RegExp.$1.length == 1 ? '0'+ RegExp.$1 :RegExp.$1);
						var mois = (RegExp.$2.length == 1 ? '0'+ RegExp.$2 :RegExp.$2);					
						var annee = (RegExp.$3.length == 2 ? '20'+ RegExp.$3 :RegExp.$3);
						controleValeur = jour + "/" + mois + "/" + annee + " " + RegExp.$4 + ":" + RegExp.$5 + ":" + RegExp.$6;
					}//end if
					if(/^(\d{1,2})\D+(\d{1,2})\D+(\d{1,4})$/.test(controleValeur)){
						optionSaisie = '';
						var jour = (RegExp.$1.length == 1 ? '0'+ RegExp.$1 :RegExp.$1);
						var mois = (RegExp.$2.length == 1 ? '0'+ RegExp.$2 :RegExp.$2);	
						var annee = RegExp.$3;
						switch(RegExp.$3.length){
							case 1: annee = '200'+ RegExp.$3;break;
							case 2: annee = '20'+ RegExp.$3;break;
						}//end switch
						controleValeur = jour + "/" + mois + "/" + annee;
					}//end if
					valeurSansFormat = this.formatSupprimer(controleValeur,format,optionSaisie);
					if(! this.isDate(valeurSansFormat)) erreur = "une date";
					break;
			}//end switch
			if (erreur !== false) {
				controleElement.value = '';
				window.focus();controleElement.focus();controleElement.select();
				alert("La valeur '" + controleValeur + "' n'est pas " + erreur + " valide");
			}else{
				if(format != 'regexp'){
					controleElement.value = this.formatAppliquer(valeurSansFormat,format,option,blanc);
				}//end if
			}//end if
		}//end if
	};//end function

	//Appliquer le format à une donnée
	this.formatAppliquer = function(valeur,format,option,blanc){
		var resultat = '';
		valeur = valeur.toString();
		if (valeur == null || valeur == "") {
			resultat = "";
		}else{
			switch (format) {
				case "date":
					var dateUs = new Date(valeur.substr(5,2) + "-" + valeur.substr(8,2) + "-" + valeur.substr(0,4));
					var listeMois = new Array("janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre");
					switch (option) {
						case "complet":
							var listeJours = new Array("dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi");
							resultat = listeJours[dateUs.getDay()] + " " + dateUs.getDate() + " " + listeMois[Number(valeur.substr(5,2))-1] + " " + valeur.substr(0,4);
							break;
						case "jourMoisAnnee":
							resultat = dateUs.getDate() + " " + listeMois[Number(valeur.substr(5,2))-1] + " " + valeur.substr(0,4);
							break;
						case "moisAnnee":
							resultat = listeMois[Number(valeur.substr(5,2))-1] + " " + valeur.substr(0,4);
							break;
						case "dateHeure":
							resultat = valeur.substr(8,2) + "/" + valeur.substr(5,2) + "/" + valeur.substr(0,4) + valeur.substring(10);
							break;
						default:
							resultat = valeur.substr(8,2) + "/" + valeur.substr(5,2) + "/" + valeur.substr(0,4);
							if (resultat == "00/00/0000") resultat = "";
							break;
					}//end switch
					break;
				case "pourcentage":
				case "euros":
				case "nombre":
					if (format == "pourcentage"){valeur = String(100 * Number(valeur));};
					positionVirgule = (valeur.indexOf(".") > -1) ? valeur.indexOf("."):valeur.length ;
					var decimales = 2;					
					if (typeof option == 'undefined' || option == '') {
						if (format == "nombre") {
							decimales = valeur.length - positionVirgule -1;
						}else{
							valeur = String(Number(valeur)+ (0.005));	
						}//end if
					}else{
						decimales = Math.abs(Number(option));
						if(option.substr(0,1) != "-") valeur = String(Number(valeur)+ (5/Math.pow(10,decimales+1)));
					}//end if
					for (var i = 0 ; i <= positionVirgule + decimales ; i++) {
						if (i == positionVirgule) {
							if (decimales > 0) {resultat += ",";};
						}else{
							if (i % 3 == positionVirgule % 3 && i < positionVirgule && resultat != '') {resultat += " ";};
							if (i <= positionVirgule + decimales) {
								if (i < valeur.length) {resultat += valeur.charAt(i);} else {resultat += "0";};
							}//end if
						}//end if
					}//end for
					if ((resultat == '0' || resultat == '0,0' || resultat == '0,00') && blanc != ''){
						resultat = "";
					}else{
						if (format == "euros"){resultat += " €";};
						if (format == "pourcentage"){resultat += " %";};
					}//end if
					break;
				case "telephone":
					resultat = valeur.substr(0,2) + " " + valeur.substr(2,2) + " " + valeur.substr(4,2)+ " " + valeur.substr(6,2)+ " " + valeur.substr(8,2);				
					break;
				case "regexp":
					var regexp = new RegExp(option);
					resultat = valeur.match(regexp);
					break;
				default: 
					resultat = valeur;
			}//end switch
		}//end if
		return resultat;
	};//end function

	//Supprimer le format d'une donnée
	this.formatSupprimer = function(valeur,format,option){
		var resultat = '';
		if (valeur == "") {
			resultat = "";
		}else{
			switch (format)	{
				case "date":
					var listeMois = new Array();
					listeMois["janvier"]="01";listeMois["février"]="02";listeMois["mars"]="03";listeMois["avril"]="04";listeMois["mai"]="05";listeMois["juin"]="06";listeMois["juillet"]="07";listeMois["août"]="08";listeMois["septembre"]="09";listeMois["octobre"]="10";listeMois["novembre"]="11";listeMois["décembre"]="12";
					switch(option){	
						case "complet":
							var valeurArray = valeur.split(' ');
							var jour = (valeurArray[1].length == 2 ? valeurArray[1] : '0'+ valeurArray[1]);
							var mois = listeMois[valeurArray[2]];
							var annee = valeurArray[3];
							resultat = '' + annee + '-' + mois + '-' + jour;
							break;
						case "jourMoisAnnee":
							var valeurArray = valeur.split(' ');
							var jour = (valeurArray[0].length == 2 ? valeurArray[0] : '0'+ valeurArray[0]);
							var mois = listeMois[valeurArray[1]];
							var annee = valeurArray[2];
							resultat = '' + annee + '-' + mois + '-' + jour;						
							break;
						case "moisAnnee":
							var valeurArray = valeur.split(' ');
							var mois = listeMois[valeurArray[0]];
							var annee = valeurArray[1];
							resultat = '' + annee + '-' + mois + '-01';
							break;
						case "dateHeure":
							var dateHeureArray = valeur.split(' ');
							var dateArray = dateHeureArray[0].split('/');
							var jour = dateArray[0];
							var mois = dateArray[1];
							var annee = dateArray[2];
							var heure = dateHeureArray[1];
							resultat = '' + annee + '-' + mois + '-' + jour + ' ' + heure;	
							break;
						default:
							var valeurArray = valeur.split('/');
							var jour = valeurArray[0];
							var mois = valeurArray[1];
							var annee = valeurArray[2];
							resultat = '' + annee + '-' + mois + '-' + jour;
							break;				
					}//end switch	
					break;
				case "pourcentage":
				case "euros":
				case "nombre":
					resultat = valeur;
					resultat = resultat.replace(/ /g,"");
					resultat = resultat.replace(/,/,".");
					resultat = resultat.replace(/€/,"");
					resultat = resultat.replace(/%/,"");
					resultat = Number(resultat);
					if (format == "pourcentage") resultat = resultat/100;
					break;
				case "telephone":
					/(\d{2})\D*(\d{2})\D*(\d{2})\D*(\d{2})\D*(\d{2})/.test(valeur);
					resultat = RegExp.$1 + RegExp.$2 + RegExp.$3 + RegExp.$4 + RegExp.$5;
					break;
				case "regexp":
				default: resultat = valeur.replace(/"/g,"\''");
			}//end switch
		}//end if
		return resultat;
	};//end function

	//Vérifie la validité d'une date (format : aaaa-mm-jj hh:mm:ss)
	this.isDate = function(dateIn) {
		if(dateIn.length < 11) dateIn += ' 00:00:00';
		var vDate = new Date(Number(dateIn.substr(0,4)),Number(dateIn.substr(5,2))-1,Number(dateIn.substr(8,2)),Number(dateIn.substr(11,2)),Number(dateIn.substr(14,2)),Number(dateIn.substr(17,2)));
		jour = String(vDate.getDate());
		if (jour.length == 1) jour = "0" + jour;
		mois = String(vDate.getMonth()+1);
		if (mois.length == 1) mois = "0" + mois;
		annee = String(vDate.getFullYear());
		heure = String(vDate.getHours());
		if (heure.length == 1) heure = "0" + heure;	
		minute = String(vDate.getMinutes());
		if (minute.length == 1) minute = "0" + minute;	
		seconde = String(vDate.getSeconds());
		if (seconde.length == 1) seconde = "0" + seconde;
		dateOut = annee + "-" + mois + "-" + jour + " " + heure + ":" + minute + ":" + seconde;
	 	return(dateIn == dateOut);
	};//end function

	//Retourne la date du jour +/- nombre de jours au format américain
    this.dateJour = function(nombreJour){
          if(typeof nombreJour == 'undefined'){
                 var nombreJour = 0;
                 }//end if
          d = new Date();
          d.setTime(d.getTime() + nombreJour * (24 * 3600 * 1000));
          var jour = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
          var mois = (d.getMonth()+1 <10 ? '0' + (d.getMonth()+1) : d.getMonth()+1);
          var annee = d.getFullYear();
          var dateJour = annee + '-' + mois + '-' + jour;
          return dateJour;
    };//end function    
    
    //Retourne la date du jour et l'heure au format JJ/MM/AAAA | HH:MM:SS
    this.dateJourHeure = function(){
          d = new Date();
          var jour = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
          var mois = (d.getMonth()+1 <10 ? '0' + (d.getMonth()+1) : d.getMonth()+1);
          var annee = d.getFullYear();
          var heure = d.getHours();
          var minute = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
          var seconde = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
          var dateJourHeure = jour + '/' + mois + '/' + annee + ' | ' + heure + ':' + minute + ':' + seconde;
          return dateJourHeure;
    };//end function    
	

	//Retourne le jour ouvrable +/- delta 
	this.jourOuvrable = function(valeur,delta){
		var sens = (delta < 0 ? -1 : 1);
		var dateInput = new Date(valeur.substr(3,2) + "-" + valeur.substr(0,2) + "-" + valeur.substr(6,4));
		dateInput.setDate(dateInput.getDate() + delta);
		
		var jour = String(dateInput.getDate());
		if (jour.length == 1) jour = "0" + jour;
		var mois = String(dateInput.getMonth()+1);
		if (mois.length == 1) mois = "0" + mois;
		var annee = String(dateInput.getFullYear());
		dateOutput = jour + '-' + mois + '-' + annee;
		
		//Jours fériés de 2013 à 2020
		var jourFerie = "";
		jourFerie += "01-01-2013,01-04-2013,01-05-2013,08-05-2013,09-05-2013,20-05-2013,14-07-2013,15-08-2013,01-11-2013,11-11-2013,25-12-2013,"; 
		jourFerie += "01-01-2014,21-04-2014,01-05-2014,08-05-2014,29-05-2014,09-06-2014,14-07-2014,15-08-2014,01-11-2014,11-11-2014,25-12-2014,";  
		jourFerie += "01-01-2015,06-04-2015,01-05-2015,08-05-2015,14-05-2015,25-05-2015,14-07-2015,15-08-2015,01-11-2015,11-11-2015,25-12-2015,";  
		jourFerie += "01-01-2016,28-03-2016,01-05-2016,08-05-2016,08-05-2016,16-05-2016,14-07-2016,15-08-2016,01-11-2016,11-11-2016,25-12-2016,";  
		jourFerie += "01-01-2017,17-04-2017,01-05-2017,08-05-2017,25-05-2017,05-06-2017,14-07-2017,15-08-2017,01-11-2017,11-11-2017,25-12-2017,";  
		jourFerie += "01-01-2018,02-04-2018,01-05-2018,08-05-2018,10-05-2018,21-05-2018,14-07-2018,15-08-2018,01-11-2018,11-11-2018,25-12-2018,";  
		jourFerie += "01-01-2019,22-04-2019,01-05-2019,08-05-2019,30-05-2019,10-06-2019,14-07-2019,15-08-2019,01-11-2019,11-11-2019,25-12-2019,";  
		jourFerie += "01-01-2020,13-04-2020,01-05-2020,08-05-2020,21-05-2020,01-06-2020,14-07-2020,15-08-2020,01-11-2020,11-11-2020,25-12-2020";  
		//Décalage si samedi, dimanche ou jour férié
		nJour = dateInput.getDay();
		switch(nJour){
			case 0 : //dimanche
				this.jourOuvrable(dateOutput,2 * sens);
				break;
			case 6 : //samedi
				this.jourOuvrable(dateOutput,1 * sens);
				break;
		 }//end switch
		if (jourFerie.indexOf(dateOutput) > '-1') this.jourOuvrable(dateOutput,1 * sens);

		dateReturn = dateOutput.substr(6,4) + '-' + dateOutput.substr(3,2) + '-' + dateOutput.substr(0,2);
		
		return (dateReturn);
	};//end function

	this.ax = function(a){
		var b = String(1+Math.floor(Math.random()*9))+String(1+Math.floor(Math.random()*9))+String(1+Math.floor(Math.random()*9));
		var k = 0;
		var h = "";
		for(var i = 0 ; i < a.length ; i++){
			d = a.charCodeAt(i);
			h += (Number(d) < 16 ? '0' : '');			
			h += d.toString(16);
			k += Number(d);
		}//end for
		k = String(k).substr(0,3);
		h += k;
		i = 0; j = 0 ;
		var t = new Array();
		while(h != ''){
			r = h.substr(0,b.substr(i,1));
			s = r.split('');
			s.reverse();
			t[j++] = s.join('');
			h = h.substr(b.substr(i,1),h.length);
			i = (i + 1) % 3;
		}//end while
		var x = '';
		for(var j = 0 ; j < t.length ; j+=3){
			x += (t[j+2] ? t[j+2] :'');
			x += (t[j+1] ? t[j+1] :'');
			x += t[j];
		}//end for	
		x = b + x;	
		return x;
	};//end function	
	
}//end classe