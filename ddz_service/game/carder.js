const Card = require('./card');
// 牌值
const CardValue = {
    'A':12,
    '2':13,
    '3':1,
    '4':2,
    '5':3,
    '6':4,
    '7':5,
    '8':6,
    '9':7,
    '10':8,
    'J':9,
    'Q':10,
    'K':11
};
//花色
// 黑桃：spade
// 红桃：heart
// 梅花：club
// 方片：diamond
const CardShape = {
    'S':1,
    'H':2,
    'C':3,
    'D':4
};
// 大小王
const Kings = {
    'k':14,
    'K':15
};
module.exports = function () {
    let that = {};
    let _cardList = [];
    const createCards = function () {
        let cardList = [];
        for(let i in CardValue){
            for(let j in CardShape){
                let card = Card(CardValue[i],CardShape[j],0);
                card.id = cardList.length;
                cardList.push(card)
            }
        }
        for(let i in Kings){
            let card = Card(undefined,undefined,Kings[i]);
            card.id = cardList.length;
            cardList.push(card);
        }
        cardList.sort((a,b)=>{
            return (Math.random()>0.5)? -1:1;
        });
        return cardList;
    };
    //创建卡牌
    _cardList = createCards();

    that.getThreeCards = function () {
        let threeCardsMap = {};
        for(let i = 0;i<17;i++){//每个玩家发17张牌
            for(let j = 0;j<3;j++){//3个玩家轮流发牌
                if(threeCardsMap.hasOwnProperty(j)){
                    threeCardsMap[j].push(_cardList.pop())
                }else{
                    threeCardsMap[j] = [_cardList.pop()];
                }
            }
        }
        return [threeCardsMap[0],threeCardsMap[1],threeCardsMap[2],_cardList];
    };

    // 牌型Key：{name：牌型（首字母大写，value：权重比 Ps:大的可以压过小的），}
    const CardsValue = {
        'one': {
            name: 'One',
            value: 1
        },
        'double': {
            name: 'Double',
            value: 1
        },
        'three': {
            name: 'Three',
            value: 1
        },
        'boom': {
            name: 'Boom',
            value: 2
        },
        'threeWithOne': {
            name: 'ThreeWithOne',
            value: 1
        },
        'threeWithTwo': {
            name: 'ThreeWithTwo',
            value: 1
        },
        'plane': {
            name: 'Plane',
            value: 1
        },
        'planeWithOne': {
            name: 'PlaneWithOne',
            value: 1
        },
        'planeWithTwo': {
            name: 'PlaneWithTwo',
            value: 1
        },
        'scroll': {
            name: 'Scroll',
            value: 1
        },
        'doubleScroll': {
            name: 'DoubleScroll',
            value: 1
        }
    };
    // 是否是单牌
    const isOneCard = function (cardList) {
        if(cardList.length === 1){
            return true;
        }
        return false;
    };
    // 是否是对子
    const isDouble = function (cardList) {
        // 对子是2张牌
        if(cardList.length === 2){
             // value 不是undefined（大小王） && 牌1.value === 牌2.value
            if(cardList[0].value !== undefined && cardList[0].value === cardList[1].value){
                return true;
            }
        }
        return false;
    };
    // 是否是三张
    const isThree = function(cardList){
        if(cardList.length === 3){
           let map = {};
           for(let i = 0;i<cardList.length;i++){
               if(map.hasOwnProperty(cardList[i].value)){
                   map[cardList[i].value]++;
               }else {
                   map[cardList[i].value] = 1;
               }
           }
           if(map[cardList[0].value]===3){
               return true;
           }
        }
        return false;
    };
    // 炸弹1：王炸
    const isKingBoom = function (cardList) {
        if(cardList.length !== 2){
            return false;
        }
        if(cardList[0].king !== undefined && cardList[1].king !== undefined){
            return true;
        }
        return false;
    };
    // 炸弹2：普通炸弹
    const isFourBoom = function (cardList) {
        if(cardList.length === 4){
            let map = {};
            for(let i = 0;i<cardList.length;i++){
                if(map.hasOwnProperty(cardList[i])){
                    map[cardList[i].value]++;
                }else{
                    map[cardList[i].value] = 1;
                }
            }
            if(map[cardList[0].value] === 4){
                return true;
            }
        }
        return false;
    }
    // 判断是否是炸弹 王炸 or 普通炸弹
    const isBoom = function (cardList) {
        if(isKingBoom(cardList)){
            return true;
        }
        if(isFourBoom(cardList)){
            return true;
        }
        return false;
    };
    // 判断是否是3带1
    const isThreeWithOne = function (cardList) {
        if(cardList.length === 4){
            let map = {};
            for(let i = 0;i<cardList.length;i++){
                let key = -1;
                if(cardList[i].value === undefined){
                    key = cardList[i].king;
                }else{
                    key = cardList[i].value;
                }

                console.log('key = ' + key);
                if(map.hasOwnProperty(key)){
                    map[key] ++;
                }else {
                    map[key] = 1;
                }
            }

            let count = 0;
            let maxNum = -1;
            for(let i in map){
                count ++;
                if(maxNum<map[i]){
                    maxNum = map[i];
                }
            }
            if(count === 2 && maxNum === 3){
                return true;
            }
        }
        return false;
    };

    // 判断是否是3带2
    const isThreeWithTwo = function (cardList) {
      if(cardList.length === 5){
          for(let i = 0;i<cardList.length;i++){
              let key = -1;
              if(cardList[i].value === undefined){
                  key = cardList[i].king;
              }else{
                  key = cardList[i].value;
              }
              if(map.hasOwnProperty(key)){
                  map[key] ++;
              }else {
                  map[key] = 1;
              }
          }
          // map = {
          //     '4': 4,
          //     '1': 1
          // }

          let count = 0;
          let maxNum = 1;
          for(let i in map){
              count++;
              if(maxNum<map[i]){
                  maxNum = map[i];
              }
          }
          if(count === 2 && maxNum === 3){
              return true;
          }
      }
      return false;
    };
    // 是否是飞机
    const isPlane = function (cardList) {
        if(cardList.length === 6){
            let map = {};
            for(let i = 0;i<cardList.length;i++){
                if(map.hasOwnProperty(cardList[i].value)){
                    map[cardList[i].value] ++;
                }else{
                    map[cardList[i].value] = 1;
                }
            }
            // 获得map中的key 并生成一个新的数组
            let keys = Object.keys(map);
            if(keys.length === 2){
                for(let i in map){
                    if(map[i] !== 3){
                        return false;
                    }
                }
                //  排除下面数据类型
                // {
                //     '3': 3,
                //     '5': 3
                // }
                if(Math.abs(Number(keys[0])) - Math.abs(Number(keys[1])) === 1){
                    return true;
                }
            }else{
                return false;
            }
        }
        return false;
    };

    const isPlaneWithOne = function (cardList) {
        if(cardList.length === 8){
            let map = {};
            for(let i = 0;i<cardList.length;i++){
                let key = -1;
                if(cardList[i].value === undefined){
                    key = cardList[i].king;
                }else{
                    key = cardList[i].value;
                }

                if(map.hasOwnProperty(key)){
                    map[key]++;
                }else{
                    map[key] = 1;
                }
            }

            console.log('map = ' + JSON.stringify(map));

            let keys = Object.keys(map);
            if(keys.length !== 4){
                console.log('key 的长度不为4');
                return false;
            }

            let oneCount = 0;
            let threeList = [];
            for(let i in map){
                if(map[i] === 3){
                    threeList.push(map[i]);
                }
                if(map[i] === 1){
                    oneCount++;
                }
            }
            console.log('one count = ' + oneCount);
            console.log('three list = ' + JSON.stringify(threeList));
            if(threeList.length !== 2 || oneCount !==2){
                return false;
            }
            if(Math.abs(Number(threeList[0])) - Math.abs(Number(threeList[1])) === 1){
                return true;
            }
        }
        console.log('length not 8');
        return false;
    };
    // 判断是否是飞机带2翅膀
    const isPlaneWithTwo = function (cardList) {
        if(cardList.length === 10){
            let map = {};
            for(let i = 0;i<cardList.length;i++){
                let key = -1;
                if(cardList[i].king === undefined){
                    key = cardList[i].value;
                }else{
                    key = cardList[i].king;
                }

                if(map.hasOwnProperty(map[key])){
                    map[key]++;
                }else {
                    map[key] = 1;
                }
            }

            let keys = Object.keys(map);
            if(keys.length !== 4){
                return false;
            }
            let twoCount = 0;
            let threeList = [];
            for(let i in map){
                if(map[i] === 3){
                    threeList.push(map[i]);
                }
                if(map[i] === 2){
                    twoCount++;
                }
            }
            if(threeList.length !==2 || twoCount !== 2){
                return false;
            }

            if(Math.abs(Number(threeList[0])) - Math.abs(Number(threeList[1])) === 1){
                return true;
            }
        }
        return false;
    };
    //判断是否是顺子
    const isScroll = function(cardList){
        if(cardList.length>=5){
            cardList.sort((a,b)=>{
                return a.value - b.value;
            });
            for(let i = 0;i<(cardList.length - 1);i++){
                if(Math.abs(cardList[i].value - cardList[i+1].value) !== 1){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    // 判断是否是连队（双顺子）
    const isDoubleScroll = function (cardList) {
        if(cardList.length >= 6){
            let map = {};
            for(let i = 0;i<cardList.length;i++){
                if(map.hasOwnProperty(cardList[i].value)){
                    map[cardList[i].value]++;
                }else{
                    map[cardList[i].value] = 1;
                }
            }

            for(let i in map){
                if(map[i]!==2){
                    return false;
                }
            }
            let keys = Object.keys(map);

            keys.sort((a,b)=>{
                return Number(a) - Number(b);
            });
            for (let i = 0;i<(keys.length-1);i++){
                if(Math.abs(Number(keys[i] - Number(keys[i+1]))) !== 1){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    // 判断牌型
    const  getCardsValue = function (cardList) {
        if(isOneCard(cardList)){
            console.log('单张牌');
            return CardsValue.one;
        }
        if(isDouble(cardList)){
            console.log('一对牌');
            return CardsValue.double;
        }
        if(isThree(cardList)){
            console.log('三张牌');
            return CardsValue.three;
        }
        if(isBoom(cardList)){
            console.log('炸弹');
            return CardsValue.boom;
        }
        if(isThreeWithOne(cardList)){
            console.log('三带一');
            return CardsValue.threeWithOne;
        }
        if(isThreeWithTwo(cardList)){
            console.log('三带二');
            return CardsValue.threeWithTwo;
        }
        if(isPlane(cardList)){
            console.log('飞机');
            return CardsValue.plane;
        }
        if(isPlaneWithOne(cardList)){
            console.log('飞机带1翅膀');
            return CardsValue.planeWithOne;
        }
        if(isPlaneWithTwo(cardList)){
            console.log('飞机带2翅膀');
            return CardsValue.planeWithTwo;
        }
        if(isScroll(cardList)){
            console.log('顺子');
            return CardsValue.scroll;
        }
        if(isDoubleScroll(cardList)){
            console.log('连队');
            return CardsValue.doubleScroll;
        }
        return false;
    };

    that.isCanPushCards = getCardsValue;

    

    that.compare = function (a,b) {
      let cardsValueA = getCardsValue(a);
      let cardsValueB = getCardsValue(b);

      if(cardsValueA.value > cardsValueB.value){ //a.value(权重) > b.value(权重)
          return true;
      }else if(cardsValueA.value === cardsValueB.value){
          // 牌型名字相等（比如单牌，飞机，顺子等牌型）
          if(cardsValueA.name === cardsValueB.name){

              let str= 'compare' + cardsValueA.name;
              console.log('str = ' + str);

              let method = that[str];

              let  result = method(a,b);
              if(result === true){
                  return true;
              }else{
                  return '不合适的牌型';
              }
          }else{
              return '不合适牌型';
          }
      }
      return '你的牌太小';

    };

    // tips 获取王炸
    const getKingBoom = function (cardList) {
        let list = [];
        for(let i = 0;i<cardList.length;i++){
            let card = cardList[i];
            if(card.king !== undefined){
                list.push(card);
            }
        }
        if(list.length === 2){
            return list;
        }else{
            return false;
        }
    };

    // tips 获取4张牌炸弹
    const  getFourBoom = function (cardList) {
        let list = getRepeatCardsList(4,cardList);
        console.log('get four boom = ' + JSON.stringify(list));
        if(list.length === 0){
            return false;
        }
        return list;
    }

    //获取重复次数为num 的牌的列表的组合
    const getRepeatCardsList = function (num,cardsB) {
        let map = {};
        for(let i = 0;i<cardsB.length;i++){
            let key = -1;
            if(cardsB[i].king === undefined){
                key = cardsB[i].value;
            }else{
                key = cardsB[i].king;
            }

            if(map.hasOwnProperty(key)){
                map[key].push(cardsB[i]); // map ={ '3':[{card},{card}]}
            }else{
                map[key] = [cardsB[i]];   // map ={ '3':[{card}]} 新增元素
            }
        }
        var list = [];
        for(let i in map){
            if(map[i].length === num){
                let l = [];
                for(let j = 0;j<num;j++){
                    l.push(map[i][j]);
                }
                list.push(l);
            }
        }
        console.log('list = ' + JSON.stringify(list));

        return list;
    };

    // 单张牌提示
    that.tipsOne = function (cardA,cardsB) {
        let map = getCardListWithStart(cardA[0].value,cardsB);
        let list = [];
        for(let i in map){
            list.push(map[i]);
        }

        let kingBoom = getKingBoom(cardsB);
        if(kingBoom !== false){
            list.push(kingBoom);
        }
        let fourBoomList = getFourBoom(cardsB);
        if(fourBoomList !== false){
            for(let i = 0;i<fourBoomList.length;i++){
                list.push(fourBoomList[i]);
            }
        }
        console.log(' tips one list = ' +JSON.stringify(list));
        return list;
    };

    // 对子提示
    that.tipsDouble = function (cardsA,cardsB) {
        let list = getRepeatCardsList(2,cardsB);
        let cardsList = [];
        for(let i = 0;i<list.length;i++){
            if(list[i][0].value > cardsA[0].value){
                cardsList.push(list[i]);
            }
        }
        console.log(' cards list = ' +JSON.stringify(cardsList));
        let kingBoom = getKingBoom(cardsB);
        if(kingBoom !== false){
            cardsList.push(kingBoom);
        }
        let fourBoomList = getFourBoom(cardsB);
        if(fourBoomList !== false){
            for(let i = 0;i<fourBoomList.length;i++){
                cardsList.push(fourBoomList[i]);
            }
        }
        return cardsList;
    };
    
    //提示 3张
    that.tipsThree = function (cardsA,cardsB) {
        let list = getRepeatCardsList(3,cardsB);
        console.log(' list = ' +JSON.stringify(list));
        let cardsList = [];
        for(let i = 0;i<list.length;i++){
            if(list[i][0].value > cardsA[0].value){
                cardsList.push(list[i]);
            }
        }
        let kingBoom = getKingBoom(cardsB);
        if(kingBoom !== false){
            cardsList.push(kingBoom);
        }
        let fourBoomList = getFourBoom(cardsB);
        if(fourBoomList !== false){
            for(let i = 0;i<fourBoomList.length;i++){
                cardsList.push(fourBoomList[i]);
            }
        }
        console.log(' tips three cards list = ' + JSON.stringify(cardsList));
        return cardsList;
    };

    that.tipsBoom = function (cardsA,cardsB) {
        let cardsList = [];
        if(cardsA.length === 2){
            return cardsList;
        }else{
            let list = getRepeatCardsList(4,cardsB);
            for(let i = 0;i<list.length;i++){
                if(list[i][0].value > cardsA[0].value){
                    cardsList.push(list[i]);
                }
            }
        }

        let result = getKingBoom(cardsB);
        if(result !== false){
            cardsList.push(result);
        }

        return cardsList;
    };
    // 获得重复的牌
    const getRepeatValue = function (num,cardList) {
        let map = {};
        for(let i = 0;i<cardList.length;i++){
            if(map.hasOwnProperty(cardList[i].value)){
                map[cardList[i].value].push(cardList[i]);
            }else{
                map[cardList[i].value] = [cardList[i]];
            }
        }
        for(let i in map){
            if(map[i].length === num){
                return Number(i); // 返回下标
            }
        }
    };
    // 获得3带几的数组
    const getThreeWithNumCardsList = function (num,cardsA,cardsB){
        let valueA = getRepeatValue(3,cardsA); // 获得重复的牌
        let list = getRepeatCardsList(3,cardsB);  // 获得重复牌数组
        let cardList = [];
        for(let i = 0;i<list.length;i++){
            if(list[i][0].value > valueA){
                cardList.push(list[i]); // 获得比 a 大的三张牌
            }
        }

        let oneList = getRepeatCardsList(num,cardsB);
        let minNum = 100;
        let oneCard = undefined;
        // 取得最小的牌
        for(let i = 0;i<oneList.length;i++){
            if(oneList[i][0].value <minNum){
                minNum = oneList[i][0].value;
                oneCard = oneList[i];
            }
        }

    }


    // 单牌提示方法，从某个值开始，获取剩下的牌的列表的组合
    const getCardListWithStart = function (start,cards) {

        console.log('start = ' + start);
        cards.sort((a,b)=>{
           return a.value - b.value;
        });
        // 找出比start大的牌
        let list = [];
        for(let i = 0;i<cards.length;i++){
            let key = -1;
            if(cards[i].king === undefined){
                key = cards[i].value;
            }else{
                key = cards[i].king;
            }
            if(key > start){
                list.push(cards[i]);
            }
        }

        let map = {};
        for(let i = 0;i<list.length;i++){
            let key = -1;
            if(list[i].king === undefined){
                key = list[i].value;
            }else{
                key = list[i].king;
            }
            if(map.hasOwnProperty(key)){

            }else{
                map[key] = [list[i]];
            }
        }
        return map;
    };

    // 获得出牌提示
    that.getTipsCardsList = function (cardsA,cardsB) {
        if(cardsA === undefined){ // 全场第一个出牌
            let list = [];
            let map = getCardListWithStart(0,cardsB);
            for(let i in map){
                list.push(map[i]);
            }
            return list;
        }else{

            let cardsValue = getCardsValue(cardsA);
            let name = cardsValue.name;
            let str = 'tips' + name;
            console.log('@@@ 提示牌 str = ' + str);
            let method = that[str];
            return method(cardsA,cardsB);
        }
    };
    
    return that;
}