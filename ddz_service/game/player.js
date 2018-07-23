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
                        notify('join_room',{data:data.data},callBackIndex);
                    }
                })
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

    return that;

}