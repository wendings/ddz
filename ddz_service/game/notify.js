exports.notify = function (type,data,socket,callBackIndex) {
    console.log('player notify = '+JSON.stringify(data)+"callBackIndex = " +callBackIndex);
    let _socket = socket;
    _socket.emit('notify',{
        type:type,
        data:data,
        callBackIndex:callBackIndex
    });
};
