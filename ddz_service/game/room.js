const defines = require('./../defines');
const Carder = require('./carder');

//房间状态枚举类
const RoomState = {
    Invalide:-1,//无效的
    WaitingReady:1,
    StartGame:2,
    PushCard:3,
    RobMater:4,
    ShowBottomCard:5,
    Playing:6
};
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

    let _carder = Carder();
    let _lostPlayer = undefined;
    let _robMasterPlayerList = [];
    let _pushPlayerList = [];
    let _master = undefined;
    let _masterIndex = undefined;
    let _threeCardsList = [];
    let _currentPlayerPushCardList = undefined; //当前玩家出的牌
    let _notPushCardNumber = 0; //有几个玩家选择不出牌

    let _state = RoomState.Invalide; //初始化
    const setState = function (state) {
        if(state === _state){
            return; //切换相同的状态直接返回
        }
        // 判断玩家状态
        switch (state){
            case RoomState.WaitingReady:
                break;
            // 开始游戏房间里所有发送开始游戏通知
            case RoomState.StartGame:
                console.log('room setState  StartGame');
                for(let i = 0;i<_playerList.length;i++){
                    _playerList[i].sendGameStart();
                }
                setState(RoomState.PushCard);
                break;
            case RoomState.PushCard:
                console.log('room setState  PushCard');
                _threeCardsList = _carder.getThreeCards();
                // console.log('@@@@@@@@@ _threeCardsList = ',JSON.stringify(_threeCardsList));
                // console.log('@@@@@@@@@ _playerList = ',JSON.stringify(_playerList.length));
                for(let i = 0;i<_playerList.length;i++){
                    _playerList[i].sendPushCard(_threeCardsList[i]);
                }
                setState(RoomState.RobMater);
                break;
            case RoomState.RobMater:
                console.log('room setState RobMater');
                _robMasterPlayerList = [];
                if(_lostPlayer === undefined){// 不是掉线玩家
                    for(let i = _playerList.length-1;i>=0;i--){
                        _robMasterPlayerList.push(_playerList[i]);
                    }
                }
                turnPlayerRobMater();
                break;
            case RoomState.ShowBottomCard:
                console.log('room setState ShowBottomCard');
                for(let i = 0;i<_playerList.length;i++){
                    _playerList[i].sendShowBottomCard(_threeCardsList[3]);
                }
                setTimeout(()=>{
                    setState(RoomState.Playing);
                },2000);
                break;

            case RoomState.Playing:
                console.log('进入出牌阶段');
                // 地主先出牌 先找出玩家列表中的地主
                for(let i = 0;i<_playerList.length;i++){
                    if(_playerList[i].accountID === _master.accountID){
                        _masterIndex = i;
                    }
                }
                turnPushCardPlayer();
                break;
            default:
                break;
        }
    };
    //玩家加入房间，发通知加入玩家属性给其他玩家，加入玩家的属性，_playerList.push(player),seatIndex
    that.joinPlayer = function(player){
        console.log('@@@@config = ',config);
        console.log('joinPlayer = ',JSON.stringify(player) );
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
    that.playerEnterRoomScene = function (player,cb) {
        let playerData = [];
        for(let i = 0;i<_playerList.length;i++){
            playerData.push({
                nickName:_playerList[i].nickName, //joinGame时已把玩家数据放入数组
                accountID:_playerList[i].accountID,
                avatarUrl:_playerList[i].avatarUrl,
                gold:_playerList[i].gold,
                seatIndex:_playerList[i].seatIndex
            });
        }
        if(cb){
            cb({
                seatIndex:player.seatIndex,
                playerData:playerData,//房间内所有玩家
                roomID:that.roomID,
                houseManagerID:_houseManager.accountID
            })
        }
    };
    //玩家准备
    that.playerReady = function(player){
        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendPlayerReady(player.accountID);
        }
    };
    //房间里的玩家离线
    that.playerOffLine = function (player) {
        for(let i = 0;i<_playerList.length;i++){
           if(_playerList[i].accountID === player.accountID){
               _playerList.splice(i,1);
               if(player.accountID === _houseManager.accountID){
                   changeHouseManager();
               }
           }
        }
    };

    that.playerRobStateMaster = function (player,value) {
        if(value === 'ok' ){ //先选择请地主的玩家将会被指点为地主
            console.log('rob master ok');
            _master = player;
        }else if(value === 'no-ok'){
            console.log('rob master no ok');
        }
        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendPlayerRobStateMaster(player.accountID,value);
        }

        turnPlayerRobMater();
    };

    // 改变房主
    const changeHouseManager = function(){

        if(_playerList.length === 0){
            return;
        }
        _houseManager = _playerList[0];
        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendChangeHouseManager(_houseManager.accountID);
        }
    };
    //刷新轮流玩家
    const referTurnPushPlayer = function () {
        let index = _masterIndex;
        for(let i = 2;i>=0;i--){
            let z = index;
            if( z >= 3){
                z=z-3;
            }
            _pushPlayerList[i] = _playerList[z];
            index ++;
        }
    };
    // 轮流玩家出牌
    const turnPushCardPlayer = function () {
        if(_pushPlayerList.length === 0){
            referTurnPushPlayer();
        }
        let player = _pushPlayerList.pop();
        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendPlayerCanPushCard(player.accountID,_notPushCardNumber);
        }
    };

    const turnPlayerRobMater = function () {
        if(_robMasterPlayerList.length === 0){
            console.log('抢地主结束');
            changeMaster();
            return;
        }

        let player = _robMasterPlayerList.pop();
        if(_robMasterPlayerList.length === 0 && _master === undefined){
            _master = player;
            changeMaster();
            return;
        }
        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendPlayerCanRobMaster(player.accountID);
        }
    };

    //改变地主
    const changeMaster = function () {
        for(let i = 0;i<_playerList.length;i++){
            _playerList[i].sendChangeMaster(_master,_threeCardsList[3]);
        }
        setState(RoomState.ShowBottomCard);
    }


    // 房主点击开始游戏 ps:信息只显示给房主
    that.houseManagerStartGame = function(player,cb){
        // 房间内玩家人数不足
        if(_playerList.length !== defines.roomFullPlayerCount){
            if(cb){
                cb('玩家不足，不能开始游戏');
            }
            return;
        }
        //房间内玩家有人未准备
        for(let i = 0;i<_playerList;i++){
            if(_playerList[i].accountID !== _houseManager.accountID){
                if(_playerList[i].isReady === false){
                    if(cb){
                        cb('有玩家未准备，不能开始游戏');
                    }
                    return;
                }
            }
        }
        if(cb){
            cb(null,'success');
        }
        //改变房间状态--开始游戏
        setState(RoomState.StartGame);
    };
    
    that.playerPushCard = function (player,cards,cb) {
        if(cards.length === 0){
            _notPushCardNumber ++ ;
            console.log('玩家不出牌' + _notPushCardNumber);
            turnPushCardPlayer();
        }else{
            //出牌
            let cardsValue = _carder.isCanPushCards(cards);
            // 开局第一次出牌 或者 两个玩家都不出牌 则不需要比牌直接出牌
            if(_currentPlayerPushCardList === undefined || _notPushCardNumber ===2 ){
                if(cb){
                    cb(null,'push card success');
                }
                _currentPlayerPushCardList = cards;
                sendPlayerPushCard(player,cards);
                turnPushCardPlayer();
            }else {

            }
            
        }
    }



    Object.defineProperty(that, 'bottom', {// 通过单列模式获取到_bottom
        get() {
            return _bottom;
        }
        // set(val) {
        //     _bottom = val;
        // }
    });
    Object.defineProperty(that, 'rate', {// 通过单列模式获取到_rate
        get() {
            return _rate;
        }
    });

    return that;
}