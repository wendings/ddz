cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        if(cc.sys.os !== "Windows"){
            this.node.getChildByName('guest_button').active = false;
        }else{
            this.node.getChildByName('wechat_button').active = false;
        }
    },
    start () {

    },
    onButtonClick:function (event,customData) {
        console.log('customData = ',JSON.stringify(customData));
        switch (customData){
            case 'wechat':
                console.log('u click wechat button');
                this.loadHall();
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
