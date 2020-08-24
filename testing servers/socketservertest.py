import socketserver

class MyTCPHandler(socketserver.BaseRequestHandler):
       def handle(self):
              #self.request is the TCP socket connect to the client
              while 1:
                     self.data = self.request.recv(500)

                     self.data = self.data
                     print("{} wrote:".format(self.client_address[0]))
                     print(str(self.data))
                     if str(self.data) == "b\'\'":
                            print("Client Disconnected")
                            break

                     #Speed1 = self.data.decode("utf8").split()[0]
                     
                     #print(self.data.decode("utf8").split())
                     #just send back the same data, but upper-case
                     #self.request.sendall(self.data.upper())

        

if __name__ == "__main__":
       HOST, PORT = "0.0.0.0", 8080

#Create the server, binding to localhost on port 9999
server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)

#Activate the server; this will keep running until you interrupt the program (e.g. Ctrl-C)
server.serve_forever()
