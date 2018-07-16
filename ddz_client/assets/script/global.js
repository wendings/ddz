import SocketController from './data/socket-controller'
const global = {} || global;
global.socket = SocketController();
export default global; //导出模块