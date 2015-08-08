# 吊兰

[![Build Status](https://travis-ci.org/phodal/diaonan.svg?branch=master)](https://travis-ci.org/phodal/diaonan)
[![Code Climate](https://codeclimate.com/github/phodal/diaonan/badges/gpa.svg)](https://codeclimate.com/github/phodal/diaonan)
[![Test Coverage](https://codeclimate.com/github/phodal/diaonan/badges/coverage.svg)](https://codeclimate.com/github/phodal/diaonan)

``吊兰``是一个开源的物联网**平台**。

在线Demo: [http://mqtt.phodal.com](http://mqtt.phodal.com)

###APP: 教你设计物联网

<a href="https://play.google.com/store/apps/details?id=com.phodal.designiot">
  <img alt="Get it on Google Play"
       src="https://developer.android.com/images/brand/zh-cn_generic_rgb_wo_60.png" />
</a>

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

##示例

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

##安装

1.安装redis

    sudo apt-get install redis-server

or

    sudo yum install redis-server

2.安装nodejs依赖

    sudo npm install

3.Server

    node diaonan.js

##其他相关

**在线查看**:[一步步搭建物联网系统](http://designiot.phodal.com/)

[IOT CoAP](https://github.com/phodal/iot-coap)

[物联网资料合集](https://github.com/phodal/collection-iot)

[最小物联网系统](https://github.com/phodal/iot)

###交流

QQ群：348100589

网站解答: [http://qa.phodal.com](http://qa.phodal.com)

## License

Copyright (c) 2015 Phodal Fengda,  [http://www.phodal.com](http://www.phodal.com)

Copyright (c) 2012 Matteo Collina, [http://matteocollina.com](http://matteocollina.com)

[待我代码编成，娶你为妻可好](http://www.xuntayizhan.com/person/ji-ke-ai-qing-zhi-er-shi-dai-wo-dai-ma-bian-cheng-qu-ni-wei-qi-ke-hao-wan/)
