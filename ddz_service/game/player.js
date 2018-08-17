module.exports = function (spec,socket,cbIndex,gameController) {
    let that = {};
    let _socket = socket;
    console.log('create new player = ' + JSON.stringify(spec));
    that.uniqueID = spec.unique_id;
    that.nickName = spec.nick_name;
    that.accountID = spec.account_id;
    that.avatarUrl = spec.avatar_url;
    that.gold = spec.gold_count;
    that.seatIndex = 0;
    that.isReady = false;
    that.cards = [];
    let _room = undefined;

    const notify = function (type,data,callBackIndex) {
        console.log('player notify = '+JSON.stringify(data)+"callBackIndex = " +callBackIndex);
        _socket.emit('notify',{
            type:type,
            data:data,
            callBackIndex:callBackIndex
        });
    };
    notify('login',{
        uniqueID:that.uniqueID,
        accountID:that.accountID,
        nickName:that.nickName,
        avatarUrl:that.avatarUrl,
        goldCount: that.gold
    }, cbIndex);
    _socket.on('disconnect',()=>{
       console.log('玩家掉线');
       if(_room){
           _room.playerOffLine(that);
       }
    });
    _socket.on('notify',(notifyData)=>{
        console.log('notify  in player' + JSON.stringify(notifyData));
        let callBackIndex = notifyData.callBackIndex;
        switch (notifyData.type){
            case 'create_room':
                // 创建房间
                gameController.createRoom(notifyData.data,that,(err,data)=>{
                    if(err){
                        console.log('create room err ' + err);
                        notify('create_room',{err:err},callBackIndex);
                    }else{
                        console.log('create room data = ' +JSON.stringify(data));
                        notify('create_room',{data:data},callBackIndex);
                    }
                });
                break;
            case 'join_room':
                gameController.joinRoom(notifyData.data,that,(err,data)=>{
                    if(err){
                        console.log('join room err = '+ err);
                    }else{
                        console.log('join room data = '+ JSON.stringify(data));
                        _room = data.room;
                        notify('join_room',{data:data.data},callBackIndex);
                    }
                })
                break;
            case 'enter_room_scene': //拿到数据发回客户端
                console.log('@@ in the enter_room_scene ');
                if(_room){
                    _room.playerEnterRoomScene(that,(data)=>{
                        console.log('enter_room_scene',JSON.stringify(data));
                        that.seatIndex = data.seatIndex;
                        notify('enter_room_scene',data,callBackIndex);
                    });
                }
                break;
            case 'ready':
                that.isReady = true;
                if(_room){
                    _room.playerReady(that);
                }
                break;
            case 'start_game':
                console.log('@@ player house manager Start Game');
                if(_room){
                    _room.houseManagerStartGame(that,(err,data)=>{
                        if(err){
                            notify('start_game',{err:err},callBackIndex);
                        }else{
                            //发start_game告诉客户端UI做游戏的相应的准备
                            notify('start_game',{data:data},callBackIndex);
                        }
                    });
                }
                break;
            case 'rob-state':
                if(_room){
                    _room.playerRobStateMaster(that,notifyData.data);
                }
                break;
            case 'request-tips':
                if(_room){
                    _room.playerRequestTips(that,(err,data)=>{
                        if(err){
                            notify('request-tips',{err:err},callBackIndex);
                        }else{
                            notify('request-tips',{data:data},callBackIndex);
                        }
                    });
                }
                break;
            case 'myself-push-card':
                if(_room){
                    _room.playerPushCard(that,notifyData.data,(err,data)=>{
                        if(err){
                            notify('myself-push-card',{err:err},callBackIndex);
                        }else{
                            notify('myself-push-card',{data:data},callBackIndex);
                        }
                    });
                }
                break;

            default:
                break;
        }
    })
 //------------------------------------------------------------------------

    //玩家加入房间的通知
    that.sendPlayerJoinRoom = function (data) {
      notify('player_join_room',data,null);
    };
    that.sendPlayerReady = function(data){
        notify('player_ready',data,null);
    }
    that.sendGameStart = function () {
        notify('game_start',{},null);
    };
    that.sendPushCard = function (cards) {
        console.log('@@@@   player sendPushCard');
        that.cards = cards;
        notify('push_card',cards,null);
    };
    //改变房主
    that.sendChangeHouseManager = function (data) {
        notify('change_house_manager',data,null);
    };
    that.sendPlayerCanRobMaster = function (data) {
       notify('can-rob-master',data,null);
    };

    that.sendPlayerRobStateMaster = function (accountID,value) {
        notify('player-rob-state',{accountID:accountID,value:value},null);
    }

    that.sendChangeMaster = function (player,cards) {
        console.log(JSON.stringify(cards));
        if(that.accountID === player.accountID){ // 地主获得三张牌
            for(let i = 0;i<cards.length;i++){
                this.cards.push(cards[i]);
            }
        }
        notify('change-master',player.accountID);
    };
    
    that.sendShowBottomCard = function (data) {
        notify('show-bottom-card',data);
    };
    that.sendPlayerCanPushCard = function (data,notPushCardNumber) {
        notify('can-push-card',{uid:data,count:notPushCardNumber});
    };

    return that;

}