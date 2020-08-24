import socket
import time


#192.168.100.1
HOST, PORT = "192.168.1.21", 9999

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.connect((HOST, PORT))

sock.sendall(bytes("test\n", "utf-8"))

sock.sendall(bytes("test2\n", "utf-8"))

sock.close()
