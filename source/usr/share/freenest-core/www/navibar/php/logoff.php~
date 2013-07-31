<?php
	include '/var/www/lib/login_functions.php';
	$uid = $_SERVER['PHP_AUTH_USER'];
	$dbname = "freenestcore";
	$uname="freenest-core";
	$pw="adminuser";
	logOff($uid, $dbname,$uname,$pw);
	
	sec_session_start();
	// Unset all session values
	$_SESSION = array();
	// get session parameters 
	$params = session_get_cookie_params();
	// Delete the actual cookie.
	setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
	// Destroy session
	session_destroy();
	
	$url="http://".$_SERVER["SERVER_NAME"]."?status=loggedoff";
	//header("Location:".$url);
	echo "<script type='text/javascript'>window.location='".$url."'; 
 	if (self.parent.frames.length != 0){
        self.parent.location=document.location.href;
    	}</script>";
?>
