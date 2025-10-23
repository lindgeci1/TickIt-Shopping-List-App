<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product_Market;

use App\Application\DTOs\Assign_Product_To_Market_Shopping_List_Item_DTO;

interface I_Add_Product_To_Market_In_Shopping_List_Use_Case
{
    public function assign(int $shoppingListItemId, int $productId, int $marketId): Assign_Product_To_Market_Shopping_List_Item_DTO;
}
