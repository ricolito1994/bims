<?php
namespace SocketServer;

class SocketServerPHP {
	
	public $host  ;
	public $bind  ;
	public $socket;
	public $accept;
	public $listen;
	public $socket_clients = [];
	public $socket_routes = [];
	public $socket_rooms_company = [];
	
	public function __construct ( $host , $port ){
		$this -> host = $host ;
		$this -> port = $port;
		$this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		socket_set_option($this->socket , SOL_SOCKET, SO_REUSEADDR, 1);
		socket_bind($this->socket, $this -> host, $this -> port);
		socket_listen($this->socket);
		$this->socket_clients = array($this->socket);
	}

	
	#listens to broadcasts forever
	public function listen ( &$callback = null )  {
		//start endless loop, so that our script doesn't stop
		while (true) {
			//manage multipal connections
			$changed = $this->socket_clients;
			//returns the socket resources in $changed array
			socket_select($changed, $null, $null, 0, 10);

			//check for new socket
			if (in_array($this->socket, $changed)) {
				$socket_new = socket_accept($this->socket); //accpet new socket
				$this->socket_clients[] = $socket_new; //add socket to client array
				#$this->socket_rooms [] = array ();
				#var_dump($this->socket_clients);
				$header = socket_read($socket_new, 1024); //read data sent by the socket
				
				$this -> perform_handshaking($header, $socket_new, $this -> host, $this -> port); //perform websocket handshake
				
				socket_getpeername($socket_new, $ip); //get ip address of connected socket
				//$response = mask(json_encode(array('type' => 'system', 'message' => $ip . ' connected'))); //prepare json data
				//send_message($response); //notify all users about new connection
				//make room for new socket
				$found_socket = array_search($this->socket, $changed);
				unset($changed[$found_socket]);
			}

			//loop through all connected sockets
			foreach ($changed as $changed_socket) {
				#print_r($changed);
				//check for any incomming data
				$bytesocket = @socket_recv($changed_socket, $buf, 1024, 0);
				#print($bytesocket);
				while ($bytesocket >= 1) {
					$received_text = $this->unmask($buf); //unmask data
					$tst_msg = json_decode($received_text); //json decode 
					#echo $received_text."--\n";
					$user_message = $tst_msg; //message text
					$encoded_user_message = json_encode($user_message);
					#print_r(json_encode($user_message));
					#print("\n\n");
					//prepare data to be sent to client
					
					
					$response_text = $this->mask($encoded_user_message);
					var_dump($response_text);
					if ( $user_message !== NULL ){
						if ( !isset($user_message->onconnect) && !isset($user_message->disconnect) ){
							$route_string = explode (':',$user_message->route);
							
							$route =  $this->socket_routes[ $route_string[0] ];
							
							$route -> { $route_string[1] }( $response_text , $user_message );
							
						}
						else if ( isset($user_message->disconnect) ){
							/* remove disconnected client to socket */
							$room = explode ( ':', $user_message->room );	
							$socket_remove = $this->search_array_recursion ( $this->socket_rooms_company , $user_message->user , 1 );
							$found_socket = array_search($socket_remove, $this->socket_clients);	
							/* echo 'arrr --> ';
							var_dump ($this->socket_rooms_company);
							echo "\n\n"; */
							unset ( $this->socket_rooms_company[ $room [0] ][ $room [1] ][  $user_message->user ] );
							unset ( $this->socket_clients[$found_socket] );							
							/* echo "result --> ";
							var_dump ($this->socket_rooms_company); */
							$this->send_message($response_text,$user_message);
							#var_dump($this->socket_clients);
						}
						else{
							/* connect to a room */
							$room = explode ( ':', $user_message->room );
							$socket_client = '';
							foreach($changed as $l){
								$socket_client = $l;
							}
							
							$this->socket_rooms_company[ $room [0] ][ $room [1] ][ $user_message->user ] = $socket_client;
							#print_r($this->socket_rooms_company);
							/* if ( isset($this->socket_rooms_company[ $room [0] ][ $room [1] ][ $user_message->user ]) ){
								$existing_socket = $this->socket_rooms_company[ $room [0] ][ $room [1] ][ $user_message->user ];
								$found_e_socket = $this->search_array_recursion($this->socket_clients,$existing_socket,2) ;
								#@var_dump ( $found_e_socket );
								#echo "\n\n\n";
								try{
									unset($this->socket_clients[$found_e_socket]);
									#var_dump($this->socket_clients);
								}
								catch ( \Exception $e ){
									echo $e;
								}
							}
							var_dump($this->socket_rooms_company); */
							$this->send_message($response_text,$user_message);
							#var_dump($this->socket_clients);
						}
					}
					else{
						# for zk teko attendance only!
						# broadcast to all
						# var_dump( $this->socket_routes[ 'Attendance' ] -> getAllowedTimeUsers() );
						# if (!strpos($response_text,"null"))
						// $attendance_object = (object) array ( 
						// 	"attendance" => $buf,
						// 	"user" => 'zkteko',
						// 	"room" => 'BTTHS:hrdo',
						// 	"users" => $this->socket_routes[ 'Attendance' ] -> getAllowedTimeUsers(),/* hr or admin */
						// );	
						// $this->socket_routes[ 'Attendance' ] -> { 'saveAttendance' }( $this->mask(json_encode($attendance_object)) , $attendance_object );
					}
					
					#$response_text = $this->mask(json_encode($encoded_user_message));
					
					#$this->send_message($response_text); //send data
					break 2; //exist this loop
				}

				$buf = @socket_read($changed_socket, 1024, PHP_NORMAL_READ);
				if ($buf === false) { // check disconnected client
					// remove client for $clients array
					$found_socket = array_search($changed_socket, $this->socket_clients);
					socket_getpeername($changed_socket, $ip);
					unset($this->socket_clients[$found_socket]);
					/* foreach ( $this->socket_rooms_company as $sock_delete ){
						foreach ( $sock_delete as $sock_del ){
							if ( $found_socket === $sock_del )
								$this->socket_rooms_company [$sock_delete]
						}
					}
					*/
					//notify all users about disconnected connection
					//$response = mask(json_encode(array('type' => 'system', 'message' => $ip . ' disconnected')));
					//send_message($response);
				}
			}
		}
		
		$this -> closeSocketConnection();
	}
	
