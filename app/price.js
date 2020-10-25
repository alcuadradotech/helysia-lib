"use strict";

export async function getPrice (Helysia, type, amount = "150") {
    let price = 1.321;
    
    if (type === 'CONTRIBUTE') {
        return 1.20;
    }
    
    const toWei = Helysia.web3.utils.toWei;
    const fromWei = Helysia.web3.utils.fromWei;
    
    try {
        // get contracts
        const tokenContract = await Helysia.getContract('tokenContract');
        const daiContract = await Helysia.getContract('daiContract');
        const marketMakerContract = await Helysia.getContract('marketMakerContract');
        
        // get PPM
        const PPM = await marketMakerContract.methods.PPM().call();
        const PPMBN = new BigNumber(PPM);
        // console.log(PPM, 'ppm');
        
        // overallBalance(reserve, collateral): balanceOf(reserve, collateral) + virtualBalance(collateral) + collateralsToBeClaimed(collateral)
        // balanceOf(reserve, collateral)
        const reserveBalance = await daiContract.methods.balanceOf(Helysia.adds.agent).call();
        const reserveBalanceBN = new BigNumber(reserveBalance);    
        // get the collateral token
        const collateralToken = await marketMakerContract.methods.getCollateralToken(Helysia.adds.dai).call();
        // get the virtualBalance and the reserveRatio
        const virtualSupply = new BigNumber(collateralToken[1]);
        // console.log(fromWei(virtualSupply.toFixed()), "collateral.virtualSupply");
        const virtualBalance = new BigNumber(collateralToken[2]);
        // console.log(fromWei(virtualBalance.toFixed()), "collateral.virtualBalance");
        const reserveRatioBN = new BigNumber(collateralToken[3]);
        // console.log(reserveRatio, "reserveRatio");
        const collateral = new BigNumber(toWei(amount));
        const overallBalance = reserveBalanceBN.plus(virtualBalance).plus(collateral);
        // console.log(overallBalance.toFixed(), "overallBalance");
        
        // overallSupply(collateral): bondedToken.totalSupply + bondedToken.tokensToBeMinted + virtualSupply(collateral)
        const totalSupply = await tokenContract.methods.totalSupply().call();
        const tokensToBeMinted = await marketMakerContract.methods.tokensToBeMinted().call()
        // console.log(tokensToBeMinted, "tokensToBeMinted");
        const overallSupply = new BigNumber(totalSupply).plus(new BigNumber(tokensToBeMinted)).plus(virtualSupply)        
        // console.log(overallSupply.toFixed(), "overallSupply");
        
        const n = PPMBN.times(overallBalance);
        const d = overallSupply.times(reserveRatioBN);
        
        price = n.dividedBy(d);
    } catch (error) {
        throw new Error('no_price');
    }
    
    let eudol;
    const response = await fetch('https://api.exchangeratesapi.io/latest');
    
    if (response && response.status !== 200) {
        throw new Error('no_euro_dolar_rate');
    }
    if (response) {
        const eudolJSON = await response.json();
        eudol = new BigNumber(eudolJSON.rates.USD);
    }
    
    const euros = price.dividedBy(eudol);
    // console.log(price.toFixed(4), "price $");
    // console.log(euros.toFixed(4), "price €");
    
    return parseFloat(euros.toFixed(2));
};
