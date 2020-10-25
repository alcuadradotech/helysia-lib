"use strict";

export function addresses (network) {
    switch (network) {
        case "1":                
            return {
                "dai": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "token": "0x4c7065bca76fe44afb0d16c2441b1e6e163354e2",
                "presale": "0x86f5b12af6afdb29c42214e80aa9dfe77fe99673",
                "fundraising": "0xd337cf8f49ea9483bf426b717e1801357d68b5c5",
                "marketmaker": "0xfa373506e7650d016b789dee582f444c91540e71",
                'bancorformula': "0x274Aac49b63F07Bf6998964aD20020b18383a09D",
                "agent": "0x2a7e32eae600960ed07997dbcb5b100ba846808f",
                "vault": "0x83c0d555710f20d6424faa077b938fc724173078",
                "finance": "0xfab35713627c995c1ef61fe93dccf0886287dc2e",
                "tap": "0x8d94a930f73c5ebcf0264195cf3357505d4edb5a",
                "dao": "0x6967459f6e8eDEc2aA407D0960448C4069d958B6",
                "daoUrl": "https://mainnet.aragon.org/#/helysia/"
            };
        case "4":                
            return {
                "dai": "0x0527e400502d0cb4f214dd0d2f2a323fc88ff924",
                "presale": "0xdc56e4fbc85f230857012fd9384c6da7563b1980",
                "token": "0xa9ecdac4ab883a20477d41ceec71231e2a8f9038",
                "fundraising": "0xa4f3e7cadda0cd770582a1e93bdab2ca4be37432",
                "marketmaker": "0x17fb35c62e4b578d62cdeaa15c2a6837ebed6108",
                'bancorformula': "0x9ac140F489Df1481C20FeB318f09b29A4f744915",
                "agent": "0x9477e5c19667e2f6270a9b47844b3c1407f06363",
                "vault": "0x55fbe58ad10778d95d832dbf01e2b036225f9b92",
                "finance": "0xf2d1fbec69f97d01c54429a2bd0c8a486b0eb764",
                "tap": "0xef685095a7dab72f65519cb2c80c619cdac55556",
                "dao": "0x551e5A09A7bDd17C29c0d8C1C14cDeAF8C088d4F",
                "daoUrl": "https://rinkeby.aragon.org/#/helysia30k2"
            };
    }
};