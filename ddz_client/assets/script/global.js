import SocketController from './data/socket-controller'
import PlayerData from './data/player-data'
const global = {} || global;
global.socket = SocketController();
global.playerData = PlayerData();
export default global; //导出模块