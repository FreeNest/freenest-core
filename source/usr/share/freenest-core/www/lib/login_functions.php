<?php
require_once("freenest_ldap.php");	
function sec_session_start()
{
        $session_name = 'login'; // Set a custom session name
        $secure = true; // Set to true if using https.
        $httponly = true; // This stops javascript being able to access the session id. 
 
        ini_set('session.use_only_cookies', 1); // Forces sessions to only use cookies. 
        $cookieParams = session_get_cookie_params(); // Gets current cookies params.
        session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly); 
        session_name($session_name); // Sets the session name to the one set above.
        session_start(); // Start the php session
        session_regenerate_id(true); // regenerated the session, delete the old one.     
}
	
function login($uid, $password) 
{
  
   	$ldap = FreeNEST_LDAP::getInstance();
	$ldap->connect();
	$isCorrect = $ldap->is_password_correct($uid, $password);
	$user = $ldap->get_user_attributes($uid);
	$ldap->disconnect();

	if($isCorrect === true && $user != null)
	{
		$password=$user['userPassword'][0];
		$password = hash('sha512', $password); // hash the password 
   		$user_browser = $_SERVER['HTTP_USER_AGENT']; // Get the user-agent string of the user.
		$_SESSION['uid'] = $uid;
               	$_SESSION['login_string'] = hash('sha512', $password.$user_browser);
               	// Login successful.
               	return true;    
	}
	else return $isCorrect;
      
   
}
function login_check()
{
   // Check if all session variables are set
	if(isset($_SESSION['login_string']))
	{
		$login_string = $_SESSION['login_string'];
		$uid = $_SESSION['uid'];
		$ldap = FreeNEST_LDAP::getInstance();
		$ldap->connect();
		$user = $ldap->get_user_attributes($uid);
		$ldap->disconnect();
		if ($user == null)
			{
				echo 'User not found. ';
				
				return false;
			}
		
		$password=$user['userPassword'][0];
		$password = hash('sha512', $password); // hash the password
			$user_browser = $_SERVER['HTTP_USER_AGENT']; // Get the user-agent string of the user.
		$login_check = hash('sha512', $password.$user_browser);
			if($login_check == $login_string)
			{
				  // Logged In!!!!
				  return true;
			}
			else
			{
				  // Not logged in
				  return false;
			}
	} 
	else
	{
				// Not logged in
				return false;
	  
	}
}
function logOff($uid, $dbname, $uname, $pw)
{
		try{
			connect($uname, $pw, $dbname);
			//echo "connect successful";
		}catch(Exception $exception){
			echo 'errors';
			die();
		}
		$username = mysql_query("SELECT id FROM users WHERE name='$uid'");
                $usname = mysql_result($username,0);
                $query = mysql_query("UPDATE users SET status_id=3 WHERE id=$usname"); 

        	

}
function connect($uname, $pw, $dbname)
{
	mysql_connect("localhost", $uname, $pw) or die("error in connecting to DB: ".mysql_error());
	mysql_select_db($dbname) or die("Error in selecting DB: ".mysql_error());
}
?>

