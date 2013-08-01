<?php
	$uid = $_SERVER['PHP_AUTH_USER'];
	$dbname = "freenestcore";
	$uname="MYSQL_UNAME";
	$pw="MYSQL_ADMINUSER_PASSWD";

	logAct($uid,$dbname,$uname,$pw);

	echo "ok";

	function logAct($uid, $dbname, $uname, $pw){
		try{
			connect($uname, $pw, $dbname);
		}catch(Exception $exception){
			echo 'error';
			die();
		}
		$username = mysql_query("SELECT id FROM users WHERE name='$uid'");
                $usname = mysql_result($username,0);
                $query = "UPDATE users SET status_id=1 WHERE id=$usname";

        	$query_set = mysql_query($query);
       		if(!$query_set){ //User not found in database, make an entry for them
			echo "not ok";
		}	

	}//END OF logIN()
	
	function connect($uname, $pw, $dbname){
	mysql_connect("localhost", $uname, $pw) or die("error in connecting to DB: ".mysql_error());
	mysql_select_db($dbname) or die("Error in selecting DB: ".mysql_error());
	}//END OF connect()
?>
