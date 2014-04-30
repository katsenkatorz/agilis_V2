//héritage de la classe globale Objet
//Html.prototype = new Objet();

//Classe Html
function Html(){
	
	//Extension de l'héritage
	herite(this,new Regle());
	
	this.variables = getVariablesDocument();
	this.session = null;
	this.reglesXml = null;

 /*******************************************************************************
 * INITIALISATION
 ******************************************************************************** 
 */
	//Initialiser la page html
	this.htmlInitialiser = function(){
		this.htmlCharger();
		this.htmlRegles();
	};//end function

	//Récupère les règles de la page html
	this.htmlCharger = function(){
		var htmlXml = ajax("html","charger",this.variables);
		var htmlArray = fileXmlToArray(htmlXml);
		//Chargement des règles
		this.reglesXml = htmlXml.getElementsByTagName('regles')[0];
		//Chargement des variables de session
		this.session = htmlArray['session'];
	};//end function

	//Execution des règles lors du chargement
	this.htmlRegles = function(){
		var htmlCode = this.variables['var_html_code'];
		this.reglesExecuter(htmlCode + '.onload','all','all');
	};//end if

 }//end classe