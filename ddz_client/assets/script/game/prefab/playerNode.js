import global from "./../../global"
cc.Class({
    extends: cc.Component,

    properties: {
        headImage:cc.Sprite,
        nickNameLabel:cc.Label,
        idLabel:cc.Label,
        goldLabel:cc.Label,

        readyIcon:cc.Node,
        offlineIcon:cc.Node,
        cardsNode:cc.Node,
        pushCardNode:cc.Node,
        cardPrefab:cc.Prefab,

        tipsLabel:cc.Label,
        infoNode:cc.Node,
        timeLabel:cc.Label,
        robIconSp:cc.Sprite,

        masterIcon:cc.Node,
        robIcon:cc.SpriteFrame,
        noRobIcon:cc.SpriteFrame

    },
    onLoad () {
        this.cardList = [];
        this.readyIcon.active = false;
        this.offlineIcon.active = false;
        this.node.on('game-start',()=>{
           this.readyIcon.active = false;
        });
        this.node.on('push-card',()=>{
            if(this.accountID !== global.playerData.accountID){ //给其他玩家发牌
                this.pushCard();
            }
        });
        this.node.on('can-rob-mater',(event)=>{
           let detail = event.detail;
           // 当前playerNode 的this.accountID不等于传值id 且 传值id不等于当前客户端玩家id
           if(detail === this.accountID && detail !== global.playerData.accountID ){
                this.infoNode.active = true;
                this.tipsLabel.string = '正在抢地主';
                this.timeLabel.string = '5';
           }
        });


        this.node.on('rob-state',(event)=>{
            let detail = event.detail;
            console.log(' player node rob state detail = ' + JSON.stringify(detail));
            if(detail.accountID === this.accountID){
                this.infoNode.active = false;
                switch (detail.value){
                    case 'ok':
                        this.robIconSp.node.active = true;
                        this.robIconSp.spriteFrame = this.robIcon;
                        break;
                    case 'no-ok':
                        this.robIconSp.node.active = true;
                        this.robIconSp.spriteFrame = this.noRobIcon;
                        break;
                    default:
                        break;
                }
            }
        });

        this.node.on('change-master',(event)=>{
            let detail = event.detail;
            this.robIconSp.node.active = false;
            if(detail === this.accountID){
                console.log('@@@@ playerNode change-master runAction');
                this.masterIcon.active = true;
                this.masterIcon.scale = 0.6;
                this.masterIcon.runAction(cc.scaleTo(0.3,1).easing(cc.easeBackInOut()))
            }
        });
        // 其他玩家为地主添加3张牌 判断this.accountID for（3）调用pushOneCard（）
        this.node.on('add-three-card',(event)=>{
            let detail = event.detail;
            if(detail === this.accountID){
                for(let i = 0;i<3;i++){
                    this.pushOneCard();
                }
            }
            console.log('@@@ other player is master cardList length =  '+ this.cardList.length);
        });
    },
    // LIFE-CYCLE CALLBACKS:
    initWithData(data,index){
        console.log('座位号 index = ',index);
        this.accountID = data.accountID;
        this.idLabel.string = 'ID:'+data.accountID;
        this.nickNameLabel.string = data.nickName;
        this.goldLabel.string = data.gold;
        this.index = index;

        cc.loader.load({url:data.avatarUrl,type:'jpg'},(err,tex)=>{
            this.headImage.spriteFrame = new cc.SpriteFrame(tex,cc.Rect(0,0,tex.width,tex.height));
        });

        this.node.on('player_ready',(event)=>{
            let detail = event.detail;
            console.log('player ready detail = ' +detail);
            if(detail === this.accountID){
                this.readyIcon.active = true;
            }
        });

        if(index === 1){
            this.cardsNode.x *= -1;
            this.pushCardNode.x *= -1;
        }
    },

    pushCard(){
        this.cardsNode.active = true;
        console.log('playerNode position x = ',this.cardsNode.x );
        for(let i = 0;i<17;i++){
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.cardsNode;
            card.scale = 0.4;

            card.rotation = 90;
            // card.width = 59;
            // card.x  += 150 + i*20*-1;
            // card.skewY = -40;

            let height = card.height;
            card.y = (17-1) * 0.5 * height * 0.4 *0.3 -  height * 0.4 * 0.3 * i;
            this.cardList.push(card);
        }
    },
    pushOneCard(){
        // 实例化出预制体，设置parent，scale，rotaion，card.height
        let card = cc.instantiate(this.cardPrefab);
        card.parent = this.cardsNode;
        card.scale = 0.4;
        card.rotation = 90;
        let height = card.height;
        // 从上往下依序摆放牌
        card.y = (17-1) * 0.5 * height * 0.4 * 0.3 - this.cardList.height * height * 0.4 * 0.3 * i;
        this.cardList.push(card);

    },

    start () {

    },

    // update (dt) {},
});
