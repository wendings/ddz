import global from  './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        bottomLabel:cc.Label,
        rateLabel:cc.Label,
        roomIDLabel:cc.Label,
        playerNodePrefab:cc.Prefab,
        playerPosNode:cc.Node
    },

    onLoad () {
        this.playerNodeList = [];
        this.bottomLabel.string = '底：'+ global.playerData.bottom;
        this.rateLabel.string = '倍：' + global.playerData.rate;
        // 进入房间
        global.socket.requestEnterRoomScene((err,data)=>{
                if(err){
                    console.log('err = ' + err);
                }else{
                    console.log('enter room scene = ' +JSON.stringify(data));
                    //初始化
                    this.playerPosList = [];
                    this.initPlayerPos(data.seatIndex);
                    this.playerData = data.playerData;// 从服务器传过来的data.playerData 是个[]，那么承接他的this.playerData 也会是数组
                    let roomID = '房间：' + data.roomID;
                    this.roomIDLabel.string = roomID;
                    global.playerData.houseMangerID = data.houseManagerID;
                    console.log('gameScene houseMangerID = ',JSON.stringify(data.houseManagerID));
                    for(let i = 0;i<this.playerData.length;i++){
                        console.log('gameScene playerData i = '+ JSON.stringify(this.playerData[i]));
                        this.addPlayerNode(this.playerData[i]);
                    }

                }
                this.node.emit('init');
        });

        global.socket.onPlayerJoinRoom((data)=>{
            console.log(' on player join room data = ',JSON.stringify(data));
            this.addPlayerNode(data);
        });
        global.socket.onPlayerReady((data)=>{
            for(let i = 0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit('player_ready',data);
            }
        });
        global.socket.onGameStart(()=>{
            for (let i = 0 ; i < this.playerNodeList.length ; i ++){
                this.playerNodeList[i].emit('game-start');
            }
        });

        global.socket.onPushCard(()=>{
            console.log('game scene push card');
            for(let i = 0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit('push-card');
            }
        });
        global.socket.onCanRobMater((data)=>{
            for(let i = 0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit('can-rob-mater',data);
            }
        });
        global.socket.onPlayerRobState((data)=>{
            for(let i=0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit('rob-state',data);
            }
        });
        global.socket.onChangeMaster((data)=>{
            console.log('on change master = ' + data);
            // 保存地主ID
            global.playerData.masterID = data;
            for(let i = 0;i<this.playerNodeList.length;i++){
                let node = this.playerNodeList[i];
                node.emit('change-master',data);
                if(node.getComponent('playerNode').accountID === data){
                    // 发送地主的位置
                    this.node.emit('master-pos',node.position);
                }
            }
        });
        // 其他玩家为地主添加三张牌
        this.node.on('add-card-to-player',()=>{
            if(global.playerData.accountID !== global.playerData.masterID){
                for(let i = 0;i<this.playerNodeList.length;i++){
                    this.playerNodeList[i].emit('add-three-card',global.playerData.masterID);
                }
            }
        })
    },

    initPlayerPos(seatIndex){
        switch (seatIndex){
            case 0:
                this.playerPosList[0] = 0;
                this.playerPosList[1] = 1;
                this.playerPosList[2] = 2;
                break;
            case 1:
                this.playerPosList[1] = 0;
                this.playerPosList[2] = 1;
                this.playerPosList[0] = 2;
                break;
            case 2:
                this.playerPosList[2] = 0;
                this.playerPosList[0] = 1;
                this.playerPosList[1] = 2;
                break;
            default:
                break;
        }
        console.log('@@ fn  initPlayerPos  this.playerPosList = ',JSON.stringify(this.playerPosList));
    },
    addPlayerNode(data){
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        console.log('gameScene : data.seatIndex = ',data.seatIndex);
        playerNode.getComponent('playerNode').initWithData(data,this.playerPosList[data.seatIndex]);
        playerNode.position = this.playerPosNode.children[this.playerPosList[data.seatIndex]].position;
        this.playerNodeList.push(playerNode);
    }

    // update (dt) {},
});
