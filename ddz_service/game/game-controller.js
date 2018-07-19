const Player = require('./player');
let _playerList = [];
exports.createPlayer = function(data,socket,callBackIndex){
    console.log(JSON.stringify(callBackIndex),JSON.stringify(data));
    let player = Player(data,socket,callBackIndex,this);//this:当前玩家
    _playerList.push(player);
};
exports.notify = function (type,data,socket,callBackIndex) {
    console.log('game-controller notify = '+JSON.stringify(data)+"callBackIndex = " +callBackIndex);
    let _socket = socket;
    _socket.emit('notify',{
        type:type,
        data:data,
        callBackIndex:callBackIndex
    });
};
