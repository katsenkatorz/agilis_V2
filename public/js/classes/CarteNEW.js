/***************************************************************************************************
*****************************To define all option, please go on:************************************
****************************************************************************************************
**********http://code.google.com/intl/fr/apis/maps/documentation/javascript/reference.html**********
****************************************************************************************************
****************************************************************************************************/

/**longitude = x-coordinate
 * latitude  = y-coordinate, 
 * (latitude, longitude)
 * (Y, X)**/

//héritage de la classe Objet
Carte.prototype = new Objet();
var carte;	//declaration de la carte


var bounds;	//limite de la carte en fonciton des marqueurs
var marker = []; //tableau contenant tout les marqueurs
var info = []; //tableau contenant toute les info windows
var nbMarker = [];
var tabCoord=[];
var curentInfoWindows;
CurentInfoWindow = new Array();
stockInfo = new Array();
stockMarker = new Array();
stockMarkersView= new Array ();

/*************************************************************************************/
/*****************************Following code define the map***************************/
/*************************************************************************************/

function InitTab(compteur)
{
	var info = [];
	
		
	for (var a = 0; a <compteur; a++)
	{
		info[a] = new Array();
		marker[a] = new Array();
		nbMarker[a] = 0;
		tabCoord[a]= new Array;
		
	}
	
	
	curentInfoWindows = new google.maps.InfoWindow(
			{
				content: ""
			});
	CurentInfoWindow.push(curentInfoWindows);
	//alert(CurentInfoWindow+'bzzzzzzzzzzzzzzzz');
}

 function CarteInit 	(
					Zoom,
					LatitudeCarte,
					LongitudeCarte,
					MapTypeId
				)
{
	var CenterMap = new google.maps.LatLng(LatitudeCarte, LongitudeCarte);
	var mapType = google.maps.MapTypeId[MapTypeId];
	var options =
		{
			center: 				CenterMap, 		//LatLng(lat:number, lng:number) 		obligatoire
			mapTypeId: 				mapType,			//HYBRID, ROADMAP, SATELLITE, TERRAIN 	obligatoire
			zoom: 					Zoom				//number 								obligatoire
		};
	carte = new google.maps.Map(document.getElementById("map"), options);
	carte.scaleControl = true ;
	bounds = new google.maps.LatLngBounds();
	
	
}

 CarteInit.prototype.addMarker = function 	( Nom,InfoMarker,Image,Latitude,Longitude,i,j,bool,Nb)

 
	{
	 
	// if(Nb!== Nb){ alert(Nb+'NB ya hbal');}
	
	 nbMarker[i] = j;
	 info[i] = new Array(); 
	 info[i][j] = new google.maps.InfoWindow(
		{
		content: "</br> &nbsp"+InfoMarker+"</br> &nbsp"+ "Pour plus d`information cliquer sue ce lien: "+ "<A href=http://www.orange.com/fr_FR/>"+Nom+"</A>" 
	});	

	stockInfo.push(info[i][j]);
	
	
	var optCenterMarker = new google.maps.LatLng(Latitude, Longitude); //latitude et longitude du marqueur 
	bounds.extend(optCenterMarker);
	marker[i]= new Array();
	marker[i][j] = new google.maps.Marker(
	{
		position : 	optCenterMarker,
		title : 	InfoMarker,
		icon : 		Image,
		visible:	bool,
		map : 		carte
	});
	stockMarker.push(marker[i][j]);
	
	tabCoord[i][j]= new Array;
	tabCoord[i][j]=marker[i][j];
	
	
		google.maps.event.addListener(stockMarker[Nb], 'click', function()
			{	
					
					//infowindow.setContent(stockInfo[info]);
			        //infowindow.open(carte, stockMarker[info]);
					stockInfo[Nb].close();
					//curentInfoWindows = stockInfo[info];
					stockInfo[Nb].open(carte, stockMarker[Nb]);
	});
	//carte.fitBounds(bounds);

	
	};// end function CarteInit....


/*************************************************************************************/
/****************************Following code define lines******************************/
/*************************************************************************************/


function boxclick(box, i)
{ 
	
	if (box.checked)
	{
		
		for (var a = 0; a <tabCoord[i].length; a++)//var a = 0; a <= stockMarker.length-1; a++)
		{
			
			tabCoord[i][a].setVisible(true);
			
		}
		
	} 
		else
	{
		for (var a = 0; a < tabCoord[i].length; a++)//(var a = 0; a <= stockMarker.length-1; a++)
		{
			tabCoord[i][a].setVisible(false);
			
		}
	}

};

function AllBoxClick(box)
{
	var monForm = document.getElementById("checkbox");
	
	if (box.checked)
	{
		for (var i = 1; i <= monForm.elements.length; i++)
		{
			monForm.elements[i-1].checked = true;
		}
		setTimeout("this.AllView(1)",1);
	} else
	{
		for (var i = 1; i <= monForm.elements.length; i++)
		{
			monForm.elements[i-1].checked = false;
		}
		setTimeout("this.AllView(0)",1);
	}
};


function AllView(box)
{
	var monForm = document.getElementById("checkbox");
	if (box)
	{
		for (var i = 0; i <= monForm.elements.length-1; i++)
		{
			for (var b = 0; b <= nbMarker[i]; b++)
			{
				tabCoord[i][b].setVisible(true);
			}
		}
	} else
	{
		for (var i = 0; i <= monForm.elements.length-1; i++)
		{
			for (var b = 0; b <= nbMarker[i]; b++)
			{
				tabCoord[i][b].setVisible(false);
			}
		}
	}
};


function Carte(){

this.MarkerType  = Array ();
this.MarkerInfo =Array();
this.CoordConvers = Array();
this.MarkerImage = Array();
this.MarkerLatitude = Array();
this.MarkerLongitude = Array();
this.maCarte;
this.cheked=false;

this.MarkerTypei = Array(); //tableau contenant tout les marqueurs 
//this.test='item0';

this.carteCode = document.getElementById('code').value;
	
this.carteCharger = function()

	{	
		var carteXml = carte.ajax("carte","charger",this.carteCode);
		var carteArray = this.xmlToArray(carteXml);
	
		
	
		InitTab(carteArray['NumEnregistrement']);
			
			this.mapTypeCarte = google.maps.MapTypeId[carteArray['ProprietesCarte']['ZZ_CA_MapTypeId']].toUpperCase();
			this.zoom = parseInt(carteArray['ProprietesCarte']['ZZ_CA_Zoom']);
			this.maCarte = new CarteInit(this.zoom , carteArray['ProprietesCarte']['ZZ_CA_Lattitude'],carteArray['ProprietesCarte']['ZZ_CA_Longitude'],this.mapTypeCarte);
			
	var i=0,j=0,NbEnregist=0;		

	for(var type in carteArray['MarkerType'])
	{
		if (carteArray['MarkerChecked'][type]==1)
		{
			 this.cheked = true;
		}
		else
		{
			(this.checked = false);
		}//end if	
	for(var NbType in carteArray['MarkerType'][type])
	{	
		this.maCarte.addMarker( carteArray['MarkerType'][type][NbType], carteArray['MarkerInfo'][type][NbType],carteArray['MarkerImage'][type],carteArray['MarkerLatitude'][type][NbType],carteArray['MarkerLongitude'][type][NbType],i,j,this.checked,NbEnregist++);				
		j++;			
	}//end for NbType in 	
		i++;j=0;
	
	}//end for type in 	
	};// end function 
}//end classe
