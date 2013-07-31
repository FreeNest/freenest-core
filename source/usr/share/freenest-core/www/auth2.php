<?php

$uid=$_SERVER['PHP_AUTH_USER'];
$pass=$_SERVER['PHP_AUTH_PW'];
$dbname = "freenestcore";
$uname="MYSQL_UNAME";
$pw="MYSQL_ADMINUSER_PASSWD";

require_once("lib/login_functions.php");	
sec_session_start();
if(login($uid,$pass) === true)
{
      // Login success
     
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
else
{
      // Login failed
      echo false;
}
?>

