const Web3 = require('web3');

const TokenContractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "type": "function",
        "stateMutability": "view",
        "outputs": 
        [
            {
                "type": "uint256",
                "name": "",
                "internalType": "uint256"
            }
        ],
        "name": "balanceOf",
        "inputs": 
        [
            {
                "type": "address",
                "name": "account",
                "internalType": "address"
            }
        ]
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

async function loadTokenContract(tokenContractID: string) 
{
	return await new web3.eth.Contract
	(
        	TokenContractABI,
		tokenContractID
	);
}

async function approve(tokenContract, tokenAddress, spenderAddress, amount, gasLimit, gasPrice)
{
    const nonceValue = await web3.eth.getTransactionCount(TrustWalletPublic, 'latest');
    
    var tokenName = await tokenContract.methods.symbol().call();

    console.log("Approving " + amount + ' ' + tokenName + " Wallet: " + TrustWalletPublic + " Contract: " + spenderAddress);
    var methodData = tokenContract.methods.approve(spenderAddress, amount).encodeABI();
    
	const tx = 
	{
		nonce: nonceValue,
		to: tokenAddress, 
		gas: gasLimit,
		gasPrice: gasPrice,
		data: methodData 
	};

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
	
	signPromise.then((signedTx) => 
    {
        // raw transaction string may be available in .raw or 
        // .rawTransaction depending on which signTransaction
        // function was called
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        
        sentTx.on("receipt", receipt => 
        {
            console.log("Approval Success");
        });

        sentTx.on("error", err => 
        {
            var errorMessage = err.toString();
            console.log('In Error!');
            console.log(err);
        });

        
	}).catch((err) => 
    {
       console.log('In Exception');
        console.log(err);
	});
}
