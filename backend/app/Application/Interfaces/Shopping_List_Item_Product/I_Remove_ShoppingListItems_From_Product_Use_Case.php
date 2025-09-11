<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product;

use App\Application\DTOs\Assign_Products_To_ShoppingListItem_DTO;

interface I_Remove_ShoppingListItems_From_Product_Use_Case
{
    public function remove(Assign_Products_To_ShoppingListItem_DTO $dto): void;
}
