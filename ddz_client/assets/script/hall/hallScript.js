import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        userNameLabel:cc.Label,
        getIdLabel:cc.Label,
        goldLabel:cc.Label,
        headSprite:cc.Sprite,
        noticeLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        console.log(' hall has global player data ='+ JSON.stringify(global.playerData));
        this.init();
        // this.headSprite=;
        // this.noticeLabel='';
    } ,

    init:function () {
        if(!global.playerData){
            cc.director.loadScene('loginScene');
        }
        this.userNameLabel.string = global.playerData.nickName;
        this.getIdLabel.string=global.playerData.accountID;
        this.goldLabel.string = global.playerData.goldCount;
        cc.loader.load({url:global.playerData.avatarUrl,type:'jpg'},(err,tex)=>{
            console.log('headSprite',global.playerData.avatarUrl,tex);
            this.headSprite.spriteFrame = new cc.SpriteFrame(tex,cc.Rect(0, 0, tex.width, tex.height));
        });
        global.socket.requestMsg((err,data)=>{
            console.log('@@ hall get msg');
            if(err){
                console.log('获取msg失败');
            }else{
                this.noticeLabel.string = data;
            }

        })

    },

    update (dt) {
       let x =  this.noticeLabel.node.x;
       x -= dt * 100;
       if(x + this.noticeLabel.node.width < - 1350){
           x = 415;
       }this.noticeLabel.node.x = x;
    },
});
