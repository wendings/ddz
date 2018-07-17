const socket = require('socket.io');
const app = socket('3000');
const myDB = require('./db');
myDB.connect({
    'host':'127.0.0.1',
    'port':3306,
    'user':'root',
    'password':'root',
    'database':'doudizhu',
});
// myDB.createPlayerInfo({
//     "pid":0,
//     "account" : "123aaa",
//     "username" : "用户名",
//     "sex" :1,
//     "headimg" : "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIicYMNzeMH7myXwQNAGR6PR4IrIFtF9mXdLz71dDq13L3LCRksKLmJ27T1HbjrFP9E7PYSFjvPI0g/132",
//     "lv" : 1,
//     "exp" :  0 ,
//     "coins" :  1000,
//     "gems" :  10
// });
app.on('connection',function (socket) {
    socket.emit('connection','connection success');
})