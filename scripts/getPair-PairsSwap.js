const { ethers } = require("hardhat");

const token1 = process.env.FNK_MAINNET;
const token2 = process.env.USDT_MAINNET;

async function main() {
  const { deployer } = await getNamedAccounts();
  const pairsSwap = await ethers.getContract("PairsSwap", deployer);
  const pair = await pairsSwap.getPair(
    process.env.UNISWAP_FACTORY_MAINNET,
    token1,
    token2
  );
  console.log("Uniswap Pair address: ", pair);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
