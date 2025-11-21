# Busy Signal

## Promotion
Say goodbye to interruptions and hello to seamless communication with BusySignal, the revolutionary 1:10 scale wireless Bluetooth Traffic Light designed to display real-time meeting availability, workspace status, and more.

Whether integrated with Slack, Microsoft Teams, manually set or customized through our developer friendly API and Software Development Kit (SDK), BusySignal transforms the way teams manage focus time and collaboration.

Inspired by innovative workplace tools BusySignal takes efficiency to the next level—turning status management into a visual, effortless experience.

![alt text](/docs/.attachments/traffic-light.png)

Visit:
[Web Bluetooth App](/app)

## Operation

When device is plugged in it will automatically assume a standard stop light operating mode which randomly picks a 10-90 second delay before changing.  The yellow light is the standard delay for a 35mph road in the United States.  Holding down the top button while the device is powered on will turn on pairing mode and the device will look for another device's advertising beacon.

The order of the states is: G -> Y -> R -> W -> G.  If change warning is not enabled the light will just continue to stay red while in the change warning state instead of the Red + Yellow as seen in the UK.

### States

| State | Name |
| :--: | -- |
G | Green
Y | Yellow
R | Red
W | Change Warning - [UK Style: Red and Amber](https://www.gov.uk/guidance/the-highway-code/light-signals-controlling-traffic)

### Modes

The mode is how the device operates its lights.  Autometical will automatically pick random timings between Green and Red.  Flashing will flash the current light.

| Mode | Name |
| :--: | -- | 
O | Off - Lights turned off
A | Automatic - Timings are automatic between 10 and 90 seconds
M | Manual - Light stays fixed on current state
F | Flashing - Light flashes at 1hz
P | Pairing - Pair with another stoplight and coordinate patterns.

# MQTT Operation

The device can automatically connect to a MQTT server to send and receive status updates.

MQTT TOPICS:
* traffic/{customer-key}/{device-mac-address}/state - device listens for state changes
* traffic/{customer-key}/{device-mac-address}/state/current - device publishes state changes


# Bluetooth Operation

The device automatically broadcasts a bluetooth BLE beacon advertising the core UART service.

When connecting to the device it will automatically flash all lights indicating successful connection.

Telemetry details is streamed over the UART TX characteristic


## GATT Profile Details

Device Name: Traffic-Light

### UART Service 

Standard BLE UART Service ID: 6e400001-b5a3-f393-e0a9-e50e24dcca9e

| Attrib | ID | Write | Read | Notify |
| :--: | -- | :--: | :--: | :--: |
UART RX | 6E400002-B5A3-F393-E0A9-E50E24DCCA9E | [X] | |
UART TX | 6E400003-B5A3-F393-E0A9-E50E24DCCA9E | | [X] | [X]

### Device Information Service

Standard Device Information Service ID: 0000180a-0000-1000-8000-00805f9b34fb

| Attrib | ID |Write | Read | Notify |
| -- | -- | :--: | :--: | :--: |
Make | 0x2a29 | | [X] |
Model | 0x2a24 | | [X] |
Serial | 0x2a25 | | [X] |
Hardware Ver | 0x2a26 | | [X] |
Firmware Ver | 0x2a28 | | [X] |
CPU Temperature | 0x2a1c | | [X] | [X]

# UART Telemetry

The telemetry data that is transmitted from the BLE UART TX attribute is based on the [Things Library Telemetry](https://schema.thingslibrary.io/telemetry) protocol which is based on GPS data over NMEA 0183.   Telemetry sentences can be converted right into Things Library Telemetry Event objects which is a simple but powerful data structure.

### Examples:

Typical boot sequence connected to console:
```
Starting.... Log Level: 3
$22859|l|m:BOOTING...BusySignal v0.1.0|l:info*37
$22864|l|m:Initializing BusySignal...|l:info*05
$22869|l|m:+ Status LED|l:info*7A
$22872|l|m:+ Switch|l:info*1B
$22875|l|m:+ Lights|l:info*03
$22879|l|m:+ LED Segment (c: (0, 255, 0), start: 0, len: 7)|l:info*67
$22885|l|m:+ LED Segment (c: (255, 192, 0), start: 7, len: 7)|l:info*69
$22891|l|m:+ LED Segment (c: (255, 0, 0), start: 14, len: 7)|l:info*54
$22896|l|m:+ Controller|l:info*1F
$22900|l|m:+ BLE Service|l:info*1B
$23128|l|m:Running...|l:info*4C
$23132|l|m:+ Switch IRQ|l:info*7D
$23135|l|m:+ Watchdog (timeout=4.5s)|l:info*3C
$23139|l|m:Loading Settings|l:info*66
$23150|l|m:+ Applying Custom Settings|l:info*03
$23160|l|m:+ Warning Duration: Enabled|l:info*29
$23164|l|m:- Change Warning: False|l:info*2B
$23174|c|g:#007F5C|y:#FFC000|r:#FF0000|w:false|d:3500*39
$23183|l|m:+ Applying Custom Settings|l:info*0D
$23195|s|m:O|x:0|s:G|t:23*18
$23201|l|m:+ Mode: OFF|l:info*50
$23209|s|m:O|x:0|s:G|t:23*1E
$23215|s|m:O|x:-1|s:G|t:23*3F
$23226|s|m:A|x:30290|s:G|t:23*15
$23232|l|m:+ Async Tasks: Starting|l:info*24
$23237|l|m:+ BLE Advertise: Started|l:info*5C
$23245|l|m:+ BLE UART Wait: Started|l:info*0F
$31256|i|fw:1.25.0.|id:e4b323fffeb5|cpu:160000000|ver:0.1.0|n:BusySignal*6D
$53568|s|m:A|x:3500|s:Y|t:24*38
$57099|s|m:A|x:74414|s:R|t:24*08
```


## State Sentences (Send or Receive)

State sentences describe the current state of the device when receiving from the device.  When sending a state sentence to the device it tell the device what the desired state should be.

Note: Sending a empty message of this type to the device will result in a populated sentence in response.

|Tags|Description|
|:--:|--|
m|Mode (O = Off, A = Automatic, M = Manual, F = Flashing, P = Pairing)
t|CPU Temperature (degrees celsius)
s|State (G = Green, Y = Yellow, R = Red, W = Change Warning R+Y)
x|Expires or Delay before state change (how long, in milliseconds, will it be in this state if on Auto)

### Examples: 
```
$801845240|s|m:A|t:26|s:G|x:5440*17
$801869353|s|m:A|t:23|s:Y|x:3500*01
$801869357|s|m:A|t:23|s:R|x:870*0E
```

## Config Sentence (Send or Receive)

Configuration sentences describe the settings of the device such as the the hex colors of each of the lights, if a change warning option is enabled, and yellow/amber light delay duration.

Change Warning is similar to how a UK traffic light will turn on red and amber as a change warning that the light is about to change to green.

Note: Sending a empty message of this type to the device will result in a populated sentence in response.

|Tags|Description|
|:--:|--|
g|Hex code for green bottom light
y|Hex code for yellow/amber middle light
r|Hex code for red top light
d|Change warning light delay (milliseconds)
w|Change warning enabled (0 = disabled, 1 = enabled)


### Examples: 
```
$801845240|c|g:0x00ff00|y:0xffff00|r:0xff0000|d:3500|w:0*17
```

## Log Sentence 

Log sentences are only seen when connected to the console 

|Tags|Description|
|:--:|--|
m|Log Message
l|Level (D = debug, I = info, W = warn, E = error)

### Examples:
```
Starting.... Log Level: 3
$22859|l|m:BOOTING...BusySignal v0.1.0|l:info*37
$22864|l|m:Initializing BusySignal...|l:info*05
$22869|l|m:+ Status LED|l:info*7A
$22872|l|m:+ Switch|l:info*1B
$22875|l|m:+ Lights|l:info*03
$22879|l|m:+ LED Segment (c: (0, 255, 0), start: 0, len: 7)|l:info*67
$22885|l|m:+ LED Segment (c: (255, 192, 0), start: 7, len: 7)|l:info*69
$22891|l|m:+ LED Segment (c: (255, 0, 0), start: 14, len: 7)|l:info*54
$22896|l|m:+ Controller|l:info*1F
$22900|l|m:+ BLE Service|l:info*1B
$23128|l|m:Running...|l:info*4C
$23132|l|m:+ Switch IRQ|l:info*7D
$23135|l|m:+ Watchdog (timeout=4.5s)|l:info*3C
$23139|l|m:Loading Settings|l:info*66
$23150|l|m:+ Applying Custom Settings|l:info*03
```

