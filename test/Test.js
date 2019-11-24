const ERC721Token = artifacts.require("ERC721Token");
const ERC20Token = artifacts.require("ERC20Token");
const ERC223Token = artifacts.require("ERC223Token");

contract("Testing", accounts => {
  const _name = "My Token ERC20";
  const _symbol = "MTK20";
  const _decimals = 18;

  const _name2 = "My Token ERC721";
  const _symbol2 = "MTK721";

  const _name3 = "My Token ERC223";
  const _symbol3 = "MTK223";

  const seller = accounts[1];
  const buyer = accounts[2];

  beforeEach(async function() {
    Token20 = await ERC20Token.new(_name,_symbol, _decimals, {from: buyer});
    Token721 = await ERC721Token.new(_name2, _symbol2, {from: seller});
    Token223 = await ERC223Token.new({from: seller});
  });

  describe('ERC20 token attributes', function () {
    it('has the correct name', async function() {
      const name = await Token20.name();
      assert.equal(name,_name);
    })

    it('has the correct symbol', async function() {
      const symbol = await Token20.symbol();
      assert.equal(symbol,_symbol);
    })

    it('has the correct decimals', async function() {
      const decimals = (await Token20.decimals()).toNumber();
      assert.equal(decimals, _decimals);
    })
  })

  describe('ERC721 token attributes', function () {
    it('has the correct name', async function() {
      const name2 = await Token721.name();
      assert.equal(name2,_name2);

    })

    it('has the correct symbol', async function() {
      const symbol2 = await Token721.symbol();
      assert.equal(symbol2,_symbol2);
    })
  })

  describe("Testing", () => {
    it("should mint ERC721", async () => {
      let token = await Token721.mint(2500, "test1", 2, {from: seller});
      let nft1= await Token721.getNFT(0);
      var value = web3.utils.toWei(nft1.price, "ether");
      assert.equal(nft1.price,2500);
    })

    it('should return inital token wei balance of ', async function() {
      let ownerBalance = await Token20.balanceOf(buyer);
      ownerBalance = ownerBalance.toString();
      assert.strictEqual(ownerBalance, '1000000');
    })

    it('should properly return the totalSupply of tokens', async function() {
      let totalSupply = await Token20.totalSupply();
      totalSupply = totalSupply.toString();
      assert.strictEqual(totalSupply, '1000000');
    })
  
    it('should approve token for transferFrom', async function() {
      let approver = buyer;
      let spender = accounts[3];
      let originalAllowance = await Token20.allowance(approver, spender);
      let tokenWei = 5000000;
      await Token20.approve(spender, tokenWei, {from: approver});
      let resultAllowance = await Token20.allowance(approver, spender);
      assert.strictEqual(originalAllowance.toNumber(), 0);
      assert.strictEqual(resultAllowance.toNumber(), tokenWei);
    })

    it("should approve and perform the transferfrom", async()=>{      
      let approver = buyer;
      let spender = Token721.address;
      let originalAllowance = await Token20.allowance(approver, spender);
      let tokenWei = 50000;
      await Token20.approve(spender, tokenWei, {from: approver});
      let resultAllowance = await Token20.allowance(approver, spender);

      assert.strictEqual(originalAllowance.toNumber(), 0);
      assert.strictEqual(resultAllowance.toNumber(), tokenWei);

      await Token721.buywithERC20(Token20.address, tokenWei, {from: approver});

      let newOwner = await Token20.balanceOf(Token721.address);
      newOwner = newOwner.toString();
      assert.strictEqual(newOwner, '50000');

    })

    it("should perform transfer", async()=>{      
      await Token223.transfer(Token721.address, 400 ,{from:buyer});
    })
  })
})

