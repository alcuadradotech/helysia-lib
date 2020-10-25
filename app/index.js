import Helysia from './helysia';

(function(window){
    let _init = async (params)=> {
        return await Helysia.init(params);
    }
    let _getAccount = async () => Helysia.getAccount();
    let _getBalance = async () => Helysia.getBalance();
    let _getEthBalance = async () => Helysia.getEthBalance();
    let _getPrice = async (type, amount) => Helysia.getPrice(type, amount);
    let send = async (to, amount) => Helysia.send(to, amount);
    
    window.Helysia = {
        init: _init,
        getAccount: _getAccount,
        getBalance: _getBalance,
        getEthBalance: _getEthBalance,
        getPrice: _getPrice,
        send: send
    }
})(window)