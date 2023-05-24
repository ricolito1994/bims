<?php
use SocketServer as SS;
use BIMS\SOCKET_ROUTE\ATTENDANCE_SOCKET_ROUTE AS ASR;

require 'socket_server.php';

# require dirname(dirname(__FILE__)).'/bis/sources/scripts/server/routes/attendance.route.socket.php';

require "../routes/attendance.route.socket.php";

try
{
    $socket_server = new SS\SocketServerPHP ( '127.0.0.1', 8090, false );
    $socket_server -> addCompanyRoom ('BrgyMansilingan');
    $socket_server -> setCompanyRoomApp ('BrgyMansilingan' , 'bims');
    #$socket_server -> setCompanyRoomApp ('BTTHS' , 'studentadmission');
    $socket_server -> addRoute ( new ASR\AttendanceRoute($socket_server) );
    #var_dump(ASR);
    echo "Socket is connected..";
    $socket_server -> listen ();
    
}
catch(\Exception $e){
    
    echo "Disconnected From Server $e";
 
}
?>