	private function search_array_recursion ( $haystack , $needle , $by_index  ){
		
		foreach ( $haystack as $k => $v ){
			#echo($k.' - '.$needle.' - '.$by_index);
			#echo "\n";	
			if ( $v === $needle && $by_index == 0 ){
				return $needle;
			}
			else if ( $k == $needle && $by_index == 1 ){
				# echo $k.' '.$needle."\n\n";
				# var_dump($haystack [ $needle ]);
				return $haystack [ $needle ];
			}
			else if ( $v == $needle && $by_index == 2 ){
				# echo $k.' '.$needle."\n\n";
				# var_dump($haystack [ $needle ]);
				return $k;
			}
			else{
				if ( is_array ( $v ) ){
					return $this->search_array_recursion( $v , $needle , $by_index );
				}
		
			}	
		}
		return -1;
	}
	

	public function send_message( $msg , $obj = null ) {
		$sockets_to_be_send = [];
		
		if (!is_string($obj)){
			
			
			if ( isset ( $obj -> room ) ){
				
				//var_dump($obj);
				//var_dump($msg);
			
				$room_index = explode ( ':' , $obj -> room );
				
				$search_arr = [];
				
				$socket_users_client = $this->socket_rooms_company;
				
				$crs = 0;
				
				if ( isset ($room_index[1]) ){
					$socket_users_client = $this->socket_rooms_company[ $room_index[0] ][ $room_index[1] ];
				}else{
					$socket_users_client = $this->socket_rooms_company[ $room_index[0] ];
				}
				
				if ( isset ( $obj -> users ) ){
					$search_arr = $obj -> users;
				}
				else{
					foreach ( $socket_users_client as $k => $v ){
						$user_i = explode ( ':' , $k );
						$search_arr[] = $user_i[1];
					}
					$crs = 1;
				}
				#var_dump($socket_users_client);	echo "\n\n";		
				/* foreach ( $search_arr as $users_index ){
				
					
					$sockets_to_be_send[] = $this->search_array_recursion( $socket_users_client , $users_index , 1 , [ ':' , 1 ]);
					
					foreach ($socket_users_client as $k => $v){
						
						$user_i = explode ( ':' , $k );
						
						
						echo $user_i[0]."\n\n"	;
						
					}
					
				} */
				#var_dump($search_arr);
				foreach ( $socket_users_client as $k => $v ){
					$user_i = explode ( ':' , $k );

					$indx = ( $this->search_array_recursion( $search_arr , $user_i[$crs] , 2 ) );
					
					if ( $indx > -1 ){
						if ( $this->search_array_recursion( $sockets_to_be_send , $v , 2 ) == -1 )
							$sockets_to_be_send[] = $v;
					}
					//if ( !array_search ($sockets_to_be_send,$sockets_to_be_send) )
					//$sockets_to_be_send[] = $socket_users_client[$indx];
				}
				#var_dump($sockets_to_be_send);
			}
			else{
				/* send to all */
				$sockets_to_be_send = $this->socket_clients;
			}
		}
		
		foreach ($sockets_to_be_send as $changed_socket) {
			
			@socket_write($changed_socket, $msg, strlen($msg));
		}
		
		$sockets_to_be_sent = [];
		
		
		return true;
		
	}

