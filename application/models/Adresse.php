<?php
class Agilis_Model_Adresse{
	private $oras;
	private $variables;	
	
	public function __construct(){
		$this->variables = array();	
	}//end function
	
	public function setAdresse($variables){
		$this->variables = $variables;
		
//  		$this->variables['var_adresse_ligne2']='';
//  		$this->variables['var_adresse_ligne3']='';
// 		$this->variables['var_adresse_ligne4']='52 ramon';
//  		$this->variables['var_adresse_ligne5']='';
// 		$this->variables['var_adresse_ligne6']='49100 angers';

	}//end function
	
	public function verifier(){
		return $this->setOras()->checkAddress();
	}//end function
	
	private function setOras(){
		$wsdl = "http://oras.si.francetelecom.fr:9000/orasws/services/ManageLocation?wsdl";
		// OPTIONS (Identification via IOSW
		$options = array(
		// connexion via IOSW Qualification
// 			"location"     => 'http://iosw3sn-vision-ecm.itn.ftgroup/15T/ManageLocationCustomerDataManagement-2',
// 			"login"         => 'AG2-AG2_SI',
// 			"password"  => 'N!5]bWiB',
		// connexion via IOSW PRODUCTION
			"location"     => 'http://ioswis.itn.ftgroup:80/15T/ManageLocationCustomerDataManagement-2',
			"login"         => 'AG2-AG2_SI',
			"password"  => '.6)qMR5?',				
			"trace"		  => 1,
			"soap_version" => SOAP_1_1,
			"encoding" => "ISO-8859-1"
		);
		
		try {
			$this->oras = new SoapClient($wsdl, $options);
		} catch (Exception $e) {
			exit('KO connexion : ' . $e->getMessage());
		}
		return $this;
	}//end function

	private function checkAddress(){
		$addresLine = array();
		if(!empty($this->variables['var_adresse_ligne2'])){
			$addresLine[] = array(
					'line' => utf8_encode($this->variables['var_adresse_ligne2']),
					'lineNumber' => '2'
			);
		}//end if
		if(!empty($this->variables['var_adresse_ligne3'])){
			$addresLine[] = array(
					'line' => utf8_encode($this->variables['var_adresse_ligne3']),
					'lineNumber' => '3'
			);
		}//end if
		if(!empty($this->variables['var_adresse_ligne4'])){
			$addresLine[] = array(
					'line' => utf8_encode($this->variables['var_adresse_ligne4']),
					'lineNumber' => '4'
			);
		}//end if
		if(!empty($this->variables['var_adresse_ligne5'])){
			$addresLine[] = array(
					'line' => utf8_encode($this->variables['var_adresse_ligne5']),
					'lineNumber' => '5'
			);
		}//end if
		if(!empty($this->variables['var_adresse_ligne6'])){
			$addresLine[] = array(
					'line' => utf8_encode($this->variables['var_adresse_ligne6']),
					'lineNumber' => '6'
			);
		}//end if
			
		$parametres = array(
			'PostalAddress' => array(
				'FormattedPostalAddress' => array(
					'formatType' => 'AFNOR 38',
					'AddressLine' => $addresLine
				)
			),
			'checkCriteriaAddress' => array(
				'checkType' => 'CORRECTING ADDRESS',
				'formattedPostalAddressView' => true,
				'returnGeographicCoordinates' => true,
				'typography' => 'RICH CASE LETTER',
				'maxStreetNameList' => '50',
				'maxCityNameList' => '50',
				'LOCAL_ReturnCedex' => true,
				'LOCAL_WildCardUse' => true,
				'LOCAL_ReturnLocalityGeocoordinate' => true,
				'LOCAL_ReturnDemographicData' => true,
				'LOCAL_SpecialAddress' => false,
				'LOCAL_ReturnRivoli' => false,
				'LOCAL_Interactive' => true,
				'LOCAL_ListResolve' => true,
				'LOCAL_ListDuplicatedStreet' => true
			)
		);

		try {
			$resultat = $this->oras->CheckAddress($parametres);
		} catch (Exception $e) {
// 			var_dump($e); exit();
			$array['originCode'] = '999';
			$array['erreur'] = $e;
			return $array;
		}
		
		//Transforme l'objet resultat en array
		$array = objectToArray($resultat);
		return $array;
	}//end function
	
}//end class