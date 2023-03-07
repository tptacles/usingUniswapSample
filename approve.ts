const Web3 = require('web3');

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