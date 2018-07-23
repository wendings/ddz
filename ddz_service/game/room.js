const defines = require('./../defines');

//取到房间的随机数
const getRandomStr = function (count) {
    let str = '';
    for(let i = 0;i<count;i++){
        str += Math.floor(Math.random()*10);
    }
   return str;
};
// 玩家座位
const getSeatIndex = function (playList) {
    let z = 0;
    if(playList.length === 0){
        return z;
    }
    for(let i = 0;i<playList.length;i++){
        if(z!== playList[i].seatIndex){ // 座位号z 不存在玩家列表的player.seatIndex中
            return z;
        }
        z++;
    }
    console.log('getSeatIndex z = ' +z);
    return z;
}
module.exports = function (spec,player) {
    let  that = {};
    that.roomID = getRandomStr(6);//获取房间id
    let config = defines.createRoomConfig[spec.rate]; //获得房间参数
    let _bottom = config.bottom;
    let _rate = config.rate;
    let _houseManager = player;
    let _playerList = [];

    //玩家加入房间，发通知给其他玩家，加入玩家的属性，_playerList.push(player),seatIndex
    that.joinPlayer = function(player){
        player.seatIndex = getSeatIndex(_playerList);

        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendPlayerJoinRoom({
                nickName:player.nickName,
                accountID:player.accountID,
                avatarUrl:player.avatarUrl,
                gold:player.gold,
                seatIndex:player.seatIndex
            })
        }
        _playerList.push(player);
    };
    //获得房间内玩家的数量
    that.getPlayerCount = function (player) {
        return _playerList.length;
    };

    return that;
}