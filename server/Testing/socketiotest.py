import socketio #pip install python-socketio
from aiohttp import web #pip install aiohttp
#192.168.100.1

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
    print("Commandl. ", "SID: ", sid, "Message: ", message)

@sio.on('commandr')
async def respond(sid, message):
    print("Commandr. ", "SID: ", sid, "Message: ", message)

@sio.on('js')
async def respond(sid, message):
    print("JS. ", "SID: ", sid, "Message: ", message)

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
    #sio.start_background_task(qrSend)
    
    web.run_app(app)
