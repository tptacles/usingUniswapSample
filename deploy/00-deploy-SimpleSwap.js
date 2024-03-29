module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("SimpleSwap", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["all", "router"];
