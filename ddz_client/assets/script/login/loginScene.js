import  global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        _unique:null,
    },

    // LIFE-CYCLE CALLBACKS:
    //预加载
    onLoad:function () {
        if(cc.sys.os !== "Windows"){
            this.node.getChildByName('guest_button').active = false;
        }else{
            this.node.getChildByName('wechat_button').active = false;
        }
        this.node.getChildByName('guest_button').active = false;
        this.node.getChildByName('wechat_button').active = true;
    },
    start () {
        this._unique = cc.sys.localStorage.getItem('uniqueID');
        console.log('get start  _unique = ',this._unique);
    },
    onButtonClick:function (event,customData) {
        console.log('customData = ',JSON.stringify(customData));
        switch (customData){
            case 'wechat':
                console.log('u click wechat button');
                let data = {};
                if(this._unique !== 'undefined' && this._unique !== ''){
                    data.uniqueID = this._unique;
                    console.log('get _unique = ',this._unique);
                }else{
                    data.uniqueID = global.playerData.uniqueID;
                    data.accountID = global.playerData.accountID;
                    data.nickName = global.playerData.nickName;
                    data.avatarUrl = global.playerData.avatarUrl;
                }
                console.log('login data = ',JSON.stringify(data));
                global.socket.requestLogin(data,(err,result)=>{
                    if(err){
                        console.log('登陆失败 err = '+ err);
                    }else{
                        // 获取玩家数据
                        console.log('result = ' + JSON.stringify(result));
                        if(this._unique === 'undefined' || this._unique === ''){
                            console.log('setItem in login',result.uniqueID);
                            cc.sys.localStorage.setItem('uniqueID',result.uniqueID);
                        }
                        global.playerData.uniqueID = result.uniqueID;
                        global.playerData.accountID = result.accountID;
                        global.playerData.nickName = result.nickName;
                        global.playerData.avatarUrl = result.avatarUrl;
                        global.playerData.goldCount = result.goldCount;
                        this.loadHall();
                    }
                });

                break;
            case 'guest':
                console.log('u click guest button');
                this.loadHall();
                break;
            default:
                break;
        }
    },
    loadHall:function () {
        cc.director.loadScene('hallScene');
    }

    // update (dt) {},
});
