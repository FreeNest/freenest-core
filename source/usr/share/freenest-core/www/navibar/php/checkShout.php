<?php
	$uid = $_SERVER['PHP_AUTH_USER'];
	$dbname = "freenestcore";
	$uname="MYSQL_UNAME";
	$pw="MYSQL_ADMINUSER_PASSWD";
	
	//Checks if we have a shouts waiting to be delivered
	$uneditedMsg = checkMsg($uid,$dbname,$uname,$pw);
	if($uneditedMsg == null){ //No new shouts
	    $uneditedMsg = "";
	} else { //New shouts, echoing it to topbarShout.js

	echo "$uneditedMsg"; 
	}

//Function for shout handling
function checkMsg($uid, $dbname, $uname, $pw) {
	
	try {
		connect($uname, $pw, $dbname);
	}
	catch(Exception $exception){
		echo 'error';
		die();
	}
		
    $username = mysql_query("SELECT id FROM users WHERE name='$uid'");
    $user_id = mysql_result($username,0);
	
   	$query = "SELECT message.id, message.message, message.sender_uid, message.messageReceived, users.name
			FROM message
			JOIN users ON message.sender_uid = users.id
			WHERE message.uid = $user_id AND message.unread = 1
			ORDER BY id
			LIMIT 9";
	$allShouts = mysql_query($query);

	if(mysql_num_rows($allShouts) > 0) {
		$i=0;
		while ( $row = mysql_fetch_array($allShouts) ) {
			$data[] = $row;
			$shout['shout_'.$i]['sender_name'] = $data[$i]['name'];
			$shout['shout_'.$i]['sender_uid'] = $data[$i]['sender_uid'];
			$shout['shout_'.$i]['message_id'] = $data[$i]['id'];
			$shout['shout_'.$i]['message_received'] = $data[$i]['messageReceived'];
			$shout['shout_'.$i]['message'] = $data[$i]['message'];
			++$i;
		}
		return json_encode($shout);
	}
	
	else {
		return null;
	}
}
	
function connect($uname, $pw, $dbname){
	mysql_connect("localhost", $uname, $pw) or die("error in connecting to DB: ".mysql_error());
	mysql_select_db($dbname) or die("Error in selecting DB: ".mysql_error());
	mysql_set_charset('utf8');
}//END OF connect()
?>
