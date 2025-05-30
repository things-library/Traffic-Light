# Busy Signal

## Promotion
Say goodbye to interruptions and hello to seamless communication with BusySignal, the revolutionary 1:10 scale wireless Bluetooth Traffic Light designed to display real-time meeting availability, workspace status, and more.

Whether integrated with Slack, Microsoft Teams, manually set or customized through our developer friendly API and Software Development Kit (SDK), BusySignal transforms the way teams manage focus time and collaboration.

Inspired by innovative workplace tools BusySignal takes efficiency to the next level—turning status management into a visual, effortless experience.

![alt text](/docs/.attachments/traffic-light.png)

Visit:
[Web Bluetooth App](/app)

## Operation

When device is plugged in it will automatically assume a standard stop light operating mode which randomly picks a 10-90 second delay before changing.  The yellow light is the standard delay for a 35mph road in the United States.

### States

| State | Name |
| -- | -- |
G | Green
Y | Yellow
R | Red

### Modes

The mode is how the device operates its lights.  Autometical will automatically pick random timings between Green and Red.  Flashing will flash the current light.

| Mode | Name |
| -- | -- | 
O | Off - Lights turned off
A | Automatic - Timings are automatic between 10 and 90 seconds
M | Manual - Light stays fixed on current state
F | Flashing - Light flashes at 1hz

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
| -- | -- | :--: | :--: | :--: |
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

## Examples: 
```
$801845240|s|m:A|t:26|s:G*17
$801869353|s|m:A|t:23|s:Y*01
$801869357|s|m:A|t:23|s:R*0E
```