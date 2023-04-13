module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("PairsSwap", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["all", "pairs"];
