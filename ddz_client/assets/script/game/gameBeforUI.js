import global from './../global';
cc.Class({
    extends: cc.Component,

    properties: {
        readyButton:cc.Node,
        gameStartButton:cc.Node,
        gameBeforUI:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('init',()=>{
            console.log('gameBeforUI listent on init');
            // 房主ui和普通玩家UI显示
            if(global.playerData.houseMangerID === global.playerData.accountID){//房主
                this.readyButton.active = false;
                this.gameStartButton.active = true;
            }else{//普通玩家
                this.readyButton.active = true;
                this.gameStartButton.active = false;
            }
        });
        global.socket.onGameStart(()=>{
            this.gameBeforUI.active = false;
        });
        global.socket.onChangeHouseManager((data)=>{
            global.playerData.houseMangerID = data;
            if(global.playerData.accountID === data){
                this.readyButton.active = false;
                this.gameStartButton.active = true;
            }
        });


    },
    onButtonClick(event,customData){
        switch (customData){
            case 'ready':
                console.log('ready');
                global.socket.notifyReady();
                break;
            case 'start-game':
                console.log('start game');
                global.socket.requestStartGame((err,data)=>{
                   if(err){
                      console.log('err = ' +err);
                   } else{
                      console.log('game start data = ' +data);
                   }
                });
                break;
            default:
                break;
        }
    },
    start () {

    },

    // update (dt) {},
});
