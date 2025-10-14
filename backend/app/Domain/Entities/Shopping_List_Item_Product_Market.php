<?php

namespace App\Domain\Entities;

class Shopping_List_Item_Product_Market
{
    public ?int $Shopping_List_Item_Product_MarketID;
    public int $Shopping_List_Item_ProductID; // changed from Shopping_List_ItemID
    public int $Product_MarketID;
    public ?float $SelectedPrice = null; // add this
    public ?Shopping_List_Item_Product $ShoppingListItemProduct = null; // changed type
    public ?Product_Market $ProductMarket = null;

    public function __construct(?int $Shopping_List_Item_Product_MarketID, int $Shopping_List_Item_ProductID, int $Product_MarketID, ?float $SelectedPrice = null)
    {
        $this->Shopping_List_Item_Product_MarketID = $Shopping_List_Item_Product_MarketID;
        $this->Shopping_List_Item_ProductID = $Shopping_List_Item_ProductID;
        $this->Product_MarketID = $Product_MarketID;
        $this->SelectedPrice = $SelectedPrice;
    }
}
