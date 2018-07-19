import  EventListener from './../utility/event-listener'
const socket = function () {
    let that = {};
    let _callBackMap = {};
    let _callBackMapIndex = 0;
    let _event = EventListener({});

    let _socket = io(defines.serverUrl);
    _socket.on('notify',(data)=>{
        console.log('notity = '+JSON.stringify(data));
        _callBackMapIndex = data.callBackIndex;
        if(_callBackMap.hasOwnProperty(_callBackMapIndex)){
            let cb = _callBackMap[_callBackMapIndex];
            if(data.data.err){
                cb(data,data.err);
            }else{
                cb(null,data.data)
            }
        }
        let type = data.type;
        _event.fire(type, data.data);
    });
    _socket.on('connection',()=>{
        console.log('链接成功');
    })

    const notify = function (type,data,callBackIndex) {
        console.log(type,' clent socket-controller callbackIndex = '+callBackIndex);
        _socket.emit('notify',{type:type,data:data,callBackIndex:callBackIndex});
    };

    const request = function (type,data,cb) {
        _callBackMapIndex++;
        _callBackMap[_callBackMapIndex] = cb;

        notify(type,data,_callBackMapIndex)
    };

    that.requestLogin = function (data,cb) {
        console.log("@ in requestLogin");
         request('login',data,cb);
    }
    that.requestCreateUser = function (data,cb) {
        request('create_user',data,cb)
    }
    that.requestMsg = function (cb) {
        request('msg',{},cb);
    }

    that.requestWxLogin = function(data,cb){
        request('login',data,cb);
    }

    return that;

}
export default socket;