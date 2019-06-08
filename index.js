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
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    headers: {
                        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFhNjM3NDcwOTg3NTVhM2U4NjA2MzM2MzViNTkwYzQ2ZTA2ZTYwMTg3MjQzMTBkZjEwZGZmZGEwM2FkNjI1MmY1ZTNiMWJjNzNiNTE4MjI0In0.eyJhdWQiOiIyIiwianRpIjoiMWE2Mzc0NzA5ODc1NWEzZTg2MDYzMzYzNWI1OTBjNDZlMDZlNjAxODcyNDMxMGRmMTBkZmZkYTAzYWQ2MjUyZjVlM2IxYmM3M2I1MTgyMjQiLCJpYXQiOjE1NTY5NDk1NzMsIm5iZiI6MTU1Njk0OTU3MywiZXhwIjoxNTg4NTcxOTczLCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.3niLgPCQ55Q1mar3Sp0PLa2A7x_2P574CJlKSb2wfKHKU2t-TVQ0NiKovDOWIItoRpnoyLa6YDNTC4csl4yAkAA3NO1HBML7_2Vlex_ir9av9fyB-Rw1bWbtqS50b0aerpLIdYpawO7EkYFc2S3Ph8dTZyYiuaeTC00HHl157uic92kPGcxs3SFKP45xxbkx4S1Xx-1k90bbOhothodift6tyBLp2FpGiaCE16B64dIXXy7_QKHOs-bC5a4PySk7qz2zOWk_cib8yoGZBDTxA70MHENaW27WWRMj-o81JVEF8Ad5_lz-gn8w7nW5b-OiHPVQ749PmXuRryvv-jEJWFDqOmsglMwWxnZU2MrM3t1iyYyPUXxNOb-vM1VJ1TJSy0lxp9y_1GXbKPl9e0XHiMt49aaSck1wKh1moKDx1NM-j_l88IUETQgLR3WYYZ_DFfYwxEhVCLZtlgNQIb2kMFGivrZCL6BJlr0CkmOr8w8R8ZkxbkMn0XUIWx8104ho0IDjOPm_0smE-gKrlHVoquKhZ_2G6L7rfrsM6XNjy3Idbt7ed83RMBLLL5afU3LYFk02q3_DkYxOBqdcjdiExrgy--2A_6erZExKmR-xq3MlX0go5C-x7-CYE9VmX281DLrNw0ujzYp4ntC36CZVaRrIfNppvR2a0dsFnOkbWjM',
                        'Access-Control-Allow-Origin', '*',
                        'Accept': 'application/json',
                    },
                    url: "http://mcn.nutn.edu.tw:9527/api/v1/device/"+Viewer.DevList[n]+"/"+Viewer.SystemTimer,
                    success: function(data) {
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
                    }
                });
            }
        },
        GetTime:function GetTime() {
            let TmpDate = new Date;
            if(String(TmpDate.getMonth()+1).length == 1 ){
                if(String(TmpDate.getDate()).length == 1 ){
                    return TmpDate.getFullYear() + "-0" + (TmpDate.getMonth()+1) + '-0' + TmpDate.getDate() + ' ';
                }else{
                    return TmpDate.getFullYear() + "-0" + (TmpDate.getMonth()+1) + '-0' + TmpDate.getDate() + ' ';
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
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    headers: {
                        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFhNjM3NDcwOTg3NTVhM2U4NjA2MzM2MzViNTkwYzQ2ZTA2ZTYwMTg3MjQzMTBkZjEwZGZmZGEwM2FkNjI1MmY1ZTNiMWJjNzNiNTE4MjI0In0.eyJhdWQiOiIyIiwianRpIjoiMWE2Mzc0NzA5ODc1NWEzZTg2MDYzMzYzNWI1OTBjNDZlMDZlNjAxODcyNDMxMGRmMTBkZmZkYTAzYWQ2MjUyZjVlM2IxYmM3M2I1MTgyMjQiLCJpYXQiOjE1NTY5NDk1NzMsIm5iZiI6MTU1Njk0OTU3MywiZXhwIjoxNTg4NTcxOTczLCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.3niLgPCQ55Q1mar3Sp0PLa2A7x_2P574CJlKSb2wfKHKU2t-TVQ0NiKovDOWIItoRpnoyLa6YDNTC4csl4yAkAA3NO1HBML7_2Vlex_ir9av9fyB-Rw1bWbtqS50b0aerpLIdYpawO7EkYFc2S3Ph8dTZyYiuaeTC00HHl157uic92kPGcxs3SFKP45xxbkx4S1Xx-1k90bbOhothodift6tyBLp2FpGiaCE16B64dIXXy7_QKHOs-bC5a4PySk7qz2zOWk_cib8yoGZBDTxA70MHENaW27WWRMj-o81JVEF8Ad5_lz-gn8w7nW5b-OiHPVQ749PmXuRryvv-jEJWFDqOmsglMwWxnZU2MrM3t1iyYyPUXxNOb-vM1VJ1TJSy0lxp9y_1GXbKPl9e0XHiMt49aaSck1wKh1moKDx1NM-j_l88IUETQgLR3WYYZ_DFfYwxEhVCLZtlgNQIb2kMFGivrZCL6BJlr0CkmOr8w8R8ZkxbkMn0XUIWx8104ho0IDjOPm_0smE-gKrlHVoquKhZ_2G6L7rfrsM6XNjy3Idbt7ed83RMBLLL5afU3LYFk02q3_DkYxOBqdcjdiExrgy--2A_6erZExKmR-xq3MlX0go5C-x7-CYE9VmX281DLrNw0ujzYp4ntC36CZVaRrIfNppvR2a0dsFnOkbWjM',
                        'Access-Control-Allow-Origin', '*',
                        'Accept': 'application/json',
                    },
                    url: "http://mcn.nutn.edu.tw:9527/api/v1/device/"+Viewer.DevList[n]+"/"+Viewer.SystemTimer,
                    success: function(data) {
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
                    }
                });
            }
            Viewer.AddMessageBox("已更新");
        }
    }
    
});
