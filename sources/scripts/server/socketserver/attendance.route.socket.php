<?php

namespace BIMS\SOCKET_ROUTE\ATTENDANCE_SOCKET_ROUTE;


class AttendanceRoute {
	
	public $socket_server;
	public $route_key = "Attendance";
	
	public function __construct( $socket_server ){
		$this->socket_server = $socket_server;
	}
	
	
	public function saveAttendance($response  ,$message_object = null , $buffer = null){
		/*Apply your own logic here*/
		$this->socket_server->send_message($response,$message_object);
	}
	
	public function getAttendance($response){
		/*Apply your own logic here*/
		$this->socket_server->send_message($response);
	}
	
}




?>