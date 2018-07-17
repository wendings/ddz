const mysql = require('mysql');
let client = undefined;
const query = function (sql,cb) {
    client.getConnection((err,connection)=>{
        if(err){
            console.log('get connection = ' +err);
            if(cb){
                cb(err);
            }
        }else {
            connection.query(sql,(connErr,result)=>{
                if(connErr){
                    console.log(sql + connErr);
                    if(cb){
                        cb(connErr);
                    }
                }else{
                    if(cb){
                        cb(null,result);
                    }
                }
                connection.release(); //释放资源
            })
        }
    })
};
exports.getPlayerInfo = function (key,cb) {
    let sql = 'select * from ws_users where uid = '+ key + ';';
    myDB.query(sql,cb);
};
exports.createPlayerInfo = function (uniqueID, accountID, nickName, goldCount, avatarUrl) {
    let sql = 'insert into t_account(unique_id, account_id, nick_name,gold_count, avatar_url) values('
        + "'" +uniqueID
        + "'" + ','
        + "'" + accountID
        + "'" + ','
        + "'" +nickName
        + "'" + ','
        + "'" + goldCount
        + "'" +','
        + "'" + avatarUrl
        + "'" + ');' ;

    query(sql,(err,data)=>{
        if(err){
            console.log('create player info = ' + err);
        }else{
            console.log('create player info = ' + JSON.stringify(data));
        }

    })
};

exports.connect = function (config) {
    client = mysql.createPool(config);
}