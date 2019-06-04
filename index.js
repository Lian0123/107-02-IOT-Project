var mqtt = require("mqtt");    // Uesd MQTT 
const MQTTServerHost = "???";  // MQTT Server Host Name
const DeviceID = "???";        // Device ID            

function GetMQTTEvent() {
    let client  = mqtt.connect(MQTTServerHost);  // Connect to Broker 
    let GetJson = undefined;                     // Get Json Data
    console.log("Get Message From MQTT Server");

    /*
    * |====================================================================
    * | Connect To Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 連線至Bocker
    * |
    * 
    */
    client.connect({
        userName: "admin",
        password: "admin",
        port: 1883,
        onSuccess:function() {
            console.log("Get Module Is connectted");
            client.subscribe(DeviceID);
        }
    });


    /*
    * |====================================================================
    * | Listen Get Message Event By Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 獲取Bocker資訊並轉成JSON檔
    * |
    * 
    */
    client.on('message', function (topic, message) {
        try {
            GetJson = JSON.parse(message);
            console.log(message.toString());
        } catch (error) {
            console.log("Get Data Type Error");
        }
        client.end()
        return GetJson;
    });

    /*
    * |====================================================================
    * | Listen Error Event By Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 監控Bocker連線是否錯誤
    * |
    * 
    */
    client.on('error', function (error) {
        console.log("Get Module Connect Error");
        client.end()
        return;
    });


    /*
    * |====================================================================
    * | Listen ReConnect Event By Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 監控Bocker連線是否進入重新連線
    * |
    * 
    */
    client.on('reconnect', function (packet) {
        console.log("Get Module Is ReConnect");
    });

}

function SendMQTTEvent(SendData) {
    let client  = mqtt.connect(MQTTServerHost);  // Connect to Broker 
    console.log("Send Message To MQTT Server");

    /*
    * |====================================================================
    * | Connect To Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 連線至Bocker
    * |
    * 
    */
    client.connect({
        userName: "admin",
        password: "admin",
        port: 1883,
        onSuccess:function() {
            console.log("Send Module Is connectted");
            client.publish(DeviceID,SendData);
        }
    });

    /*
    * |====================================================================
    * | Listen Error Event By Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 監控Bocker連線是否錯誤
    * |
    * 
    */
    client.on('error', function (error) {
        console.log("Send Module Connect Error");
        client.end()
    });


    /*
    * |====================================================================
    * | Listen ReConnect Event By Bocker
    * |====================================================================
    * | Date  : 2019-06-03
    * | About : 監控Bocker連線是否進入重新連線
    * |
    * 
    */
    client.on('reconnect', function (packet) {
        console.log("Send Module Is ReConnect");
    });

}
