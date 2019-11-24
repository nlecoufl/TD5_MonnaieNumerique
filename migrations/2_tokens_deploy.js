const ERC20Token = artifacts.require("./ERC20Token");
const ERC721Token = artifacts.require("./ERC721Token");
const ERC223Token = artifacts.require("./ERC223Token");


module.exports = async function(deployer) {
  await deployer.deploy(ERC20Token, "ERC20", "E20", 18);
  await ERC20Token.deployed();

  await deployer.deploy(ERC721Token, "ERC721", "E721");
  await ERC721Token.deployed();

  await deployer.deploy(ERC223Token);
  await ERC223Token.deployed();

};
