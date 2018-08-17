import  EventListener from './../utility/event-listener'
const socket = function () {
    let that = {};
    let _callBackMap = {};
    let _callBackMapIndex = 0;
    let _event = EventListener({});

    let _socket = io(defines.serverUrl);
    _socket.on('notify',(data)=>{
        console.log('@_@  notity = '+JSON.stringify(data));
        //从服务器发来的取出callBackIndex对应的函数
        let callBackMapIndex = data.callBackIndex;
        if(_callBackMap.hasOwnProperty(callBackMapIndex)){
            let cb = _callBackMap[callBackMapIndex];
            //执行cb
            if(data.data.err){
                cb(data,data.err);
            }else{
                cb(null,data.data)
            }
        }
        // event fire数据
        let type = data.type;
        _event.fire(type, data.data);
    });
    _socket.on('connection',()=>{
        console.log('链接成功');
    })

    const notify = function (type,data,callBackIndex) {
        console.log('type = ',type,'data = '+JSON.stringify(data),' clent socket-controller callbackIndex = '+callBackIndex);
        _socket.emit('notify',{type:type,data:data,callBackIndex:callBackIndex});
    };

    const request = function (type,data,cb) {
        console.log('a @@@@@@@@@@@@@@ _callBackMapIndex = ',  _callBackMapIndex );
        _callBackMapIndex ++;
        console.log('b @@@@@@@@@@@@@@ _callBackMapIndex = ',  _callBackMapIndex );
        console.log('@@@@@@@@@request \n',cb);
        _callBackMap[_callBackMapIndex] = cb;
        notify(type,data,_callBackMapIndex);
    }

    that.requestLogin = function (data,cb) {
        console.log("@ in requestLogin");
        request('login',data,cb);
    };
    that.requestCreateUser = function (data,cb) {
        request('create_user',data,cb)
    };
    that.requestMsg = function (cb) {
        request('msg',{},cb);
    };

    that.requestWxLogin = function(data,cb){
        request('login',data,cb);
    };
    that.requestCreateRoom = function(data,cb){
        request('create_room',data,cb);
    };
    that.requestJoinRoom = function (data,cb) {
        request('join_room',data,cb);
    };
    that.requestEnterRoomScene = function (cb) {
       request('enter_room_scene',{},cb);
    };
    that.requestStartGame = function (cb) {
        request('start_game',{},cb);
    };
    that.requestPlayerPushCard = function (value,cb) {
        request('myself-push-card',value,cb);
    };
    that.requestTipsCards = function (cb) {
        request('request-tips',{},cb);
    };
    that.notifyReady = function () {
        notify('ready',{},null);
    };
    that.notifyRobState = function(value){
        notify('rob-state',value,null);
    };



//--------------------------------------------------------------
    //event on 注册
    that.onPlayerJoinRoom = function (cb) {
        _event.on('player_join_room',cb);
    };
    that.onPlayerReady = function(cb){
        _event.on('player_ready',cb);
    };
    that.onGameStart = function (cb) {
        _event.on('game_start',cb);
    };
    that.onChangeHouseManager = function(cb){
        _event.on('change_house_manager',cb);
    };
    that.onPushCard = function (cb) {
        console.log('socket onPushCard :',JSON.stringify(cb));
        _event.on('push_card',cb);
    };
    that.onCanRobMater = function (cb) {
        _event.on('can-rob-master',cb);
    };
    that.onPlayerRobState = function (cb) {
        _event.on('player-rob-state',cb);
    };
    that.onChangeMaster = function (cb) {
        _event.on('change-master',cb);
    };
    that.onShowBottomCard = function (cb) {
        _event.on('show-bottom-card',cb);
    };
    that.onCanPushCard = function (cb) {
        _event.on('can-push-card',cb);
    }

    return that;

}
export default socket;