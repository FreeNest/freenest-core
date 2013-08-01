<?php


$confLocation = '../conf/';
$resetFileName = 'defaultConf.xml';
$confFileName = 'topbarConfig.xml';


$authUser = $_SERVER['PHP_AUTH_USER'];


if(strtolower($authUser) !== 'adminuser') die('Not logged in as admin user');
if (!copy($confLocation . $resetFileName, $confLocation . $confFileName)) {
    echo "Failed to copy " . $confLocation . $resetFileName . " to " . $confLocation . $confFileName;
}

?>
