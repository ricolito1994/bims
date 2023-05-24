<?php
require "start.route.server.php";

$data = $_POST['data'];
session_start();
switch ( $data['request'] ){
	
	case "login" :
		foreach ( $data['login_data']['res'] as $k => $v ){
			$_SESSION[ $k ] = $v;
		}
		#print_r ( $_SESSION );
		#header('Location: /studentadmission/');
	break;
	
	case "logout" :
		session_unset();
		session_destroy();
		header("Location: /".APP_NAME."/login");
	break;
	
	case "SWITCH_ACCOUNT":
		
		session_unset();
		//session_destroy();
		
		foreach ( $data['login_data'] as $k => $v ){
			$_SESSION[ $k ] = $v;
		}
		
		//header('Location: /bis/login');
	break;
	
}

?>