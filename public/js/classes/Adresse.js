//Classe Adresse
function Adresse(){
	
	//Propriétés privées de la classe
	var adresseCode = null;
	var adresseXml = null;
	var EtaEscApp = null;
	var ImmBatRes = null;
	var VoieNumero = null;
	var VoieType = null;
	var VoieLibelle = null;
	var LdBp = null;
	var LocaliteCode = null;
	var LocaliteCodeInsee = null;
	var LocaliteLibelle = null;
	var VerifierButton = null;
	var VerifierCheckbox = null;
	var VerifierSelect = null;
		
	//Constructeur de la classe
	this.adresseInitialiser = function(var_adresse_code){
		setProprietes(var_adresse_code);
		formulaireOnload();
	};//end function

	/*****************************************************************************************************
	 * Methodes publiques de la classe
	 ***************************************************************************************************** 
	 */
	
	//Vérifie et formatte une adresse postale
	this.adresseVerifier = function(){
		if(VoieNumero.value + VoieType.value + VoieLibelle.value == '' || LocaliteCode.value + LocaliteLibelle == ''){
			alert("Veuillez saisir une information sur les lignes : \n\n. Numéro - Type - Voie\n. Code postal - Localité");
		}else{
			var retourCode = adresseEnvoyer();
			//Si adresse validée	
			var validation = -1;
			if(retourCode == "999"){
				var message = "Le serveur ORAS de validation d'adresse n'est pas disponible.\n\n\n";
				message += adresseXml.getElementsByTagName('erreur')[0].firstChild.data;
				alert(message);
			}else{
				if(retourCode == '0'){
					validation = 0;
				}else{
					//si retour d'une liste d'adresses 	
					var retourCodeBinaire = Number(retourCode).toString(2);					
					if(retourCodeBinaire.search(/1$|1.$|1..$/) > -1){
						adresseRetourListe();
					}else{
						//Si adresse modifiée ou non trouvée
						validation = adresseRetourErreur(retourCode);
						

					}//end if
				}//end if
			}//end if
			if(validation > -1) this.adresseValider(validation);			
		}//end if
	};//end function
	
	//Ouvrir la modification de l'adresse
	this.adresseModifier = function(){
		VerifierCheckbox.checked = '';
		adresseVerifierCheckbox();
	};//end function
	
	//Validation d'une adresse postale
	this.adresseValider = function(validation){
		if(validation !== ''){
			var line = new Array();
			var addressLine = adresseXml.getElementsByTagName('AddressLine')[validation].firstChild;
	
			while(addressLine != null){
				var lineNumber = addressLine.getElementsByTagName('lineNumber')[0].firstChild.data;
				var lineValeur = addressLine.getElementsByTagName('line')[0].firstChild.data;
				line[lineNumber] = lineValeur;
				addressLine = addressLine.nextSibling;
			}//end while
			EtaEscApp.value = (line['2'] ? line['2'] : '');
			ImmBatRes.value = (line['3'] ? line['3'] : '');
			VoieNumero.value = (adresseXml.getElementsByTagName('streetNumber')[validation] ? adresseXml.getElementsByTagName('streetNumber')[validation].firstChild.data : '');
			VoieType.value = (adresseXml.getElementsByTagName('streetType')[validation] ? adresseXml.getElementsByTagName('streetType')[validation].firstChild.data : '');	
//			VoieLibelle.value = (adresseXml.getElementsByTagName('streetName')[validation] ? decodeURIComponent(escape(adresseXml.getElementsByTagName('streetName')[validation].firstChild.data)) : '');
			VoieLibelle.value = (adresseXml.getElementsByTagName('streetName')[validation] ? adresseXml.getElementsByTagName('streetName')[validation].firstChild.data : '');
			LdBp.value = (line['5'] ? decodeURIComponent(escape(line['5'])) : '');
			LocaliteCode.value = (adresseXml.getElementsByTagName('postalCode')[validation] ? adresseXml.getElementsByTagName('postalCode')[validation].firstChild.data : '');
			LocaliteCodeInsee.value = (adresseXml.getElementsByTagName('cityCode')[validation] ? adresseXml.getElementsByTagName('cityCode')[validation].firstChild.data : '');
			LocaliteLibelle.value = (adresseXml.getElementsByTagName('cityName')[validation] ? adresseXml.getElementsByTagName('cityName')[validation].firstChild.data : '');
			VerifierCheckbox.checked = 'checked';
			adresseVerifierCheckbox();
		}//end if
	};//end function
	
	/*****************************************************************************************************
	 * Methodes privées de la classe
	 ***************************************************************************************************** 
	 */
	
	function setProprietes(var_adresse_code){
		adresseCode = var_adresse_code; 
		EtaEscApp = eval(adresseCode + 'EtaEscApp_input');
		ImmBatRes = eval(adresseCode + 'ImmBatRes_input');			
		VoieNumero = eval(adresseCode + 'VoieNumero_input');			
		VoieType = eval(adresseCode + 'VoieType_input');
		VoieLibelle = eval(adresseCode + 'VoieLibelle_input');
		LdBp = eval(adresseCode + 'LdBp_input');
		LocaliteCode = eval(adresseCode + 'LocaliteCode_input');		
		LocaliteCodeInsee = eval(adresseCode + 'LocaliteCodeInsee_input');	
		LocaliteLibelle = eval(adresseCode + 'LocaliteLibelle_input');
		VerifierButton = eval(adresseCode + 'Verifier_button');			
		VerifierCheckbox = eval(adresseCode + 'Verifier_checkbox');
		VerifierSelect = eval(adresseCode + 'Verifier_select');		
	};//end function

	function formulaireOnload(){
		//Controles en Lecture seule
		var controlesArray = new Array(VerifierCheckbox.id);		
		formulaire.controlesLectureSeule(controlesArray,true);
		//ControlesObligatoire
		var controlesArray = new Array(VoieNumero.id,LocaliteCode.id);		
		formulaire.controlesObligatoire(controlesArray,true);
		//Verrouillage éventuel des champs d'adresse
		adresseVerifierCheckbox();
	};//end function
	
	function adresseVerifierCheckbox(){
		if(VerifierCheckbox.checked){
			adresseVerrouiller(true);
			VerifierButton.firstChild.data = "Modifier"; 
			VerifierButton.setAttribute('onclick',function(){window[adresseCode].adresseModifier();});			
		}else{
			adresseVerrouiller(false);			
			VerifierButton.firstChild.data = "Vérifier";			
			VerifierButton.setAttribute('onclick',function(){window[adresseCode].adresseVerifier();});
		}//end if
		VerifierButton.style.display = 'block';	
		VerifierSelect.style.display = 'none';
	};//end function
	
	//Verrouillage des champs d'adresse
	function adresseVerrouiller(condition){
		var controlesArray = new Array();
		controlesArray[0] = EtaEscApp.id;
		controlesArray[1] = ImmBatRes.id;
		controlesArray[2] = VoieNumero.id;
		controlesArray[3] = VoieType.id;
		controlesArray[4] = VoieLibelle.id;
		controlesArray[5] = LdBp.id;
		controlesArray[6] = LocaliteCode.id;
		controlesArray[7] = LocaliteCodeInsee.id;
		controlesArray[8] = LocaliteLibelle.id;
		formulaire.controlesLectureSeule(controlesArray,condition);
	};//end function
	
	//Envoi de l'adresse via Ajax
	function adresseEnvoyer(){
		var variables = new Array();			
		variables['var_adresse_ligne2'] = EtaEscApp.value;
		variables['var_adresse_ligne3'] = ImmBatRes.value;			
		variables['var_adresse_ligne4'] = VoieNumero.value + ' ' + VoieType.value + ' ' + VoieLibelle.value;
		variables['var_adresse_ligne5'] = LdBp.value;
		variables['var_adresse_ligne6'] = LocaliteCode.value + ' ' + LocaliteLibelle.value;			
		variables['var_adresse_ligne7'] = LocaliteCodeInsee.value;
		adresseXml = ajax('adresse','verifier',variables);
		var retourCode = adresseXml.getElementsByTagName('originCode')[0].firstChild.data;
		return retourCode;
	};//end function
	
	function adresseRetourListe(){
		var adresseListe = new Array();
		var addressLineArray = adresseXml.getElementsByTagName('AddressLine');
		for(var i = 0 ; i < addressLineArray.length ; i++){
			var voie = '';
			voie += (adresseXml.getElementsByTagName('streetNumber')[i] ? adresseXml.getElementsByTagName('streetNumber')[i].firstChild.data : '');
			voie += ' ' + (adresseXml.getElementsByTagName('streetType')[i] ? adresseXml.getElementsByTagName('streetType')[i].firstChild.data : '');
			voie += ' ' + (adresseXml.getElementsByTagName('streetName')[i] ? adresseXml.getElementsByTagName('streetName')[i].firstChild.data : '');
	        var localite = '';
	        localite += (adresseXml.getElementsByTagName('postalCode')[i] ? adresseXml.getElementsByTagName('postalCode')[i].firstChild.data : '');
	        localite += ' ' + (adresseXml.getElementsByTagName('cityName')[i] ? adresseXml.getElementsByTagName('cityName')[i].firstChild.data : '');
			adresseListe[i] = voie + ' ' + localite;
		}//end for
		VerifierSelect.length = 0;
		VerifierSelect.options[0] = new Option('Choisissez une adresse ci-dessous ...','');
		for(var i = 0 ; i < adresseListe.length ; i++)	VerifierSelect.options[i+1] = new Option(adresseListe[i],i);
		VerifierSelect.setAttribute('onchange',function(){window[adresseCode].adresseValider(this.value);});
		VerifierSelect.style.display = 'block';
		VerifierButton.style.display = 'none';		
	};//end function
	
	function adresseRetourErreur(retourCode){
		var validation = -1;
		switch(retourCode){
		case '16':
			alert("Code postal ou Localité non trouvé.\n\nValidation impossible.");
			LocaliteCode.value = '';
			break;
		case '32':
			var valider = confirm("Voie non trouvée.\n\nFORCER la validation (Déconseillé) ?");
			validation = (valider ? 0 : -1);
			break;
		case '64':
			var valider = confirm("Numéro ou voie non trouvé.\n\nFORCER la validation (Déconseillé) ?");
			validation = (valider ? 0 : -1);
			break;
		case '256':
			var valider = confirm("Le Code Postal trouvé est différent de celui saisi.\n\nVALIDER avec le code postal : " + adresseXml.getElementsByTagName('postalCode')[0].firstChild.data + " ?");
			validation = (valider ? 0 : -1);
			break;
		case '8192':	
			var voie = adresseXml.getElementsByTagName('streetNumber')[0].firstChild.data + ' ' + adresseXml.getElementsByTagName('streetType')[0].firstChild.data + ' ' + adresseXml.getElementsByTagName('streetName')[0].firstChild.data;
	        var localite = adresseXml.getElementsByTagName('postalCode')[0].firstChild.data + ' ' + adresseXml.getElementsByTagName('cityName')[0].firstChild.data;
//			var valider = confirm("L'adresse suivante est proposée :\n\n" + decodeURIComponent(escape(voie)) + "\n" + decodeURIComponent(escape(localite)) + "\n\n" + "VALIDER avec l'adresse ci-dessus ?");
			var valider = confirm("L'adresse suivante est proposée :\n\n" + voie + "\n" + localite + "\n\n" + "VALIDER avec l'adresse ci-dessus ?");
			validation = (valider ? 0 : -1);
			break;
		default:
			alert("Adresse non reconnue.\n\nValidation impossible.");
		}//end switch		
		return validation;
	};//end function
	
};//end classe