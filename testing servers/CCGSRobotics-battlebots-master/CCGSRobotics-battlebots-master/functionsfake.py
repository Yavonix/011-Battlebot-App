def jointMode(ID):
        print("JointModeEvent")

# Move a dynamixel that has been set up as a joint.
def moveJoint(ID, position, speed):
        print("MoveJointEvent")

# === WHEEL FUNCTIONS === #

# Set up a dynamixel so that it behaves like wheel.
def wheelMode(ID):
        pass
        #print("WheelModeEvent")

# Move a dynamixel that has been set up as a wheel.
def moveWheel(ID, speed):
        pass
        #print("WheelSpeedEvent")
