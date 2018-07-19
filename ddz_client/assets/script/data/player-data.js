const  getRandomStr = function(count){
    let str = '';
    for(let i = 0;i<count;i++){
        str += Math.floor(Math.random() * 10);
    }
    return str;
};
const PlayerData = function () {
    let that = {};
    that.uniqueID = '1' + getRandomStr(6);
    that.accountID = '2' + getRandomStr(6);
    that.nickName = '游客'+ that.accountID;
    that.avatarUrl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIicYMNzeMH7myXwQNAGR6PR4IrIFtF9mXdLz71dDq13L3LCRksKLmJ27T1HbjrFP9E7PYSFjvPI0g/132';
    that.goldCount = 0;
    return that;
};
export  default PlayerData;