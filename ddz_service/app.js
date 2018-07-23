const socket = require('socket.io');
const app = socket('3000');
const myDB = require('./db');
const gameController = require('./game/game-controller');
const defines = require('./defines');

myDB.connect({
    'host':'127.0.0.1',
    'port':3306,
    'user':'root',
    'password':'root',
    'database':'doudizhu',
});
// myDB.createPlayerInfo({
//     "pid":0,
//     "account" : "123aaa",
//     "username" : "用户名",
//     "sex" :1,
//     "headimg" : "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIicYMNzeMH7myXwQNAGR6PR4IrIFtF9mXdLz71dDq13L3LCRksKLmJ27T1HbjrFP9E7PYSFjvPI0g/132",
//     "lv" : 1,
//     "exp" :  0 ,
//     "coins" :  1000,
//     "gems" :  10
// });
app.on('connection',function (socket) {
    socket.emit('connection','connection success');
    socket.on('notify',(notifyData)=> {
        console.log('@ notifyData = '+ JSON.stringify(notifyData));
        switch(notifyData.type){
            case 'login':
                var uniqueID = notifyData.data.uniqueID;
                var callBackIndex = notifyData.callBackIndex;
                console.log("app.js callBackIndex = ",callBackIndex);
                myDB.getPlayerInfoWithUniqueID(uniqueID,(err,data)=>{
                    if(err){
                        console.log('@ err = ' + err);
                    }else {
                        console.log('@ data = ' + JSON.stringify(data));
                        if(data.length === 0){
                            let loginData = notifyData.data;
                            myDB.createPlayerInfo( //创建数据库信息
                                loginData.uniqueID,
                                loginData.accountID,
                                loginData.nickName,
                                defines.defaultGoldCount,
                                loginData.avatarUrl
                            );
                            gameController.createPlayer({//创建数据模型playerData
                                'unique_id':notifyData.data.uniqueID,
                                'account_id':notifyData.data.accountID,
                                'nick_name':notifyData.data.nickName,
                                'gold_count':defines.defaultGoldCount,
                                'avatar_url':notifyData.data.avatarUrl

                            },socket,callBackIndex)
                        }else {
                            console.log('data = ' + JSON.stringify(data));
                            gameController.createPlayer(data[0],socket,callBackIndex);
                        }
                    }
                })

                break;

            case 'msg':
                var callBackIndex = notifyData.callBackIndex;
                myDB.getMessage((err,data)=>{
                    console.log('@@@@msg = ',JSON.stringify(data,'callBackIndex = '+notifyData.callBackIndex));
                    gameController.notify('msg',data[0],socket,callBackIndex);
                })
                break;
            default:
                break;
        }
    })
})