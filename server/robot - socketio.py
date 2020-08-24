try:
    from functions import *
    #Contains all code to interface with dynamixels.
except:
    from functionsfake import *
    #Functionsfake allows working on the server in a development environment with no dynamixels connected.
    print("Dynamixels not detected")
    
import math
import socketio #pip install python-socketio
from aiohttp import web #pip install aiohttp

robot = {
    "name": "battlebot",
    "front_left_wheel": 3,
    "front_right_wheel": 2,
    "back_left_wheel": 4,
    "back_right_wheel": 1,
}

# robot named "battlebot", wheels are setup using the wheelMode("servo id") function.

# create a Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*")

app = web.Application()
# Binds our Socket.IO server to our Web App Instance
sio.attach(app)

#Version request
@sio.on('version')
async def respond(sid, message):
    print("Version Request. ", "SID: ", sid, "Message: ", message)
    await sio.emit('response', 'bot')

#Generic web request
async def index(request):
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

#Handles handshake
@sio.on('connectr')
async def print_message(sid, message):
    print("Connect Msg. ", "SID: ", sid, "Message: ", message)
    #Tells client to begin sending movement messages
    await sio.emit('connectb', 'connect')

#Server echos incoming message to all those that are connected. Useful for inter client device messenging
@sio.on('echo')
async def respond(sid, message):
    print("Echo Request. ", "SID: ", sid, "Message: ", message)
    await sio.emit('echob', message)

#Handles left wheel movement
@sio.on('commandl')
async def respond(sid, message):
    print("l", -float(message[1])*100)
    moveWheel(robot["front_left_wheel"], -float(message[1])*100)
    moveWheel(robot["back_left_wheel"], -float(message[1])*100)    
    #print("Commandl. ", "SID: ", sid, "Message: ", message)

#Handles right wheel movement
@sio.on('commandr')
async def respond(sid, message):
    print("r", -float(message[1])*100)
    moveWheel(robot["front_right_wheel"], -float(message[1])*100)
    moveWheel(robot["back_right_wheel"], -float(message[1])*100)
            
    #print("Commandr. ", "SID: ", sid, "Message: ", message)

#WIP development for qr code detection.
async def qrSend():
    while True:
        print("background task")
        await sio.sleep(10)
        #Dummy values sent for testing
        await sio.emit('zbar', ["https://google.com", "ccgsrobotics.github.io"])

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

'''
@sio.on('set-name')
def another_event(sid, data):
print(sid, data)
'''