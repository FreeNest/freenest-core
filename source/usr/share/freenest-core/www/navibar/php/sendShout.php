<?php
	$uid = $_SERVER['PHP_AUTH_USER'];
	$dbname = "freenestcore";
	$uname="MYSQL_UNAME";
	$pw="MYSQL_ADMINUSER_PASSWD";
	$recipient = $_POST['to'];
	$message = htmlspecialchars($_POST['msg']); 
	$message = mysql_real_escape_string($message);
   
	sendMsg($uid,$dbname,$uname,$pw, $message, $recipient);

	echo "Your shout has been delivered to $recipient (user n#".getLdapUid($recipient)." ).";

	function sendMsg($uid, $dbname, $uname, $pw, $message, $recipient){
		try{
			connect($uname, $pw, $dbname);
		}catch(Exception $exception){
			echo 'error';
			die();
		}
		
		$ldapUid=getLdapUid($recipient);
		
		
		$username = mysql_query("SELECT id FROM users WHERE name='$ldapUid'");
      $recipient_id = mysql_result($username,0);
      
      $username = mysql_query("SELECT id FROM users WHERE name='$uid'");
      $sender_id = mysql_result($username,0);
     // echo "$recipient_id and sender id: $sender_id";
      $query= "INSERT INTO message(uid, message, unread, sender_uid, messageReceived) VALUES($recipient_id,'$message',1, $sender_id, NOW());";
      //$query = "UPDATE users SET status_id=1, last_used_software='$app' WHERE id=$usname";

      $query_set = mysql_query($query);
      
      if(!$query_set){ //User not found in database, make an entry for them
			echo "Message delivery failure! User does not exist";
		}	

	}//END OF logAct()
	
	function connect($uname, $pw, $dbname){
	mysql_connect("localhost", $uname, $pw) or die("error in connecting to DB: ".mysql_error());
	mysql_select_db($dbname) or die("Error in selecting DB: ".mysql_error());
	}//END OF connect()
	
	function getLdapUid($recipient){
		
		$USER_DN = "cn=adminuser,dc=project,dc=nest";
		$PWD = "adminuser";
		$BASE_DN = "ou=ProjectMEMBERS,dc=project,dc=nest";
		$SEARCH_OBJECT="displayname=".$recipient;

		$ldap_handle=ldap_connect("localhost"); //Connect to our host and set LDAP settings
		ldap_set_option($ldap_handle, LDAP_OPT_PROTOCOL_VERSION, 3);
		ldap_set_option($ldap_handle, LDAP_OPT_REFERRALS, 0);

		$bind_result=ldap_bind($ldap_handle,$USER_DN,$PWD); //bind as cn=adminuser
		$search_result=ldap_search($ldap_handle,$BASE_DN,$SEARCH_OBJECT); //search for the user that is logged in
		$result=ldap_get_entries($ldap_handle,$search_result); //get entry

		$DisplayName =$result[0]["uid"][0]; //find out displayname
		#ldap_close($HOST);
		ldap_close($ldap_handle);
		return $DisplayName;
		
	}
?>
