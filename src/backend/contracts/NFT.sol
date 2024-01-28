// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;

    uint256 public tokenCount;

    constructor() ERC721("DApp NFT", "DAPP") {}

    function mint(string memory _tokenURI) external onlyOwner returns (uint256) {
        tokenCount = tokenCount.add(1);
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}
