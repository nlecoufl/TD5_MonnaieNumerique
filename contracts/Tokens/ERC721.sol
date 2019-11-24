pragma solidity >=0.4.21 <0.6.0;

import "/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ERC20.sol";

contract ERC721Token is ERC721Full, Ownable{
  constructor(string memory _name, string memory _symbol) 
  ERC721Full(_name, _symbol)
  public {}

  struct NFT {
    uint256 price;          // NFT price 
    string kind;           // ... type
    uint256 level;          // ... level
  }
  mapping (uint => uint) public tokensPrices;
  uint[] public tokensForSale;
  mapping(uint => uint) public indexes; // shipId => shipForSale

  NFT[] public nfts;
  function getNFT(uint _nftId) public view returns(uint256 price, string memory kind, uint256 level){
    NFT memory _nft = nfts[_nftId];
    price = _nft.price;
    kind = _nft.kind;
    level = _nft.level;
  }

  function mint(uint256 _price, string memory _kind, uint256 _level) public payable onlyOwner{
    NFT memory _nft = NFT({ price: _price, kind: _kind, level: _level });
    uint _nftId = nfts.push(_nft) - 1;

    tokensPrices[_nftId] = _price;

    tokensForSale.push(_nftId);
    indexes[_nftId] = tokensForSale.length - 1;

    // _mint is a function part of ERC721Token that generates the NFT
    // The contract will own the newly minted tokens
    _mint(msg.sender, _nftId);
    }


  function buywithERC20(address addr, uint amount) public {
    ERC20Token token = ERC20Token(addr);
    token.transferFrom(msg.sender, address(this), amount);
  }
}

