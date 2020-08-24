try:
    from functions import *
except:
    from functionsfake import *
    print("Dynamixels not detected")
    
import math

import socketio #pip install python-socketio
from aiohttp import web #pip install aiohttp
#192.168.100.1

robot = {
    "name": "battlebot",
    "front_left_wheel": 3,
    "front_right_wheel": 2,
    "back_left_wheel": 4,
    "back_right_wheel": 1,
}

# if the robot is named "battlebot", the wheels are setup using the wheelMode("servo id") function.

    

# create a Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*")

app = web.Application()
# Binds our Socket.IO server to our Web App
# instance
sio.attach(app)

@sio.on('version')
async def respond(sid, message):
    print("Version Request. ", "SID: ", sid, "Message: ", message)
    await sio.emit('response', 'bot') #test (chat server, bot (bot server)
    
async def index(request):
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

@sio.on('connectr')
async def print_message(sid, message):
    print("Connect Msg. ", "SID: ", sid, "Message: ", message)

    await sio.emit('connectb', 'connect')

    
@sio.on('echo')
async def respond(sid, message):
    print("Echo Request. ", "SID: ", sid, "Message: ", message)

    await sio.emit('echob', message)

@sio.on('commandl')
async def respond(sid, message):
    print("l", -float(message[1])*100)
    moveWheel(robot["front_left_wheel"], -float(message[1])*100)
    moveWheel(robot["back_left_wheel"], -float(message[1])*100)

            
    #print("Commandl. ", "SID: ", sid, "Message: ", message)

@sio.on('commandr')
async def respond(sid, message):
    print("r", -float(message[1])*100)
    moveWheel(robot["front_right_wheel"], -float(message[1])*100)
    moveWheel(robot["back_right_wheel"], -float(message[1])*100)
            
    #print("Commandr. ", "SID: ", sid, "Message: ", message)


#WIP
'''
@sio.on('js')
async def respond(sid, message):
    
        #print(message)
    #try:
        # The baseSpeed and baseAngle are read from the incoming packet from the websocket client.
        baseSpeed, baseAngle = message

        # 180 - 90  | 0 - 90
        #           |
        #       ----|----
        #           |
        # 270 - 180 | 270 - 360

        
        

            # Moves the four wheels according to the new, calculated speeds.
            moveWheel(robot["front_left_wheel"], leftWheelSpeed)
            moveWheel(robot["back_left_wheel"], leftWheelSpeed)

            moveWheel(robot["front_right_wheel"], rightWheelSpeed)
            moveWheel(robot["back_right_wheel"], rightWheelSpeed)


    #except Exception as e:
    #    print(e)
    #print("JS. ", "SID: ", sid, "Message: ", message)
'''

async def qrSend():
    while True:
        print("background task")
        await sio.sleep(10)
        await sio.emit('zbar', ["https://google.com", "ccgsrobotics.github.io"])
    
    
'''
@sio.on('set-name')
def another_event(sid, data):
    print(sid, data)
    '''


app.router.add_get('/', index)

# We kick off our server
if __name__ == '__main__':
    if robot["name"] == "battlebot":
        wheelMode(robot["front_left_wheel"])
        wheelMode(robot["front_right_wheel"])
        wheelMode(robot["back_left_wheel"])
        wheelMode(robot["back_right_wheel"])

    
    #sio.start_background_task(qrSend)
    
    web.run_app(app, port=9999)



































'''
# The robot is setup as a battlebot, with the wheels in their respective positions.
robot = {
    "name": "battlebot",
    "front_left_wheel": 3,
    "front_right_wheel": 2,
    "back_left_wheel": 4,
    "back_right_wheel": 1,
}

# if the robot is named "battlebot", the wheels are setup using the wheelMode("servo id") function.
if robot["name"] == "battlebot":
    wheelMode(robot["front_left_wheel"])
    wheelMode(robot["front_right_wheel"])
    wheelMode(robot["back_left_wheel"])
    wheelMode(robot["back_right_wheel"])

class RobotServer(WebSocket):
    def handle(self):
        # a try statement is used to prevent a data processing error from crashing the program.
        try:
            # The baseSpeed and baseAngle are read from the incoming packet from the websocket client.
            baseSpeed, baseAngle = map(int, self.data.split("|"))

            if robot["name"] == "battlebot":
                # If the VirtualJoystick is below the y-axis, it changes the speed to a negative, indictaing a backwards direction.
                if baseAngle < 0:
                    baseSpeed = baseSpeed * -1
                    baseAngle = abs(baseAngle)

                # Uses the angle of the joystick to calculate the "true" speeds of the wheels.
                # math.sin(baseAngle) is used to calculate the speed of the slower wheel.

                if baseAngle < 90: # The joystick is to the right of the y-axis
                    leftWheelSpeed = baseSpeed
                    rightWheelSpeed = int(baseSpeed * abs(math.sin((baseAngle*math.pi)/180)))

                elif baseAngle > 90: # The joystick is to the left of the y-axis
                    rightWheelSpeed = baseSpeed
                    leftWheelSpeed = int(baseSpeed * abs(math.sin((baseAngle*math.pi)/180)))

                else: # The joystick is along the y-axis.
                    rightWheelSpeed = baseSpeed
                    leftWheelSpeed = baseSpeed 

                # Since the servos are set to spin the same direction, the left wheels are set to spin backwards to maintain the 
                # direction of the robot, as the servos on one side are flipped.
                rightWheelSpeed *= -1

                # Moves the four wheels according to the new, calculated speeds.
                moveWheel(robot["front_left_wheel"], leftWheelSpeed)
                moveWheel(robot["back_left_wheel"], leftWheelSpeed)

                moveWheel(robot["front_right_wheel"], rightWheelSpeed)
                moveWheel(robot["back_right_wheel"], rightWheelSpeed)

                # Print() statement added for debugging purposes. Comment print statement when not debugging, since it will 
                # significantly decrease performance, making the operation of the robot rather difficult. 
                # print(leftWheelSpeed, rightWheelSpeed)
            
        # Except statement will print out the error, preventing the program from crashing 
        # whilst still providing infomation for debuggings purposes.
        except Exception as e:
            print(e)

    # The following two functions (connected(self) & handle_close(self)) are used to indicate the connections of clients to the websocket.
    def connected(self):
        print('Client', self.address, 'Connected.')

    def handle_close(self):
        print('Client', self.address, 'Closed.')

# The websocket server is setup on port 9999 on the default address, in this case "192.168.100.1"
server = WebSocketServer('', 9999, RobotServer)
server.serve_forever()'''
