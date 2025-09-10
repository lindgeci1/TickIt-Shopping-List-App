<?php

namespace App\Domain\Entities;

class Shopping_List_Item_Product
{
    public ?int $Shopping_List_Item_ProductID;
    public int $Shopping_List_ItemID;
    public int $ProductID;

    public ?Shopping_List_Item $ShoppingListItem = null;
    public ?Product $Product = null;

    public function __construct(?int $Shopping_List_Item_ProductID, int $Shopping_List_ItemID, int $ProductID)
    {
        $this->Shopping_List_Item_ProductID = $Shopping_List_Item_ProductID;
        $this->Shopping_List_ItemID = $Shopping_List_ItemID;
        $this->ProductID = $ProductID;
    }
}
