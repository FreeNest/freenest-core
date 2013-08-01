<?php
/*
* NEST PROJECT PLATFORM FAVORITES HANDLER
* Copyright JAMK University of Applied Sciences 2010
* Ilkka Turunen, 2010
*
* This script handles the fetching of signed in people information from the local nest database and LDAP.
*
* VARIABLES:
* $uid - The authenticated user's user name
* $mode - determines what action the script performs
* $dbname - Database name
* $uname - DB user name
* $pw - DB Password
* $timezone - Timezone for current server time. Fixes errors with online times.
*
* FUNCTIONS:
* logOffIdle() - Logs off people who have been idle for more than 1h
* getOnline() - Get the # of people online
* connect() - Connect to local mysql db with set credentials
* getNicks() - Get online usernames
* getAct() - Get last act timestamps of online people
* 
*
* @returns JSON array of all the software
* @TODO Generic DB Wrapper 
*/


/*********************************************************************************************************************************************
* VARIABLES 
**********************************************************************************************************************************************/

$dbname = "freenestcore";
$uname="MYSQL_UNAME";
$pw="MYSQL_ADMINUSER_PASSWD";
$mod=strip_tags($_POST['mod']);
$timezone="+3:00";
	
	logOffIdle($uname, $pw, $dbname, $timezone);
	
	switch($mod){
		case "nick":
		getNicks($uname, $pw, $dbname);
		break;

		case "act":
		getAct($uname, $pw, $dbname, $timezone);
		break;

		case "nr":
		getOnline($uname, $pw, $dbname, $timezone);
		break;
	}
	//echo "jou";


/*********************************************************************************************************************************************/
/* FUNCTIONS
**********************************************************************************************************************************************/
function logOffIdle($uname, $pw, $dbname, $timezone){
	try{
		connect($uname, $pw, $dbname);
	}catch(Exception $exception){
		echo 'error';
		die();
	}
	$timezone = mysql_query("SET SESSION time_zone='$timezone'"); //@TODO: variable
	$last_acts = mysql_query("SELECT last_act FROM users WHERE status_id=1");
	
	$dateRows = mysql_num_rows($last_acts);
	$rivit22="";
	$timestampNow=time();
	for($i=0;$i<$dateRows;$i++){
		$rivit2[$i]=mysql_result($last_acts,$i);
		$rivit2[$i]=strtotime($rivit2[$i]);
		$timeago= ago($rivit2[$i],$timestampNow);
		if(strpos($timeago,"minute")||strpos($timeago,"minutes")||strpos($timeago,"second")||strpos($timeago,"seconds")||strpos($timeago,"1 hour")){
			//is in the okay and shall not neet further investigation
		}else{
			 //echo("Idle over 1h at position $i");
			 $names = mysql_query("SELECT name FROM users WHERE status_id=1");
			 $idlePerson = mysql_result($names,$i);
			//echo $idlePerson;
			mysql_query("UPDATE users SET status_id=3 WHERE name='$idlePerson'");
		}
	}
}

function getOnline($uname, $pw, $dbname){
	try{
		connect($uname, $pw, $dbname);
	}catch(Exception $exception){
		echo 'error';
		die();
	}
	$nr = mysql_query("SELECT name FROM users WHERE status_id=1");
	
	echo mysql_num_rows($nr);
}

function getNicks($uname, $pw, $dbname){
	
	try{
		connect($uname, $pw, $dbname);
	}catch(Exception $exception){
		echo 'error';
		die();
	}
	$favSoftIDs = mysql_query("SELECT name FROM users WHERE status_id=1");
	if(!$favSoftIDs){ $rivi.=" Error with the query " ; die('wräygn');}
	
	$rows = mysql_num_rows($favSoftIDs);
	for($i=0;$i<$rows;$i++){
		$rivit[$i]=mysql_result($favSoftIDs,$i);
	}

	
	echo realNamesLDAP($rivit);


	//$rivi.=implode(";",$rivit);
	
	//echo $rivi; 
}

function getAct($uname, $pw, $dbname, $timezone){
	try{
		connect($uname, $pw, $dbname);
	}catch(Exception $exception){
		echo 'error';
		die();
	}
	$timezone = mysql_query("SET SESSION time_zone='$timezone'"); //@TODO: variable
	$last_acts = mysql_query("SELECT last_act FROM users WHERE status_id=1");
	$timeago="";//Fix?
	$dateRows = mysql_num_rows($last_acts);
	$rivit22="";
	$timestampNow=time();
	for($i=0;$i<$dateRows;$i++){
		$rivit2[$i]=mysql_result($last_acts,$i);
		$rivit2[$i]=strtotime($rivit2[$i]);
		$timeago.= ago($rivit2[$i],$timestampNow).";"; /*Fix 18.1.2011 -IT*/
	}
		//not sure what this is but it caused an error so I put it in comments
		//$rokka = $rivit2[1];
		//$rivit22.=" time nyt ".date("m.d.y,H:i:s");
	
	echo $timeago;//.$rivit22;
}

function connect($uname, $pw, $dbname){
	mysql_connect("localhost", $uname, $pw) or die("error in connecting to DB: ".mysql_error());
	mysql_select_db($dbname) or die("Error in selecting DB: ".mysql_error());
}


