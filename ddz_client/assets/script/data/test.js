const socket = function () {
    let that = {};
    let _callBackMap = {};
    let _callBackMapIndex = 0;

    let _socket = io(defines.serverUrl);
    _socket.on('notify',(data)=>{
        _callBackMapIndex = data.data.callBackIndex;
        if(_callBackMap.hasOwnProperty(_callBackMapIndex)){
            let cb = _callBackMap[_callBackMapIndex];
            if(data.data.err){
                cb(data.data.err);
            }else {
                cb(null,data.data);
            }
        }
        let type = data.type;

    });
}
export default socket;