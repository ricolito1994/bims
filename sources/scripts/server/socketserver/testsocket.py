import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM);
s.bind(("127.0.0.1",50007))
s.listen(5)
while True:
	clientsocket,adr = s.accept();
	print (socket.gethostname())
	clientsocket.send(bytes("aaa","utf-8"))
	#clientsocket.close();
#s.connect ( ("127.0.0.1",20014))

