<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product;

use App\Application\DTOs\Assign_Products_To_ShoppingListItem_DTO;

interface I_Update_ShoppingListItems_For_Product_Use_Case
{
    public function update(Assign_Products_To_ShoppingListItem_DTO $dto): void;
}
