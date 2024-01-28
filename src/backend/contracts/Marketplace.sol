// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // The account that receives fees
    uint public immutable feePercent; // The fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // Increment itemCount
        itemCount++;
        // Transfer nft
        require(_nft.transferFrom(msg.sender, address(this), _tokenId), "NFT transfer failed");
        // Add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // Emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(msg.value >= _totalPrice, "Not enough ether to cover item price and market fee");
        require(!item.sold, "Item already sold");
        // Pay seller and feeAccount
        (bool success, ) = item.seller.call{value: item.price, gas: gasleft() - 2000}("");
        require(success, "Transfer to seller failed");
        feeAccount.transfer(_totalPrice - item.price);
        // Update item to sold
        item.sold = true;
        // Transfer nft to buyer
        require(item.nft.transferFrom(address(this), msg.sender, item.tokenId), "NFT transfer to buyer failed");
        // Emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) public view returns(uint) {
        return (items[_itemId].price * (100 + feePercent)) / 100;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
