pragma solidity >=0.4.21 <0.6.0;

import "../utils/ERC223-token-standard/token/ERC223/IERC223.sol";
import "../utils/ERC223-token-standard/token/ERC223/IERC223Recipient.sol";
import "../math/safeMath.sol";
import "../utils/Address.sol";

contract ERC223Token is IERC223 {
    using SafeMath for uint;

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    mapping(address => uint) balances; // List of user balances.

    function transfer(address _to, uint _value, bytes memory _data) public returns (bool success){
        // Standard function transfer similar to ERC20 transfer with no _data .
        // Added due to backwards compatibility reasons .
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if(Address.isContract(_to)) {
            IERC223Recipient receiver = IERC223Recipient(_to);
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }

    function transfer(address _to, uint _value) public returns (bool success){
        bytes memory empty = hex"00000000";
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if(Address.isContract(_to)) {
            IERC223Recipient receiver = IERC223Recipient(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        emit Transfer(msg.sender, _to, _value, empty);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }
}
