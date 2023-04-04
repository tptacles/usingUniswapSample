const { ethers } = require("hardhat");
const SHIBA_MAINNET = process.env.SHIBA_MAINNET;
const SHIBA_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "value", type: "uint256" }],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
      { name: "totalSupply", type: "uint256" },
      { name: "feeReceiver", type: "address" },
      { name: "tokenOwnerAddress", type: "address" },
    ],
    payable: true,
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
];
async function main() {
  const { deployer } = await getNamedAccounts();
  console.log("got named accounts: ", deployer);
  const SHIBA = await ethers.getContractAt(SHIBA_ABI, SHIBA_MAINNET, deployer);
  //const SHIBA = new ethers.Contract(SHIBA_MAINNET, SHIBA_ABI, provider);
  console.log("IERC20 retrieved: ", await SHIBA.name());

  const simpleSwap = await ethers.getContract("SimpleSwap", deployer);
  console.log("simpleswap retrieved: ", simpleSwap.address);
  const amountIn = 1000000000000;
  await SHIBA.approve(simpleSwap.address, amountIn, {
    gasLimit: 500000,
  });
  console.log("SHIBA tranfer approved-----");
  const transactionResponse = await simpleSwap.swapExactTokensForTokens(
    SHIBA_MAINNET,
    process.env.EMAX_MAINNET,
    amountIn,
    1,
    deployer,
    10000000,
    {
      gasLimit: 500000,
    }
  );
  const transactionReciept = await transactionResponse.wait(1);
  console.log(
    "Amount In: ",
    transactionReciept.events[
      transactionReciept.events.length - 1
    ].args.amountIn.toString()
  );
  console.log(
    "Amount Out: ",
    transactionReciept.events[
      transactionReciept.events.length - 1
    ].args.amountOut.toString()
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
