const socket = function () {
    let that = {};
    let _socket = io(defines.serverUrl);
    _socket.on('notify',(data)=>{
        console.log('notity = '+JSON.stringify(data));
    });
    _socket.on('welcome',(data)=>{
        console.log('U connection server,listen data = ',JSON.stringify(data));
    });
}
export default socket;