<?php

$uid=$_SERVER['PHP_AUTH_USER'];
$pass=$_SERVER['PHP_AUTH_PW'];
$dbname = "freenestcore";
$uname="MYSQL_UNAME";
$pw="MYSQL_ADMINUSER_PASSWD";

require_once("lib/freenest_ldap.php");	
session_start();

$result=logIn($uid,$pass);
if($result == true)
{
	$_SESSION["user"]=1;
	try
	{
			connect($uname, $pw, $dbname);
	}
	catch(Exception $exception)
	{
			echo 'error';
			die();
	}
		$username = mysql_query("SELECT id FROM users WHERE name='$uid'");
                $usname = mysql_result($username,0);
                $query = "UPDATE users SET status_id=1 WHERE id=$usname";

        	$query_set = mysql_query($query);

       	if(!$query_set)//User not found in database, make an entry for them
       	{ 
		$emo =mysql_query("INSERT INTO users (id,name,status_id,last_act,last_used_software) VALUES (NULL , '$uid', 1, CURRENT_TIMESTAMP , '')");
                        if(!$emo){echo "error in adding"; die();}

	}
	echo true;
}


	function logIn($uid,$pass)
	{	
	$ldap = FreeNEST_LDAP::getInstance();
	$ldap->connect();
	$isCorrect = $ldap->is_password_correct($uid, $pass);
	
	$ldap->disconnect();
	
	return $isCorrect;
		
	}
function connect($uname, $pw, $dbname)
{
	mysql_connect("localhost", $uname, $pw) or die("error in connecting to DB: ".mysql_error());
	mysql_select_db($dbname) or die("Error in selecting DB: ".mysql_error());
}//END OF connect()
?>

