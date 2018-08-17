import global from "../../global";
cc.Class({
    extends: cc.Component,

    properties: {
        cardsSpriteAtlas:cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.flag = false;
        this.offset = 20;
        // 牌复位
        this.node.on('init-y',()=>{
            if(this.flag){
                this.node.y -= this.offset;
                this.flag = false;
                cc.systemEvent.emit('un-choose-card',this.cardData);
            }
        });
        // 打出去的牌到中心
        this.node.on('pushed-card',(event)=>{
            let detail = event.detail;
            console.log('push-card' + JSON.stringify(detail));
            for(let i = 0;i<detail.length;i++){
                if(detail[i].id === this.id){
                    this.runToCenter(this.node);
                    this.runToCenter(this.node);
                }
            }
        });
        // 提示牌盾起+1，发送choose-card 让提示牌添加到chooseCardDataList
        this.node.on('tips-card',(event)=>{
            let detail = event.detail;
            for(let i = 0;i<detail.length;i++){
                let card = detail[i];
                if(card.id === this.id){
                    if(this.flag === false){
                        this.node.y += 20;
                        this.flag = true;
                        cc.systemEvent.emit('choose-card',this.cardData);
                    }
                }
            }
        })
    },
    runToCenter(node){
      let moveAction = cc.moveTo(0.3,cc.p(0,0));
      let scaleAction = cc.scaleTo(0.3,0.3);
      let seq = cc.sequence(scaleAction,cc.callFunc(()=>{
          this.node.destroy();
      }));
      node.runAction(moveAction);
      node.runAction(seq);
    },

    start () {

    },
    setTouchEvent(){
        if(this.accountID === global.playerData.accountID){
           this.node.on(cc.Node.EventType.TOUCH_START,()=>{
              console.log('touch '+this.id);
              if(this.flag === false){
                  this.node.y += 20;
                  this.flag = true;
                  cc.systemEvent.emit('choose-card',this.cardData);
              }else{
                  this.node.y -= 20;
                  this.flag = false;
                  cc.systemEvent.emit('un-choose-card',this.cardData);
              }
           });
        }
    },

    showCard(card,accountID){
        if(accountID){
            this.accountID = accountID;
        }
        this.id = card.id;
        this.cardData = card;
        console.log('card = ' +JSON.stringify(card));
        // 解析普通牌
        const CardValue = {
            '12':1,
            '13':2,
            '1':3,
            '2':4,
            '3':5,
            '4':6,
            '5':7,
            '6':8,
            '7':9,
            '8':10,
            '9':11,
            '10':12,
            '11':13
        };
        // 解析花色
        const  cardShpae = {
            '1':3,
            '2':2,
            '3':1,
            '4':0
        };
        //解析大小王
        const Kings = {
            '14':54,
            '15':53
        }
        let spriteKey = '';
        if(card.shape){ // 普通牌str
            //          图片名称    花色（倍率：1,2,3,4）*13     牌值
            spriteKey = 'card_' + (cardShpae[card.shape] * 13 + CardValue[card.value] );
            // console.log('图片： card_'+ 'cardShpae['+card.shape+'] * 13 = ' + cardShpae[card.shape] * 13 + ', CardValue['+card.value+'] =' + CardValue[card.value]);

        }else{ //大小王str
            spriteKey = 'card_'+Kings[card.king];
        }
        console.log('sprite key = ' + spriteKey);
        this.node.getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(spriteKey);
        this.setTouchEvent();
    }

    // update (dt) {},
});
