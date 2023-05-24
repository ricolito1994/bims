import socket
import time

import websocket;




s=socket.socket(socket.AF_INET, socket.SOCK_STREAM);
s.connect(("127.0.0.1",8090))

# d="aaa2222"
# s.send(d.encode())
# n = 0
# d="aaa2222"
# s.send(d.encode())
# s.send(d.encode())
# s.send(d.encode())
# s.send(d.encode())
# s.send(d.encode())
# d="aaa2222"
# time.sleep(2)
# s.send(d.encode())
# time.sleep(1)
# s.send(d.encode())
n = 0;
m = "connected!";
s.send(m.encode())

while n < 5:
	#s.bind (("127.0.0.1",8090))
	time.sleep(1)
	d="aaa2222"

	s.send(d.encode())
	print ("send successful \n")
	
	n = n + 1
# while 1:
	# try:
		# d="aaa2222"
		# s.send(d.encode())	
		# time.sleep(1)
	# except:
		# continue
#msg=s.recv(50007)
#print(msg.decode("utf-8"))

# def test():
	# d="aaa2222";
	# s.send(d.encode())
	# time.sleep(1)
	
	
# s = Timer (1.0,test)

# s.start()