<?php

class FreeNEST_LDAP
{
    // LDAP variables
    private $ldaphost, 
            $ldapport,
            $ldaprdn,
            $ldappassw,
            $ldapconn,
            $ldapou;

    private $encryption = 'MD5',
            $blowfish_iterations = '10',
            $activeou = 'ProjectMEMBERS',
            $disabledou = 'DisabledMEMBERS';


    private function __construct()
    {
        $this->ldaphost = "localhost";
        $this->ldapport = 389;
        $this->ldaprdn = "cn=adminuser,dc=project,dc=nest"; #HARDCODED 
        $this->ldappassw = "adminuser"; #HARDCODED
        $this->ldapconn = null;
        $this->ldapou = array($this->activeou, $this->disabledou);
    }

    private function dn($attr = '')
    {
        $attr = array($attr);
        if (strpos($attr[0], 'ou=') === FALSE)
                $attr[] = 'ou='.$this->activeou;
        $attr[] = 'dc=project,dc=nest';
        return implode(',', $attr);
    }

    public static function getInstance()
    {
        static $instance;
        if (!is_object($instance)) $instance = new FreeNEST_LDAP();
        return $instance;
    }

    public function connect()
    {
        $this->ldapconn = ldap_connect($this->ldaphost, $this->ldapport) or die ("LDAP error: Could not connect to $this->ldaphost");
        @ldap_set_option($this->ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        return $this->ldapconn && ldap_bind($this->ldapconn, $this->ldaprdn, $this->ldappassw);
    }

    public function disconnect()
    {
        ldap_close($this->ldapconn);
    }


    private function crypt_password($password, $salt)
    {
        if ($salt == '') return $password;
        return '{crypt}' . crypt($password, $salt);
    }

    private function random_string($length)
    {
        $salt = '';
        $chars = './0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charcount = strlen($chars) - 1;
        for ($i=0; $i < $length; $i++)
        {
                $salt .= $chars[mt_rand(0, $charcount)];
        }
        return $salt;
    }

    private function generate_salt($stype)
    {
        if ($stype == 'MD5')      return '$1$' . $this->random_string(8) . '$';
        if ($stype == 'BLOWFISH') return '$2a$' . $this->blowfish_iterations . '$' .
                                                  $this->random_string(21) . '.';
        if ($stype == 'DES')      return $this->random_string(2);
        return '';
    }

    public function change_password($uid, $password)
    {
        $user = $this->get_user($uid);
        if ($user == null) return false;

        $salt = $this->generate_salt($this->encryption);
        $modify['userPassword'] = $this->crypt_password($password, $salt);
        return ldap_modify($this->ldapconn, $this->user_dn($uid), $modify);
    }

    private function get_crypt_type($salt)
    {
        $p = split('}', $salt);
        if (strtolower($p[0]) != '{crypt')
                return '';

        $s = substr($p[1], 0, 3);
        if ($s == '$1$') return 'MD5';
        if ($s == '$2a') return 'BLOWFISH';

        return 'DES';
    }

    private function get_salt($password)
    {
        $type = $this->get_crypt_type($password);
        if ($type == '') return '';

        $p = split('}', $password);
        if ($type == 'DES') return substr($p[1], 0, 2);
        if ($type == 'MD5') return substr($p[1], 0, 12);
        if ($type == 'BLOWFISH') return substr($p[1], 0, 29);
        return '';
    }

    public function is_password_correct($uid, $password)
    {
        $user = $this->get_user_attributes($uid);
        $disablesUsers=$this->get_disabled_users();
	//check for user erros
        if ($user == null)
        {
            $error= 'User not found!';
            return $error;

        }
	else if(in_array(array($user['cn'][0], $user['displayName'][0], $user['mail'][0]),$disablesUsers))
	{
		$error= 'User is disabled!';
            	return $error;

	}
	else if(strcmp($user["cn"][0],$uid) !== 0)
	{
		$error= 'Username did not match, username is case sensitive!';
		return $error;

	}
	else{
//check passwords
		$old = $user['userPassword'][0];
		$type = $this->get_crypt_type($old);
		if ($type == '')
		{
		    $cpass = $password;
		}
		else
		{
		        $salt = $this->get_salt($old);
		    $cpass = $this->crypt_password($password, $salt);
		}
	
		if(ldap_compare($this->ldapconn, $this->user_dn($uid), 'userPassword', $cpass) == true)
		{
	
			return true;
		}
		else
		{	
			$error="Wrong password!";
			 return $error; 
		}
	}
    }

    public function is_admin($uid)
    {
       if($uid =="AdminUser")
	{
		return true;	
	}
	else return false;
    }

    public function modify_user_from_json($json)
    {
        // hash password
        if (array_key_exists("userpassword", $json)) {
            $salt = $this->generate_salt($this->encryption);
            $json["userpassword"] = $this->crypt_password($json['userpassword'], $salt);
        }

        // add to ldap
        $cn = $this->user_dn($json['cn']);
        return ldap_modify($this->ldapconn, $cn, $json);
    }

    public function add_user_from_json($json)
    {
        $data["cn"] = "NestUser";
        $data["gidnumber"] = rand(1000, 65535);
        $data["homedirectory"] = "/home/testiuser/";
        $data["homephone"] = "+3580000000";
        $data["initials"] = "T U";
        $data["l"] = "Finland";
        $data["loginshell"] = "/bin/bash";
        $data["mobile"] = "+3580000000";
        $data["o"] = "Example";
        $data["objectclass"][0] = "inetOrgPerson";
        $data["objectclass"][1] = "posixAccount";
        $data["objectclass"][2] = "shadowAccount";
        $data["postalcode"] = 31000;
        $data["shadowexpire"] = -1;
        $data["shadowflag"] = 0;
        $data["shadowlastchange"] = 10877;
        $data["shadowmax"] = 99999;
        $data["shadowmin"] = 8;
        $data["shadowwarning"] = 7;
        $data["title"] = "Nest User";

        $data["gecos"] = $data["cn"];
        $data["givenname"] = "Nest"; 
        $data["sn"] = "User"; // surname
        $data["uid"] = $data["cn"];
        $data["mail"] = "user@nest.com";
        $data["uidnumber"] = rand(1000, 65535);

        // merge defaults with input
        $json = array_change_key_case($json, CASE_LOWER);
        $data = array_merge($data, $json);

        // create display name if necessary
        if (!array_key_exists("displayname", $data)) {
            $data["displayname"] = $data["givenname"] . $data["sn"];
        }

        // set default password
        if (!array_key_exists("userpassword", $data)) {
            $data["userpassword"] = $data["givenname"] . $data["sn"];
        }

        // hash password
        $salt = $this->generate_salt($this->encryption);
        $data["userpassword"] = $this->crypt_password($data['userpassword'], $salt);

        // add to ldap
        $cn = $this->user_dn($data['cn']);
        return ldap_add($this->ldapconn, $cn, $data);
    }

    public function add_user($cn, $gn, $sn, $email, $pwd)
    {
        $data["cn"] = $cn;
        $data["displayname"] = "$gn $sn";
        $data["gecos"] = $cn;
        $data["gidnumber"] = rand(1000, 65535);
        $data["givenname"] = $gn;
        $data["homedirectory"] = "/home/testiuser/";
        $data["homephone"] = "+3580000000";
        $data["initials"] = "T U";
        $data["l"] = "Finland";
        $data["loginshell"] = "/bin/bash";
        $data["mail"] = $email;
        $data["mobile"] = "+3580000000";
        $data["o"] = "Example";
        $data["objectclass"][0] = "inetOrgPerson";
        $data["objectclass"][1] = "posixAccount";
        $data["objectclass"][2] = "shadowAccount";
        $data["postalcode"] = 31000;
        $data["shadowexpire"] = -1;
        $data["shadowflag"] = 0;
        $data["shadowlastchange"] = 10877;
        $data["shadowmax"] = 99999;
        $data["shadowmin"] = 8;
        $data["shadowwarning"] = 7;
        $data["sn"] = $sn;
        $data["title"] = "Nest User";
        $data["uid"] = $cn;
        $data["uidnumber"] = rand(1000, 65535);

        $salt = $this->generate_salt($this->encryption);
        $data["userPassword"] = $this->crypt_password($pwd, $salt);
        return ldap_add($this->ldapconn, $this->user_dn($cn), $data);
    }

    public function modify_user($uid, $details)
    {
        return ldap_modify($this->ldapconn, $this->user_dn($uid), $details);
    }

    public function get_user_attributes($uid)
    {
        return ldap_get_attributes($this->ldapconn, $this->get_user($uid));
    }


    public function set_user_details($cn, $gn, $sn, $email, $phone, $mobile, $title)
    {
        $data["displayname"] = "$gn $sn";
        $data["gecos"] = $cn;
        $data["givenname"] = $gn;
        $data["homephone"] = $phone;
        $data["mail"] = $email;
        $data["mobile"] = $mobile;
        $data["sn"] = $sn;
        $data["title"] = $title;
        return $this->modify_user($cn, $data);
    }

    public function get_user_details($uid)
    {
        $user = $this->get_user($uid);
        if ($user == null)
        {
            return null;
        }

        $attribs = ldap_get_attributes($this->ldapconn, $user);
        $values = $attribs["givenName"][0] . "," .
                  $attribs["sn"][0] . "," .
                  $attribs["title"][0] . "," .
                  $attribs["homePhone"][0] . "," .
                  $attribs["mobile"][0] . "," .
                  $attribs["mail"][0];
        return $values;
    }

        private function search($dn, $attr)
        {
            $ldapsearch = ldap_search($this->ldapconn, $dn, $attr);
            if ($ldapsearch === false || ldap_count_entries($this->ldapconn, $ldapsearch) == 0)
                return null;

            $ret = array();
            $entry = ldap_first_entry($this->ldapconn, $ldapsearch);
            while ($entry)
            {
                $ret[] = $entry;
                $entry = ldap_next_entry($this->ldapconn, $entry);
            }

            return $ret;
        }


    public function get_user($uid)
    {
        foreach($this->ldapou as $ou)
        {
            $user = $this->search($this->dn('ou='.$ou), 'uid='.$uid);
            if (count($user) > 0)
                return $user[0];
        }

        return null;
    }

    public function get_userdn($uid)
    {
        foreach($this->ldapou as $ou)
        {
            $user = $this->search($this->dn('ou='.$ou), 'uid='.$uid);
            if (count($user) > 0)
                return 'uid='.$uid.',ou='.$ou.',dc=project,dc=nest';
        }       
        return null;
    }

    private function user_dn($uid)
    {
        return $this->dn('uid='.$uid);
    }

    private function get_users($ou)
    {
        $entries = $this->search($this->dn('ou='.$ou), 'uid=*');

		$users = array();
		for ($i = 0; $i < count($entries); $i++)
		{
			$user = ldap_get_attributes($this->ldapconn, $entries[$i]);
			$users[] = array($user['cn'][0], $user['displayName'][0], $user['mail'][0]);
		}

        return $users;
    }

    public function get_active_users()
    {
        return $this->get_users($this->activeou);
    }

    public function get_disabled_users()
    {
        return $this->get_users($this->disabledou);
    }

    private function set_user_ou($uid, $ou)
    {
        $user = $this->get_user($uid);

        if ($user == null)
            return false;

        return ldap_rename($this->ldapconn, ldap_get_dn($this->ldapconn, $user),
            'uid=' . $uid, $this->dn('ou=' . $ou), true);
    }

    public function disable_usr($uid)
    {
        return $this->set_user_ou($uid, $this->disabledou);
    }

    public function enable_usr($uid)
    {
        return $this->set_user_ou($uid, $this->activeou);
    }

    public function remove_user($dn) {
        return ldap_delete($this->ldapconn, $dn);
    }

    public function get_user_attributes_array() {
        $data = $this->get_user_attributes("AdminUser");
        for($i = 0; $i < $data["count"]; $i++) {
            $attributes[] = strtolower($data[$i]);
        }
        return $attributes;
    }
}


?>