	//Unmask incoming framed message
	protected function unmask($text) {
		$length = ord($text[1]) & 127;

		if ($length == 126) {
			$masks = substr($text, 4, 4);
			$data = substr($text, 8);
		} elseif ($length == 127) {
			$masks = substr($text, 10, 4);
			$data = substr($text, 14);
		} else {
			$masks = substr($text, 2, 4);
			$data = substr($text, 6);
		}

		$text = "";
		for ($i = 0; $i < strlen($data); ++$i) {	
			$text .= $data[$i] ^ $masks[$i % 4];
		}
		#echo $text .' '.$length." ".$data ."\n";
		return $text;
	}

	private function mask($text) {
		$b1 = 0x80 | (0x1 & 0x0f);
		$length = strlen($text);

		if ($length <= 125)
			$header = pack('CC', $b1, $length);
		elseif ($length > 125 && $length < 65536)
			$header = pack('CCn', $b1, 126, $length);
		elseif ($length >= 65536)
			$header = pack('CCNN', $b1, 127, $length);
			
		#echo($header . $text."\n");
		return $header . $text;
	}
	
	//handshake new client.
	private function perform_handshaking($receved_header, $client_conn, $host, $port) {
		$headers = array();
		$lines = preg_split("/\r\n/", $receved_header);
		foreach ($lines as $line) {
			$line = chop($line);
			if (preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
				$headers[$matches[1]] = $matches[2];
			}
		}
		#var_dump($headers);
		$secKey = isset($headers['Sec-WebSocket-Key']) ? $headers['Sec-WebSocket-Key'] : '';
		$secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
		//hand shaking header
		$upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
				"Upgrade: websocket\r\n" .
				"Connection: Upgrade\r\n" .
				"WebSocket-Origin: $host\r\n" .
				"WebSocket-Location: ws://$host:$port/demo/shout.php\r\n" .
				"Sec-WebSocket-Accept:$secAccept\r\n\r\n";
		socket_write($client_conn, $upgrade, strlen($upgrade));
	}

	/* adds a server route */	
	public function addRoute ( $route_class = null ){
		$this->socket_routes[$route_class->route_key] = $route_class;
	}
	
	/* adds a server company room */	
	public function addCompanyRoom ( $room_name ){
		$this->socket_rooms_company[$room_name] = [];
	}
	
	/* adds a server company room */	
	public function setCompanyRoomApp ( $room_name , $application ){
		$this->socket_rooms_company[ $room_name ][ $application ] = [];
	}
	
	/* close socket connection */
	public function closeSocketConnection ( ){
		socket_close ( $this->socket );
	}
	
}

?>