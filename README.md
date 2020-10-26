# Helysia Token Library

[![npm (scoped)](https://img.shields.io/npm/v/@alcuadradotech/helysia-lib.svg)](https://www.npmjs.com/package/@alcuadradotech/helysia-lib)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@alcuadradotech/helysia-lib.svg)](https://www.npmjs.com/package/@alcuadradotech/helysia-lib)

A library to interact with the Helysia Token.

## Use

See the [build/index.html](build/index.html) file.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Helysia Lib</title>
    <script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
    <script src="https://unpkg.com/bignumber.js@latest/bignumber.min.js"></script>
    <script src="https://unpkg.com/@alcuadradotech/helysia-lib@latest"></script>
</head>
<body>
    <h3>Pagar con Helysia</h3>
    Tu cuenta <span id="account"></span>
    <p>
        El precio del producto es <span id="amount">100</span> 3LY
        <small>
            y dispones de <span id="helysiaBalance">…</span> 3LY y <span id="ethBalance">…</span> ETH
        </small>
    </p>
    <button id="buy" disabled>Pagar</button>
    
    <script type="text/javascript">
        // get the button
        var button = document.getElementById("buy");
        // disable the button
        button.disabled = true;
        // init the library
        Helysia.init({
            chainId: 1,  // chainId (1: Main network, 4: Rinkeby)
            lang: 'es',  // language
            recipientAccount: "0x4E3DDE4934E3991b6b8226fb591f3FcE43578adc" // 3LY recipient account for payments
        })
        .then(function ({
            userAccount,
            userAccountShort,
            ethBalance,
            helysiaBalance,
            helysiaPrice,
            gasAmount
        }) {
            // get the amount
            var amount = document.getElementById("amount").innerHTML;
            
            // show the user account
            document.getElementById('account').innerHTML = userAccountShort;
            // show balances
            document.getElementById('helysiaBalance').innerHTML = helysiaBalance;
            document.getElementById('ethBalance').innerHTML = ethBalance;
            
            // check token balance
            if (helysiaBalance < amount) {
                alert("No dispones de suficientes tokens Helysia.\n\n\tPor favor comprueba tu balance.");
                return;
            }
            // check token balance and Ether balance
            if (ethBalance < gasAmount) {
                alert("No dispones de suficiente Ethereum para realizar la transacción.\n\n\t\t\tPor favor comprueba tu balance.");
                return;
            }
            
            // enable button
            button.disabled = false;
            
            // listen to the click event
            button.addEventListener('click', function () {
                // send tokens
                Helysia
                .send(Helysia.recipientAccount, amount)
                .then(function (result) {
                    alert(`SUCCESS\n${result.transactionHash}`)
                })
                .catch(function (error) {
                    alert(`ERROR\n${error.message}`)
                });
            });
            
        }).catch( function (error) {
            alert(`ERROR\n${error.message}`);
        });
    </script>
</body>
</html>
```

## Develop

```
npm install
npm start
```