function realNamesLDAP($usernames){
	
	$USER_DN = "cn=adminuser,dc=project,dc=nest"; /*fix 18.1.2011 -IT*/
	$PWD = "adminuser";
	$BASE_DN = "ou=ProjectMEMBERS,dc=project,dc=nest";
	$SEARCH_OBJECT="uid=";

	
	$DisplayName="";
	$i2=0;
	foreach($usernames as $username){
		//$DisplayName.=$username;	
		$ldap_handle=ldap_connect("localhost"); //Connect to our host and set LDAP settings
		ldap_set_option($ldap_handle, LDAP_OPT_PROTOCOL_VERSION, 3); /*Fix 18.1.2011 -IT was $ds*/
		ldap_set_option($ldap_handle, LDAP_OPT_REFERRALS, 0);
	
		$bind_result=ldap_bind($ldap_handle,$USER_DN,$PWD); //bind as cn=adminuser
		$search_result=ldap_search($ldap_handle,$BASE_DN,$SEARCH_OBJECT.$username); //search for the user that is logged in
		$result=ldap_get_entries($ldap_handle,$search_result); //get entry

		$DisplayName[$i2]=$result[0]["displayname"][0]; //find out displayname
		$i2++;
		ldap_close($ldap_handle);
		#ldap_close("localhost");
	}
	
	//ldap_close($HOST);
	return implode(";",$DisplayName);
	//return $DisplayName;
}

   function ago($datefrom,$dateto=-1)
    {
        // Defaults and assume if 0 is passed in that
        // its an error rather than the epoch
    
        if($datefrom==0) { return "A long time ago"; }
        if($dateto==-1) { $dateto = time(); }
        
        // Make the entered date into Unix timestamp from MySQL datetime field

       
        // Calculate the difference in seconds betweeen
        // the two timestamps

        $difference = $dateto - $datefrom;

        // Based on the interval, determine the
        // number of units between the two dates
        // From this point on, you would be hard
        // pushed telling the difference between
        // this function and DateDiff. If the $datediff
        // returned is 1, be sure to return the singular
        // of the unit, e.g. 'day' rather 'days'
    
        switch(true)
        {
            // If difference is less than 60 seconds,
            // seconds is a good interval of choice
            case(strtotime('-1 min', $dateto) < $datefrom):
                $datediff = $difference;
                $res = ($datediff==1) ? $datediff.' second ago' : $datediff.' seconds ago';
                break;
            // If difference is between 60 seconds and
            // 60 minutes, minutes is a good interval
            case(strtotime('-1 hour', $dateto) < $datefrom):
                $datediff = floor($difference / 60);
                $res = ($datediff==1) ? $datediff.' minute ago' : $datediff.' minutes ago';
                break;
            // If difference is between 1 hour and 24 hours
            // hours is a good interval
            case(strtotime('-1 day', $dateto) < $datefrom):
                $datediff = floor($difference / 60 / 60);
                $res = ($datediff==1) ? $datediff.' hour ago' : $datediff.' hours ago';
                break;
            // If difference is between 1 day and 7 days
            // days is a good interval                
            case(strtotime('-1 week', $dateto) < $datefrom):
                $day_difference = 1;
                while (strtotime('-'.$day_difference.' day', $dateto) >= $datefrom)
                {
                    $day_difference++;
                }
                
                $datediff = $day_difference;
                $res = ($datediff==1) ? 'yesterday' : $datediff.' days ago';
                break;
            // If difference is between 1 week and 30 days
            // weeks is a good interval            
            case(strtotime('-1 month', $dateto) < $datefrom):
                $week_difference = 1;
                while (strtotime('-'.$week_difference.' week', $dateto) >= $datefrom)
                {
                    $week_difference++;
                }
                
                $datediff = $week_difference;
                $res = ($datediff==1) ? 'last week' : $datediff.' weeks ago';
                break;            
            // If difference is between 30 days and 365 days
            // months is a good interval, again, the same thing
            // applies, if the 29th February happens to exist
            // between your 2 dates, the function will return
            // the 'incorrect' value for a day
            case(strtotime('-1 year', $dateto) < $datefrom):
                $months_difference = 1;
                while (strtotime('-'.$months_difference.' month', $dateto) >= $datefrom)
                {
                    $months_difference++;
                }
                
                $datediff = $months_difference;
                $res = ($datediff==1) ? $datediff.' month ago' : $datediff.' months ago';

                break;
            // If difference is greater than or equal to 365
            // days, return year. This will be incorrect if
            // for example, you call the function on the 28th April
            // 2008 passing in 29th April 2007. It will return
            // 1 year ago when in actual fact (yawn!) not quite
            // a year has gone by
            case(strtotime('-1 year', $dateto) >= $datefrom):
                $year_difference = 1;
                while (strtotime('-'.$year_difference.' year', $dateto) >= $datefrom)
                {
                    $year_difference++;
                }
                
                $datediff = $year_difference;
                $res = ($datediff==1) ? $datediff.' year ago' : $datediff.' years ago';
                break;
                
        }
        return $res;
}
?>



