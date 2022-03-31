module.exports = async function ({ ethers, getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const totalTokens = ethers.utils.parseEther("1000000.0");

  await deploy("WETH9Mock", {
    from: deployer,
    log: true,
  });

  await deploy("ERC20Mock", {
    from: deployer,
    args: ["Token A", "TKA", totalTokens],
    log: true,
  });

  await deploy("ERC20Mock", {
    from: deployer,
    args: ["Token B", "TKB", totalTokens],
    log: true,
  });

  await deploy("ERC20Mock", {
    from: deployer,
    args: ["Token X", "TKX", totalTokens],
    log: true,
  });

  await deploy("ERC20Mock", {
    from: deployer,
    args: ["Token Y", "TKY", totalTokens],
    log: true,
  });
};

// module.exports.skip = ({ getChainId }) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const chainId = await getChainId();
//       resolve(chainId !== "31337");
//     } catch (error) {
//       reject(error);
//     }
//   });

module.exports.tags = ["test", "Mocks"];
