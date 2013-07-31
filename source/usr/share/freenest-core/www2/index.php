<!doctype html>
<html>
<head>
	<title>FreeNest Login</title>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- 1140px Grid styles for IE -->
	<!--[if lte IE 9]><link rel="stylesheet" href="css/ie.css" type="text/css" media="screen" /><![endif]-->

	<!-- The 1140px Grid - http://cssgrid.net/ -->
	<link rel="stylesheet" href="css/1140.css" type="text/css" media="screen" />
	
	<!-- FreeNEST -->
	<link rel="stylesheet" href="css/styles.css" type="text/css" media="screen" />

	<!--css3-mediaqueries-js - http://code.google.com/p/css3-mediaqueries-js/ - Enables media queries in some unsupported browsers-->
	<script type="text/javascript" src="js/css3-mediaqueries.js"></script>
</head>

<body lang="en">

<div id="top" class="container">
	<div class="row">
		<div id="topleft" class="sevencol">
			<img id="logo" src="images/login_logo_1.png" />
		</div> <!-- #topleft -->
			
		<div id="topright" class="fivecol last">
			<form action="" name="logs" method="post" id="login">
				
				<!-- get server's hostname -->
				<h1>Log in to <?php echo gethostname(); ?></h1>

				<div class="inputwrapper">
					<label for="username">Username</label>
					<input type="text" class="inputfield" name="username" value="" id="username" maxlength="100"/>
				</div> <!-- .inputwrapper -->

				<div class="inputwrapper">
					<label for="password">Password</label>
					<input type="password" class="inputfield" name="password" value="" id="password" maxlength="150"/>
				</div> <!-- .inputwrapper -->

				<input type="submit" value="Log in" class="nestbutton" />
			</form> <!-- #login -->
		</div> <!-- #topright -->
	</div> <!-- #top -->
</div> <!-- .container -->



<div id="bottom" class="container">
	<div class="row">
		<div class="sevencol">
			<!-- reflection of the logo image -->
			<img id="reflection" src="images/login_logo_2.png" />
		</div>
	</div> <!-- #bottom -->
</div> <!-- .container -->


<?php if(isset($_GET['status'])){
	switch(strip_tags($_GET['status'])){
    
        case "badcredentials":
                echo "<div class='info error'>Error, wrong Username/Password! Username is case sensitive!</div>";
        break;

        case "loggedoff":
                echo "<div class='info warning'> You have logged out of the system.<b> Please close the browser to end the session and ensure the security of the system.</b></div>";
        break;

        default:
                echo "<div class='info error'>".strip_tags($_GET["status"])."</div>";
        break;
		}//switch
	
	}
	else{
		 echo "<div class='info'><b>Please Note!</b> The login process will be redirected to a secure connection. You may encounter a message from your browser about an untrusted certificate.</p><p> <span style='text-decoration:underline;'>This is normal</span>. Please accept the certificate and add it to permanent exceptions according to the instructions given by your browser. This is caused because the certificate used to secure the connection is only signed by the server. If you want to read more about this error message, <a href='http://support.mozilla.com/en-US/kb/This+connection+is+untrusted' target='_blank'>click here</a>.</div>";
}
?>
        <noscript>
                <div class='info warning'><b>Please Note!</b> JavaScript must be enabled in order to log in!</div>
        </noscript>


	<script src="js/jquery.min.js"></script>

	<script src="js/chroma-hash.js" type="text/javascript" charset="utf-8"></script>

	<script type="text/javascript" charset="utf-8">
	  $(document).ready(function() {

	  	// freenest login redirect

		$("#login").attr("action","https://"+document.domain+"/auth.php");
		// initialize chroma-hash
    	$("input:password").chromaHash({bars: 3});

    	// set focus on username
    	$("#username").focus();

    });
	</script>

</body>

</html>

