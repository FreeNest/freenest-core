<?php
include '/var/www/lib/login_functions.php';
sec_session_start();
if( login_check() !== true)
{
	$url="http://".$_SERVER["SERVER_NAME"];
	header("Location:".$url);
	exit();
}
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>Home - FreeNest Project Platform</title>
		<link rel="stylesheet" href="css/dashboard.css" type="text/css" charset="utf-8"/>
	<!--[if IE 6]>
    <script src="js/iepngfix.js"></script>
    <script>
      DD_belatedPNG.fix('div#logo img, img.icon');
    </script>
  <![endif]-->
</head>

<body>
<!--Nest TopBar-->
<div id="topBar">
<script type="text/javascript" media="all" src="../navibar/js/jquery.js" ></script>
<script type="text/javascript" media="all" src="../navibar/js/topbar.js" ></script>
</div>
  <div id="container">

      <h1 id="authed">Welcome to FreeNest world <?php echo $_SERVER["PHP_AUTH_USER"];?></h1>
        <p>Start by navigaiting from topbar</p>
  </div>
</body>
</html>
