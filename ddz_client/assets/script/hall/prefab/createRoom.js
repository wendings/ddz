import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onButtonClick:function (event,customData) {
        console.log('@createRoom  customData = ',customData);
        if(customData.indexOf('rate') !== -1){
            let data = {rate:customData};
            //创建房间
            global.socket.requestCreateRoom(data,(err,data)=>{
                if(err){
                    console.log('createRoom err = ' + err);
                }else{
                    console.log('createRoom = '+JSON.stringify(data));
                    //加入房间
                    let roomId = data.data;
                    global.socket.requestJoinRoom(roomId,(err,data)=>{
                        if(err){
                            console.log('create_room err = '+JSON.stringify(err));
                        }else{
                            console.log('create_room err = '+JSON.stringify(data));
                            // 跳转房间场景
                            global.playerData.bottom = data.data.bottom;
                            global.playerData.rate = data.data.rate;
                            cc.director.loadScene('gameScene');
                        }
                    });
                }
            });
        }
    },

    start () {

    },

    // update (dt) {},
});
