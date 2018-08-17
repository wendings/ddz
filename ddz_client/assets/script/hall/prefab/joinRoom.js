import global from './../../global'
cc.Class({
    extends: cc.Component,

    properties: {
        labelNode:cc.Node,
        alertPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.labelList = this.labelNode.children;
        this.roomIDStr = '';
    },
    onButtonClick(event,customData){
        console.log('join button  customData = ',customData);

        if(customData.length === 1){
            this.roomIDStr += customData;
            if(this.roomIDStr.length === 6){
                console.log('do join room ');
                global.socket.requestJoinRoom(this.roomIDStr,(err,data)=>{
                    if(err){
                        console.log('加入房间 err = '+ err);
                        let node = cc.instantiate(this.alertPrefab);
                        node.parent = this.node;
                        node.getComponent('alertLabelPrefab').initWithOK(err,()=>{
                           this.roomIDStr = '';
                        });
                    }else {
                        console.log('joinRoom js  = '+JSON.stringify(data));
                        global.playerData.bottom = data.data.bottom;
                        global.playerData.rate = data.data.rate;
                        cc.director.loadScene('gameScene');
                    }
                })
            }
            if(this.roomIDStr.length > 6){
                this.roomIDStr = this.roomIDStr.substring(0,this.roomIDStr.length - 1);
            }
        }

        switch (customData){
            case 'close':
                this.node.destroy();
                break;
            case 'clear':
                this.roomIDStr = '';
                break;
            case 'back':
                this.roomIDStr = this.roomIDStr.substring(0,this.roomIDStr.length -1);
                break;
            default:
                break;
        }
    },

    start () {

    },

    update (dt) {
        for(let i = 0;i<this.labelList.length;i++){ //清空
            this.labelList[i].getComponent(cc.Label).string = '';
        }
        for(let i = 0;i<this.roomIDStr.length;i++){
            this.labelList[i].getComponent(cc.Label).string = this.roomIDStr[i];
        }
    },
});
