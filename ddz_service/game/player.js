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
        switch (notifyData){

        }
    })
    return that;

}