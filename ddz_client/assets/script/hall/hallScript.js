cc.Class({
    extends: cc.Component,

    properties: {
        userNameLabel:cc.Label,
        getIdLabel:cc.Label,
        gemsLabel:cc.Label,
        headSprite:cc.Node,
        noticeLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {

    } ,

    init:function () {

    },

    update (dt) {
       let x =  this.noticeLabel.node.x;
       x -= dt * 100;
       if(x < - 1350){
           x = 415;
       }this.noticeLabel.node.x = x;
    },
});
