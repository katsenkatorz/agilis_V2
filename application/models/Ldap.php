<?php
class Agilis_Model_Ldap {
	private $variables;
	private $connexion;
	
	public function __construct() {
		$this->connexion = null;
	}//end function

	public function setLdap($variables){
		$this->variables = $variables;
		self::setConnexion();
	}//end function	
	
	public function getLdapIndividu() {
		$ldapIdentifiant = $this->variables['var_ldap_identifiant'];
		$ldapIndividu = null;
		$requeteIndividu = self::requeteIndividu($ldapIdentifiant);
		if($requeteIndividu["count"] > 0) $ldapIndividu = self::ldapResultat($requeteIndividu);
		return $ldapIndividu;
	}//end function	
	
	private function setConnexion() {
		//Connexion
		$this->connexion = ldap_connect("one-directory-ldap.com.ftgroup", 30002) or die("Impossible de se connecter au serveur LDAP");
		// Authentification
		$identification  = "uid=MMMM3230,ou=accounts,dc=intrannuaire,dc=francetelecom,dc=fr";
		$motDePasse = ">69tUb=S";
		$authentification = ldap_bind($this->connexion,$identification,$motDePasse) or die("Authentification impossible");
	}//end function
	
	private function requeteIndividu($identifiant) {
		$base = "ou=France Telecom,ou=people,dc=intrannuaire,dc=francetelecom,dc=fr";
		$attributs = array(
			"uid",
			"sn",
			"givenname",
			"ftcivility",
			"ftactivitiescode",
			"title",
			"ftadmouindex",
			"postaladdress",
			"ftphysicalsite",
			"telephonenumber",
			"mobile",
			"facsimiletelephonenumber",
			"mail",
			"manager");
		$filtre = "(uid=".$identifiant.")";
		$resultat = ldap_search($this->connexion, $base, $filtre, $attributs);
		$requeteIndividu = ldap_get_entries($this->connexion, $resultat);
		return $requeteIndividu;
	}//end function
	
	private function ldapResultat($entrees) {
		$ldapResultat["identifiant"] = $entrees[0]['uid'][0];
		$ldapResultat["nom"] = utf8_decode($entrees[0]['sn;normalize'][0]);
		$ldapResultat["prenom"] = utf8_decode($entrees[0]['givenname'][0]);
		$ldapResultat["civilite"] = $entrees[0]['ftcivility'][0];
		$ldapResultat["activite"] = utf8_decode($entrees[0]['ftactivitiescode'][0]);						
		$ldapResultat["titre"] = utf8_decode($entrees[0]['title'][0]);		
		$ldapResultat["organisation"] = $entrees[0]['ftadmouindex'][0];		
		$ldapResultat["adresse"] = utf8_decode($entrees[0]['postaladdress'][0]);		
		$ldapResultat["site"] = substr($entrees[0]["ftphysicalsite"][0],9,10);
		$ldapResultat["telephone"] = $entrees[0]['telephonenumber'][0];
		$ldapResultat["mobile"] = $entrees[0]['mobile'][0];		
		$ldapResultat["mail"] = $entrees[0]['mail'][0];
		$ldapResultat["manager"] = substr($entrees[0]["manager"][0],4,8);
		return $ldapResultat;		
	}//end function
	
}//end class