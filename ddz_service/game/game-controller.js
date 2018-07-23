const Player = require('./player');
const Room = require('./room');
const defines = require('./../defines');

let _playerList = [];
let _roomList = [];

exports.notify = function (type,data,socket,callBackIndex) {
    console.log('game-controller notify = '+JSON.stringify(data)+"callBackIndex = " +callBackIndex);
    let _socket = socket;
    _socket.emit('notify',{
        type:type,
        data:data,
        callBackIndex:callBackIndex
    });
};


exports.createPlayer = function(data,socket,callBackIndex){
    console.log(JSON.stringify(callBackIndex),JSON.stringify(data));
    let player = Player(data,socket,callBackIndex,this);//this:当前玩家
    _playerList.push(player);
};

exports.createRoom = function(data,player,cb){
    let needCostGold = defines.createRoomConfig[data.rate].needCostGold;
    console.log(needCostGold);
    if(player.gold <needCostGold){
        if(cb){
            cb('gold not enough');
        }
        return;
    }
    let room = Room(data,player);
    _roomList.push(room);
    if(cb){
        cb(null,room.roomID);
    }
};

//加入房间：
// 根据传入的roomID 在遍历roomList查找，如果找到就设置 let room = _roomList[i]; 没有cb（‘no have this room’）
// 如果房间人数满3人返回空，否者调用room.joinPlayer() 加入房间


exports.joinRoom = function (data,player,cb) {
    console.log('joinRoom data = ' + JSON.stringify(data) +' 数据类型 typeOf = '+ typeof  data);
    for(let i = 0;i<_roomList.length;i++){
        if(_roomList[i].roomID === data){
            let room = _roomList[i];

            if(room.getPlayerCount() ===3){
                if(cb){
                    cb('房间已满！');
                }
                return;
            }
            room.joinPlayer(player);
            if(cb){
                cb(null,{
                    room:room,
                    data:{bottom:room.bottom,rate:room.rate}
                })
            }
        }
    }
    if(cb){
        cb('no have this room '+ data);
    }
}
