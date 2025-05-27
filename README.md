# Traffic-Light
Wireless Bluetooth Traffic Light (1:10 scale) for showing status notifications

![alt text](/docs/.attachments/traffic-light.png)

Visit:
[Web Bluetooth App](/app)

## Operation

When device is plugged in it will automatically assume a standard stop light operating mode which randomly picks a 10-90 second delay before changing.

## States

| State | Name |
| -- | -- |
G | Green
Y | Yellow
R | Red

## Modes

The mode is how the device operates its lights.  Autometical will automatically pick random timings between Green and Red.  Flashing will flash the current light.

| Mode | Name |
| -- | -- | 
O | Off - Lights turned off
A | Automatic - Timings are automatic between 10 and 90 seconds
M | Manual - Light stays fixed on current state
F | Flashing - Light flashes at 1hz
Q | MQTT Integrated - Connected to MQTT server for status updates

# MQTT Operation

The device can automatically connect to a MQTT server to send and receive status updates.

MQTT TOPICS:
* /{device-mac-address}/state - device listens for state changes
* /{device-mac-address}/state/current - device publishes state changes


# Bluetooth Operation

The device automatically broadcasts a bluetooth BLE beacon advertising the core service to any devices licensing.

when connecting to the device it will automatically flash all lights indicating successful connection.

State and Mode are the characteristics that can be sent to the device while state, mode and temperature are sent from the device.

## GATT Profile Details

Device Name: Traffic-Light

The BLE Service ID: 53746172-6c69-6768-7400-100000000000

| Attrib | ID | Read | Write | Notify |
| -- | -- | -- | -- | -- |
State | 53746172-6c69-6768-7400-200000000000 | [X] | [X] | [X]
Mode | 53746172-6c69-6768-7400-200000000001 | [X] | [X] | [X]
Temp | 0x2A26 | [X]

<style>span[class="checked"]{color: green;}</style>
<style>span[class="unchecked"]{color: red;}</style>