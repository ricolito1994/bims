<?php
/* use SocketServer as SS;
require 'socket_server.php';
$socket_server = new SS\SocketServerPHP('127.0.0.1',2051,true); */
#$socket_server->send ("aaa" , $socket_server->socket)
?>
<!DOCTYPE html>
<html>

<head>


</head>

<script>

		var websocket = new WebSocket("ws://localhost:8090/socketserver/sock.php"); 
		websocket.onopen = function(event) { 
			console.log("WEW");
			//showMessage("<div class='chat-connection-ack'>Connection is established!</div>");		
			websocket.send ( JSON.stringify({
				user : "12",
				room : "BTTHS:hrdo",
				onconnect : true,
			}) );
		}
		websocket.onmessage = function(event) {
			var Data = JSON.parse(event.data);
			//showMessage("<div class='"+Data.message_type+"'>"+Data.message+"</div>");
			//$('#chat-message').val('');
			console.log("FFFF",event);
		};
		
		websocket.onerror = function(event){
			//showMessage("<div class='error'>Problem due to some Error</div>");
		};
		websocket.onclose = function(event){
			//showMessage("<div class='chat-connection-ack'>Connection Closed</div>");
			console.error("socket server closed!");
			websocket.send ( JSON.stringify({
				user : "12",
				room : "BTTHS:hrdo",
				disconnect : true,
			}) );
		}; 
		
		function send (){
			alert("SSS");
			//event.preventDefault();
			console.log('sss');
			//$('#chat-user').attr("type","hidden");		
			var messageJSON = {
				user: 12,
				message_object: { msg : '' },
				room : "BTTHS:hrdo",
				users : ['11'],
				route : 'Attendance:saveAttendance',
			};
			websocket.send(JSON.stringify(messageJSON));
		}
		/* $('#frmChat').on("submit",function(event){
			event.preventDefault();
			$('#chat-user').attr("type","hidden");		
			var messageJSON = {
				chat_user: $('#chat-user').val(),
				chat_message: $('#chat-message').val()
			};
			websocket.send(JSON.stringify(messageJSON));
		}); */
	
</script>

<body>

	<div>
		
			<input type='text' name='reply'/>
			
			<button name='btnsend' onclick='send()' >send</button>
			
			
			
		
	</div>
	
	
	

</body>