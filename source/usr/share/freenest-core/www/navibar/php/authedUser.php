<?php
/*
* NEST PROJECT PLATFORM TOP BAR SCRIPTS
* Finds out and returns who's currently http-authed
*
* Mostly adapted from php.net examples
*/
include '/var/www/lib/login_functions.php';
sec_session_start();
if(isset($_POST["logged_in"]))
{
	
	echo login_check();

}
else if(isset($_SESSION["login_string"]))
{	
	$HOST = $_POST['host'];
	$USER_DN = "cn=adminuser,dc=project,dc=nest";
	$PWD = "adminuser";
	$BASE_DN = "ou=ProjectMEMBERS,dc=project,dc=nest";
	$SEARCH_OBJECT="uid=".$_SERVER['PHP_AUTH_USER'];
	$ldap_handle=ldap_connect("localhost"); //Connect to our host and set LDAP settings
	ldap_set_option($ldap_handle, LDAP_OPT_PROTOCOL_VERSION, 3);
	ldap_set_option($ldap_handle, LDAP_OPT_REFERRALS, 0);

	$bind_result=ldap_bind($ldap_handle,$USER_DN,$PWD); //bind as cn=adminuser
	$search_result=ldap_search($ldap_handle,$BASE_DN,$SEARCH_OBJECT); //search for the user that is logged in
	$result=ldap_get_entries($ldap_handle,$search_result); //get entry

	$DisplayName =$result[0]["displayname"][0]; //find out displayname
	#ldap_close($HOST);
	ldap_close($ldap_handle);
	echo htmlspecialchars($DisplayName);
//	echo "Spede Pasanen";
//	echo $_SERVER['PHP_AUTH_USER'];
}

?>
