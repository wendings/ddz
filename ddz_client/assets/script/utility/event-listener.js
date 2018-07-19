const EventListener = function (obj) {
    // const that = {};
    let Register = {};
    obj.on = function (type, method) {
        if (Register.hasOwnProperty(type)){
            Register[type].push(method);
        }else {
            Register[type] = [method];
        }
    };
    obj.fire = function (type) {
        if (Register.hasOwnProperty(type)){
            let handlerList = Register[type];
            for (let i = 0 ; i < handlerList.length ; i ++){
                let handler = handlerList[i];
                let args = [];
                for (let j = 1 ; j < arguments.length ; j ++){
                    args.push(arguments[j]);
                }
                handler.apply(this, args);
            }
        }
    };
    obj.removeListener = function (type) {
        Register[type] = [];
    };
    obj.removeAllListeners = function () {
        Register = {};
    };

    return obj;
};
export default EventListener;