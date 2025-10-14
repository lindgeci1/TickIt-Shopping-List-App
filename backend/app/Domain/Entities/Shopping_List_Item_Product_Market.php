<?php

namespace App\Domain\Entities;

class Shopping_List_Item_Product_Market
{
    public ?int $Shopping_List_Item_Product_MarketID;
    public int $Shopping_List_Item_ID;   // FK to Shopping_List_Item
    public int $Product_ID;               // FK to Product
    public int $Market_ID;                // FK to Market
    public ?float $SelectedPrice = null;  // optional price

    public ?Shopping_List_Item $ShoppingListItem = null; // relation
    public ?Product $Product = null;                        // relation
    public ?Market $Market = null;                          // relation

    public function __construct(
        ?int $Shopping_List_Item_Product_MarketID,
        int $Shopping_List_Item_ID,
        int $Product_ID,
        int $Market_ID,
        ?float $SelectedPrice = null
    )
    {
        $this->Shopping_List_Item_Product_MarketID = $Shopping_List_Item_Product_MarketID;
        $this->Shopping_List_Item_ID = $Shopping_List_Item_ID;
        $this->Product_ID = $Product_ID;
        $this->Market_ID = $Market_ID;
        $this->SelectedPrice = $SelectedPrice;
    }
}
