<?php
require "start.route.server.php";
use server\classes\controller\Profile;

if(isset($_POST['data']))
	$data = $_POST['data'];
else
	$data = $_POST;

$profile = new Profile ( $data );

switch ( $data['request'] ){
	
	case "generic":
		echo json_encode ( $profile->generic_query () );
		break;
	
	case "get_login_auth":
		$profile->read()->getUserAuthProfile();
		break;

	case "get_constant":
		$profile->getConstant($data['values']['constant']);
		break;

	case "get_session_data":
		$profile->getSessionData();
		break;
	
	case "get_ip_address":
		$profile->getIpAddress();
		break;
}


?>