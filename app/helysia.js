"use strict";

import { addresses } from './addresses';
import { getPrice } from './price.js';
import { getAbi } from './abis';
import { i18n } from './i18n';

const Helysia = {};

Helysia.init = async (params) => {
    const { adds, chainId, recipientAccount, lang } = params;
    // check recipient account
    if (!recipientAccount) {
        throw new Error("no-recipient-account");
    }
    // setup i18n
    Helysia.i18n = i18n(lang);

    // Checking if Web3 has been injected by the browser
    if (typeof ethereum !== "undefined") {
        // Enable to enable the ethereum provider
        try {
            await ethereum.enable();
        } catch (e) {
            throw new Error(Helysia.i18n.ethereum_user_cancel);
        }
        
        // reload page when network or account change
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log("accounts", accounts);
            location.reload();
        });
        
        window.ethereum.on('networkChanged', function (networkId) {
            console.log("networkId", networkId);
            location.reload();
        });
        
        // Use the browser's ethereum provider
        try {
            Helysia.web3 = await new Web3(ethereum);            
        } catch (e) {
            throw new Error(Helysia.i18n.no_web3);
        }
        
        const currentChainId = await Helysia.web3.eth.getChainId();
        
        if (currentChainId !== chainId) {
            throw new Error(Helysia.i18n.wrong_network);
        }
    } else {
        throw new Error(Helysia.i18n.no_ethereum);
    }
    
    // setup addresess
    adds ? Helysia.adds = adds : Helysia.adds = addresses(chainId.toString());
    // setup recipient account
    Helysia.recipientAccount = recipientAccount;

    
    // setup user and token data
    let userAccount, userAccountShort, ethBalance, helysiaBalance,
    helysiaPrice, gasAmount;
    try {
        userAccount = await Helysia.getAccount();
        userAccountShort = `${userAccount.substring(0, 6)}…${userAccount.substring(38, 42)}`;
        ethBalance = await Helysia.getEthBalance();
        helysiaBalance = await Helysia.getBalance();
        helysiaPrice = await Helysia.getPrice();
        // calculate the estimated gas of transfering a token (to check against eth balance)
        const tokenContract = await Helysia.getContract('tokenContract');
        const gas = await Helysia.web3.eth.estimateGas({
            "value": '0x0', // Only tokens
            "data": tokenContract.methods.transfer('0x0000000000000000000000000000000000000000', '0x1').encodeABI(),
            "from": '0x0000000000000000000000000000000000000000',
            "to": '0x0000000000000000000000000000000000000000'
        });
        const gasPrice = await Helysia.web3.eth.getGasPrice();
        const gasPriceBN = Helysia.web3.utils.toBN(gasPrice);
        const gasBN = Helysia.web3.utils.toBN(gas);
        gasAmount = parseFloat(Helysia.web3.utils.fromWei(gasPriceBN.mul(gasBN))) * 1.1;
    } catch (error) {
        throw new Error(Helysia.i18n.init_error);
    }
    
    console.log("initialized", Helysia.adds.daoUrl);
    
    return {
        userAccount,
        userAccountShort,
        ethBalance,
        helysiaBalance,
        helysiaPrice,
        gasAmount
    };
}

Helysia.getAccount = async () => {
    let accounts;    
    try { accounts = await Helysia.web3.eth.getAccounts() }
    catch (e) { throw e }
    
    return accounts[0];
}

Helysia.getRecipientAccount = () => {    
    return Helysia.recipientAccount;
}

Helysia.getPrice = async (type) => {
    let price;
    try {
        price = await getPrice(Helysia, type);
    } catch (error) {
        console.log(error);
        throw new Error('no-price')
    }
    return price;
}

Helysia.getBalance = async () => {
    let balance = 0;
    try {        
        // get account
        const account = await Helysia.getAccount();
        // get token contract
        const tokenContract = await Helysia.getContract('tokenContract');
        // get balance (in wei)
        const weiBalance = await tokenContract.methods.balanceOf(account).call();
        // convert to eth
        balance = parseFloat(Helysia.web3.utils.fromWei(weiBalance)).toFixed(2);
    } catch (error) {
        throw error;
    }
    
    return balance;
}

Helysia.getEthBalance = async () => {
    let balance = 0;
    try {        
        // get account
        const account = await Helysia.getAccount();
        // get balance (in wei)
        const weiBalance = await Helysia.web3.eth.getBalance(account);
        // convert to eth
        balance = parseFloat(Helysia.web3.utils.fromWei(weiBalance)).toFixed(2);
    } catch (error) {
        throw error;
    }
    
    return balance;
}

Helysia.send = async (amount) => {
    let tx;
    try {
        // get account
        const from = await Helysia.getAccount();
        // get token contract
        const tokenContract = await Helysia.getContract('tokenContract');
        // calcualte amount in Wei
        const value = Helysia.web3.utils.toWei(amount);
        // call transfer
        tx = await tokenContract.methods.transfer(Helysia.recipientAccount, value).send({from: from});
    } catch (error) {
        throw error;
    }
    return tx;
}

Helysia.getContract = async (contract) => {
    if (Helysia[contract]) return Helysia[contract];
    
    if (contract === 'tokenContract') {
        try {            
            Helysia.tokenContract = await new Helysia.web3.eth.Contract(getAbi('erc20'), Helysia.adds.token);
        } catch (e) {
            throw new Error('no-token-contract');
        }
    } else if (contract === 'daiContract') {
        try {            
            Helysia.daiContract = await new Helysia.web3.eth.Contract(getAbi('erc20'), Helysia.adds.dai);
        } catch (e) {
            throw new Error('no-dai-contract');
        }
    } else if (contract === 'fundraisingContract') {
        try {
            Helysia.fundraisingContract = await new Helysia.web3.eth.Contract(getAbi('fundraising'), Helysia.adds.fundraising);
        } catch (e) {
            throw new Error('no-fundraising-contract');
        }
    } else if (contract === 'presaleContract') {
        try {
            Helysia.presaleContract = await new Helysia.web3.eth.Contract(getAbi('presale'), Helysia.adds.presale);
        } catch (e) {
            throw new Error('no-presale-contract');
        }
    } else if (contract === 'marketMakerContract') {
        try {
            Helysia.marketMakerContract = await new Helysia.web3.eth.Contract(getAbi('marketmaker'), Helysia.adds.marketmaker);
        } catch (e) {
            throw new Error('no-market-contract');
        }
    } else if (contract === 'bancorFormula') {
        try {
            Helysia.bancorFormula = await new Helysia.web3.eth.Contract(getAbi('bancorformula'), Helysia.adds.bancorformula);
        } catch (e) {
            throw new Error('no-market-contract');
        }
    } else if (contract === 'tapContract') {
        try {
            Helysia.tapContract = await new Helysia.web3.eth.Contract(getAbi('tap'), Helysia.adds.tap);
        } catch (e) {
            throw new Error('no-market-contract');
        }
    }
    return Helysia[contract];
}

export default Helysia;