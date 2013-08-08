<script type="text/javascript" media="all" src="jquery.js" ></script>
<?php
	$uname=strip_tags($_POST['username']);
	$pw=strip_tags($_POST['password']);
	require_once("/var/www/lib/login_functions.php");
	sec_session_start();
	$login=login($uname,$pw);
if( $login === true)
{
      // Login success

	echo 	"<script type='text/javascript'>
			var response = $.ajax({
  				url: 'auth2.php',
  				username: '$uname',
				password: '$pw',
				async: false
 			}).responseText;

			if(response==true)
			{
				$.ajax({
  				url: '/ProjectDASHBOARD',
  				success:function(){window.location='/ProjectDASHBOARD';},
  				error:function(){window.location='/ProjectMAINPAGE';}
 				});

			}
			else
			{
			window.location='http://'+document.domain+'?status=badcredentials';
			}
			</script>";
}
else
{
      // Login failed
	$url="http://".$_SERVER["SERVER_NAME"]."?status=".$login;
	Header("Location:".$url);
}

?>

