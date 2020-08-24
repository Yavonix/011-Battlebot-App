from simple_websocket_server import WebSocketServer, WebSocket
import math

# The robot is setup as a battlebot, with the wheels in their respective positions.

class RobotServer(WebSocket):
    def handle(self):

        baseSpeed, baseAngle = map(int, self.data.split("|"))

        if baseAngle < 90: # The joystick is to the right of the y-axis
            leftWheelSpeed = baseSpeed
            rightWheelSpeed = int(baseSpeed * abs(math.sin((baseAngle*math.pi)/180)))

        elif baseAngle > 90: # The joystick is to the left of the y-axis
            rightWheelSpeed = baseSpeed
            leftWheelSpeed = int(baseSpeed * abs(math.sin((baseAngle*math.pi)/180)))

        else: # The joystick is along the y-axis.
            rightWheelSpeed = baseSpeed
            leftWheelSpeed = baseSpeed 

            
    def connected(self):
        print('Client', self.address, 'Connected.')

    def handle_close(self):
        print('Client', self.address, 'Closed.')

server = WebSocketServer('', 9999, RobotServer)
server.serve_forever()
