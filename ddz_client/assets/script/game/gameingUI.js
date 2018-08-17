import  global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        gameingUI:cc.Node,
        cardPrefab:cc.Prefab,
        playerCardPos:cc.Node,
        robUI:cc.Node,
        playUI:cc.Node,
        tipsLabel:cc.Node,
        pushCardNode:cc.Node,
        noPushCardButton:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bottomCards = [];
        let bottomCardData = [];
        this.cardList = [];
        this.chooseCardDataList = [];
        this.tipsCardsList = [];
        this.tipsCardsIndex = 0;

        global.socket.onPushCard((data)=>{
            console.log('@@@@ gameingUI push card' + JSON.stringify(data));
            this.pushCard(data);
        });

        global.socket.onCanRobMater((data)=>{
           console.log('@@@ gameUI Can Rob Mater data = ',JSON.stringify(data));
           if(global.playerData.accountID === data){
               this.robUI.active = true;
           }
        });
        global.socket.onShowBottomCard((data)=>{
            console.log('show bottom card = ' +JSON.stringify(data));
            bottomCardData = data;
            for(let i = 0;i<data.length;i++){
                let card = this.bottomCards[i];
                card.getComponent('card').showCard(data[i]);
            }
            //动画
            this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
                let index = 0;
                // a :add-card-to-player
                const  runActionCb = ()=>{
                    index ++;
                    if(index ===3){
                        this.node.emit('add-card-to-player');
                        //ps: 1、自己是地主牌给自己动画 2、地主是其他玩家 牌给他人
                    }
                };
                // b: for(this.bottomCards.length)  掉用 runCardAction---处理卡牌摆放位置，缩放比例
                for(let i=0;i<this.bottomCards.length;i++){
                    let card = this.bottomCards[i];
                    let width = card.width;
                    this.runCardAction(card,cc.p( (this.bottomCards.length-1) * -0.5 *width*0.7 +width *0.7 *i,240 ),runActionCb);
                }
            })))
        });
        global.socket.onCanPushCard((data)=>{
           console.log('on can push card = ' +JSON.stringify(data));
           if(data.uid === global.playerData.accountID){
               this.playUI.active = true;
               this.chooseCardDataList = [];
           }
        });

        this.node.on('master-pos',(event)=>{
            let detail = event.detail;
            this.masterPos = detail;
        });
        //监听add-card-to-player 如果自己是地主
        // for（）实例化卡牌，设置摆放位置，将底牌放入this.cardList中
        this.node.on('add-card-to-player',()=>{
            if(global.playerData.accountID === global.playerData.masterID){
                for(let i = 0;i<bottomCardData.length;i++){
                    let card = cc.instantiate(this.cardPrefab);
                    card.parent = this.gameingUI;
                    card.scale = 0.8;
                    card.x = 100 + card.width * 0.4 * (17-1) * -0.5 +card.width * 0.4 * this.cardList.length;
                    card.y = -250;
                    card.getComponent('card').showCard(bottomCardData[i],global.playerData.masterID);
                    this.cardList.push(card);
                }
                this.sortCards();
            }
        });

        this.node.on('choose-card',(event)=>{
           let detail = event.detail;
           this.chooseCardDataList.push(detail);
        });

        this.node.on('un-choose-card',(event)=>{
           let detail = event.detail;
           for(let i = 0;i<this.chooseCardDataList.length;i++){
               if(this.chooseCardDataList[i].id === detail.id){
                   console.log('取消选择牌' + detail.id);
                   this.chooseCardDataList.splice(i,1);
               }
           }
        });

    },

    runCardAction(card,pos,cb){
        let moveAction = cc.moveTo(0.5,pos);
        let scaleAction = cc.scaleTo(0.5,0.6);
        card.runAction(scaleAction);
        card.runAction(cc.sequence(moveAction,cc.callFunc(()=>{
            if(cb){
                cb();
            }
        })));
    },

    sortCards () {
        // 排序
        this.cardList.sort(function (x,y) {
            let a = x.getComponent('card').cardData;
            let b = y.getComponent('card').cardData;
            if(a.hasOwnProperty('value') && b.hasOwnProperty('value')){
                return b.value - a.value;
            }
            if(a.hasOwnProperty('king') && !b.hasOwnProperty('king')){
                return -1;
            }
            if(!a.hasOwnProperty('king') && b.hasOwnProperty('king')){
                return 1;
            }
            if(a.hasOwnProperty('king') && b.hasOwnProperty('king')){
                return b.king - a.king;
            }
        });
        // 设置zIndex层级和x位置
        let x = this.cardList[0].x;
        for(let i = 0;i<this.cardList.length;i++){
            let card = this.cardList[i];
            card.zIndex = i;
            card.x = x + card.width * 0.4 * i;
        }
        // 调用referCardsPos();刷新位置
        this.referCardsPos();
    },

    pushCard(data){
        if(data){
            data.sort((a,b)=>{
                if(a.hasOwnProperty('value') && b.hasOwnProperty('value')){
                    return b.value - a.value;
                }
                if(a.hasOwnProperty('king') && !b.hasOwnProperty('king')){
                    return -1;
                }
                if(!a.hasOwnProperty('king') && b.hasOwnProperty('king')){
                    return 1;
                }
                if(a.hasOwnProperty('king') && b.hasOwnProperty('king')){
                    return b.king - a.king;
                }
            });

            for(let i = 0;i<data.length;i++){
                let card = cc.instantiate(this.cardPrefab);
                card.parent = this.gameingUI;
                card.scale = 0.8;
                card.x = 100 + card.width * 0.4 * (17-1) * -0.5 + card.width * 0.4 * i;
                card.y = -250;
                card.getComponent('card').showCard(data[i],global.playerData.accountID);
                this.cardList.push(card);
            }

            for(let i = 0;i<3;i++){
                let card = cc.instantiate(this.cardPrefab);
                card.parent = this.gameingUI;
                card.scale = 0.8;
                card.y = 100;
                card.x = (card.width * 0.8 +20) * (3-1) * -0.5 + (card.width * 0.8 + 20) * i;
                this.bottomCards.push(card);
            }
        }
    },

    onButtonClick:function (event,customData) {
      switch(customData){
          case 'rob':
              console.log('@@@ user '+ global.playerData.accountID + " choose rob master 抢");
              global.socket.notifyRobState('ok');
              this.robUI.active = false;
              break;

          case 'no-rob':
              console.log(' user '+ global.playerData.accountID + " not choose rob master 不抢");
              global.socket.notifyRobState('no-ok');
              this.robUI.active = false;
              break;
          case 'no-push':
              console.log('gameingUI player no-push');
              global.socket.requestPlayerPushCard([],()=>{
                  console.log('gameingUI player no push card');
              });
              this.playUI.active = false;
              break;
          case 'tip':
              console.log('gameingUI player tip 提示');

              if(this.tipsCardsList.length === 0){
                  global.socket.requestTipsCards((err,data)=>{
                      if(err){

                      }else{
                          console.log('data = ' +JSON.stringify(data));
                          this.tipsCardsList = data.data;
                          console.log(' this.tipsCardsList =  ' + JSON.stringify(this.tipsCardsList));
                          this.showTipsCards(this.tipsCardsList);
                      }
                  })
              }else{
                  this.showTipsCards(this.tipsCardsList);
              }
              break;
          case  'ok-push':
              console.log('gameingUI player ok-push');
              // 发送数据到服务器 request
              if(this.chooseCardDataList.length === 0){
                  return;
              }
              global.socket.requestPlayerPushCard(this.chooseCardDataList,(err,data)=>{
                  console.log('err = '+ err);
                  if(err){
                      console.log(' push card err = ' + err );
                      if(this.tipsLabel.string ===''){
                          this.tipsLabel.string = err;
                          setTimeout(()=>{
                              this.tipsLabel.string = '';
                          },2000);
                      }
                      // 牌复位
                      for(let i = 0; i<this.cardList.length;i++){
                          this.cardList[i].emit('init-y',this.chooseCardDataList);
                      }
                      this.chooseCardDataList = [];
                  }else{

                      console.log('choose card data list = ' +JSON.stringify(this.chooseCardDataList));
                      // 出的牌放置在桌面中心 ps：node.emit()实现
                      for(let i = 0;i<this.cardList.length;i++){
                          this.cardList[i].emit('pushed-card',this.chooseCardDataList);
                      }
                      // 剔除cardList中已出的牌
                      for(let i = 0;i<this.chooseCardDataList.length;i++){
                          let cardData = this.chooseCardDataList[i];
                          for(let j = 0;j<this.cardList.length;j++){
                              let card = this.cardList[j];
                              if(card.getComponent('card').id === cardData.id){
                                  this.cardList.splice(j,1);
                              }
                          }
                      }

                      console.log('push card data = ' + JSON.stringify(data));
                      this.playUI.active = false;
                      this.chooseCardDataList = [];
                      this.referCardsPos();
                  }
              });

              break;
          default:
              break;
      }
    },
    //展示提示
    showTipsCards(cardList){
        if(cardsList.lenth === 0){
            if(this.tipsLabel.string === ''){
                this.tipsLabel.string  = '你没有大过上家的牌';
                setTimeout(()=>{
                    this.tipsLabel.string = '';
                },2000);
            }
            return;
        }

        let cards = cardList[this.tipsCardsIndex];
        //1、 提示牌先init-y 初始化
        for(let i = 0;i<this.cardList.length;i++){
            this.cardList[i].emit('init-y');
        }
        // 2、提示牌发送消息给card
        for(let i = 0;i<this.cardList.length;i++){
            this.cardList[i].emit('tips-card',cards);
        }
        // 标识位--提示牌索引控制处理
        this.tipsCardsIndex ++;
        if(this.tipsCardsIndex >= cardList.length){
            this.tipsCardsIndex = 0;
        }

    },
    // 刷新牌的位置
    referCardsPos(){
        for(let i = 0;i<this.cardList.length;i++){
            let card = this.cardList[i];
            let width = card.width;
            card.x = 100 + (this.cardList.length-1) * width * 0.4 * -0.5 + width * 0.4 * i;
        }
    }


    // update (dt) {},
});
