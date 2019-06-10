const APIServerLink = "http://mcn.nutn.edu.tw:9527/api/v1/device/";  // API In Server Link
const DeviceID      = "aa560370";                                    // Device ID      

var Viewer = new Vue({
    el:"#Viewer",
    data:{
        PageSum:     1,
        NowPage:     1,
        IsConnect:   false,
        IsMessage:   true,
        InputDevID:  DeviceID,
        MessageData: "準備中",
        SystemTimer: "",
        DataList:    [],
        LogList:    [],
        DevList:   [],
        Vounter: 0
    },
    mounted() {
        this.SystemTimer = this.GetTime();
        this.AddNewDev();
    },
    created () {
        this.intervalId = setInterval(() => {
            if(this.IsConnect){
                this.Vounter++;
                this.UpdataJson();
            }
            
        }, 60000)
    },
    methods: {
        ConnectEvent:function ConnectEvent() {
            if(this.DevList.length==0){
                this.AddMessageBox("請至少設定一個連線裝置");
                return;
            }
            this.IsConnect = !this.IsConnect;
            this.SystemTimer = this.GetTime();
            
            if(this.IsConnect){
                let IsReConnect = true;
                this.AddMessageBox("連線中...");
                this.GetJson();

            }else{
                for(let n=0;n<this.DataList.length;n++){
                    this.DataList[n].State = "未連線";
                    this.DataList[n].counter = 0;
                }
                this.AddMessageBox("已中斷");
            }
        },
        AddMessageBox:function AddMessageBox(MessageText) {
            this.MessageData = MessageText;
            this.IsMessage = true;
        },
        CheckMessage:function CheckMessage(){
            this.IsMessage = false;
            this.MessageData = "";
        },
        GetJson:function GetJson() {
            let TmpPageCounter = 0;
            for(let n=0;n<this.DevList.length;n++){
                $.getJSON("http://mcn.nutn.edu.tw:9527/api/v1/device/"+Viewer.DevList[n]+"/"+Viewer.SystemTimer, function(data){
                    for(let i=0;i<data.length;i++,TmpPageCounter++){
                        Viewer.LogList.push({id:data[i].macAddress,State:"正常",Local:{x:data[i].lat,y:data[i].lng},Time:data[i].createTime,Link:"https://www.google.com.tw/maps/place/"+data[i].lat+","+data[i].lng+"/@"+data[i].lat+","+data[i].lng+",20z",counter:0})
                        //AT Last Data
                        if(data[i].lat!="null" && data[i].lng!="null"){
                            let DevTester = Viewer.DevList.indexOf(data[i].macAddress);
                            if(DevTester==-1)
                                Viewer.DataList.push({id:data[i].macAddress,State:"正常",Local:{x:data[i].lat,y:data[i].lng},Time:data[i].createTime,Link:"https://www.google.com.tw/maps/place/"+data[i].lat+","+data[i].lng+"/@"+data[i].lat+","+data[i].lng+",20z",counter:0})
                            else
                                Viewer.DataList[DevTester] = {id:data[i].macAddress,State:"正常",Local:{x:data[i].lat,y:data[i].lng},Time:data[i].createTime,Link:"https://www.google.com.tw/maps/place/"+data[i].lat+","+data[i].lng+"/@"+data[i].lat+","+data[i].lng+",20z",counter:0}
                        }
                    }
                    Viewer.PageSum = Math.ceil(TmpPageCounter/20);
                    Viewer.AddMessageBox("已連線");
                });
            }
        },
        GetTime:function GetTime() {
            let TmpDate = new Date;
            if(String(TmpDate.getMonth()+1).length == 1 ){
                if(String(TmpDate.getDate()).length == 1 ){
                    return TmpDate.getFullYear() + "-0" + (TmpDate.getMonth()+1) + '-0' + TmpDate.getDate() + ' ';
                }else{
                    return TmpDate.getFullYear() + "-0" + (TmpDate.getMonth()+1) + '-' + TmpDate.getDate() + ' ';
                }
            }else{
                if(String(TmpDate.getDate()).length == 1 ){
                    return TmpDate.getFullYear() + "-" + (TmpDate.getMonth()+1) + '-0' + TmpDate.getDate() + ' ';
                }else{
                    return TmpDate.getFullYear() + "-" + (TmpDate.getMonth()+1) + '-' + TmpDate.getDate() + ' ';
                }
            }
        },
        AddNewDev:function AddNewDev() {
            if(this.InputDevID == ""){
                this.AddMessageBox("裝置名不能為空");
                return;
            }

            if(this.InputDevID.length !=8){
                this.AddMessageBox("合法裝置名需8碼");
                return;
            }
            if(this.DevList.indexOf(this.InputDevID)==-1){
                this.DevList.push(this.InputDevID);
                this.DataList.push({id:this.InputDevID,State:"未連線",Local:{x:null,y:null},Time:"",Link:"#",counter:0});
                this.InputDevID = "";
            }else{
                this.AddMessageBox("該裝置已存在");
            }
            
        },
        DelDev:function DelDev(data) {
            this.DevList = this.DevList.slice(0,data).concat(this.DevList.slice(data+1,this.DevList.length))
            this.DataList = this.DataList.slice(0,data).concat(this.DataList.slice(data+1,this.DataList.length))
        },
        NowPageEvent:function NowPageEvent(GetPage){
            this.NowPage+=GetPage;
        },
        NowPageSet:function NowPageSet(GetPage){
            this.NowPage=GetPage;
        },
        UpdataJson:function UpdataJson() {
            for(let n=0;n<this.DevList.length;n++){
                $.getJSON("http://mcn.nutn.edu.tw:9527/api/v1/device/"+Viewer.DevList[n]+"/"+Viewer.SystemTimer, function(data){
                    if(data.length > 0){
                        if(Viewer.DataList[n].id==Viewer.DevList[n]){
                            for(let i=data.length-1;i>=0;i--){
                                if(data[i].lat!="null" && data[i].lng!="null"){ 
                                    if(Viewer.DataList[n].Time == data[i].createTime){
                                        Viewer.DataList[n]={id:data[i].macAddress,State:"無回應",Local:{x:data[i].lat,y:data[i].lng},Time:data[i].createTime,Link:"https://www.google.com.tw/maps/place/"+data[i].lat+","+data[i].lng+"/@"+data[i].lat+","+data[i].lng+",20z",counter:(Viewer.DataList[n].counter+60)};
                                    }else{
                                        Viewer.DataList[n] = {id:data[i].macAddress,State:"正常",Local:{x:data[i].lat,y:data[i].lng},Time:data[i].createTime,Link:"https://www.google.com.tw/maps/place/"+data[i].lat+","+data[i].lng+"/@"+data[i].lat+","+data[i].lng+",20z",counter:Viewer.DataList[n].counter};
                                    }
                                    break;
                                }
                            }
                        }else{
                            Viewer.DataList = Viewer.DataList.slice(0,n).concat(Viewer.DataList.slice(n+1,Viewer.DataList.length))
                        }
                    }else{
                        Viewer.DataList[n].State="未連線";
                        Viewer.DataList[n].counter+=60;
                    }
                });
            }
            Viewer.AddMessageBox("已更新");
        }
    }
    
});
