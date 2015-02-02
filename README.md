# 吊兰

[![Build Status](https://travis-ci.org/phodal/diaonan.svg?branch=master)](https://travis-ci.org/phodal/diaonan)

在线Demo: [http://mqtt.phodal.com](http://mqtt.phodal.com)

``吊兰``是一个在线的物联网测试平台，你可以用他来测试你的物联网设备。网页上创建一个节点，然后你就可以用MQTT,REST,CoAP来测试你的硬件代码。REST示例如下所示:

##安装

1.安装redis

    sudo apt-get install redis-server

or 

    sudo yum install redis-server

2.安装依赖    

    sudo npm install

3.Server

    node diaonan.js    

##简介 

REST示例如下所示:

    $ curl -X PUT -d '{ "dream": 1 }' \
    -H "Content-Type: application/json" \
    http://mqtt.phodal.com/topics/lettuce

    $ curl http://mqtt.phodal.com/topics/lettuce
    { "dream": 1 }

Mosquitto示例

    mosquitto_pub -h mqtt.phodal.com -d -t lettuce -m "Hello, MQTT. This is my first message."

Python MQTT示例:

    import mosquitto
    mqttc = mosquitto.Mosquitto("python_pub")
    mqttc.connect("mqtt.phodal.com", 1883, 60, True)

    mqttc.publish("lettuce", "Hello, World!")

CoAP GET示例:

    coap-client -m get coap://mqtt.phodal.com:5683/topics/zero

CoAP POST示例

    echo -n 'hello world' | coap post coap://mqtt.phodal.com/topics/zero
    echo -n '{"lettuce": 123}' | coap post coap://mqtt.phodal.com/topics/zero

让我们用MQTT, REST, CoAP做一些有趣的事!

Arduino示例见[https://gist.github.com/phodal/fd1be9ea3cc13cd48ffa](https://gist.github.com/phodal/fd1be9ea3cc13cd48ffa)

###协议支持###

 - MQTT
 - HTTP GET/POST
 - WebSocket
 - CoAP


###支持设备

- Arduino
- 8051/51 Family
- Raspberry Pi
- PCduino
- STM32
- ARM
- Android Devices
- iOS Devices
- Windows Phone Devices
- ...

##其他相关

**在线查看**:[一步步搭建物联网系统](http://designiot.phodal.com/)

图灵-电子书版[一步步搭建物联网系统](http://www.ituring.com.cn/book/1580)

[IOT CoAP](https://github.com/phodal/iot-coap)

[物联网资料合集](https://github.com/phodal/collection-iot)

[最小物联网系统](https://github.com/phodal/iot)

[吊兰-MQTT协议,CoAP协议,WebSocket,物联网协议在线测试](http://mqtt.phodal.com)

###交流

QQ群：348100589

网站解答: [http://qa.phodal.com](http://qa.phodal.com)

## License

Copyright (c) 2015 Phodal Fengda,  [http://www.phodal.com](http://www.phodal.com)

Copyright (c) 2012 Matteo Collina, http://matteocollina.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
