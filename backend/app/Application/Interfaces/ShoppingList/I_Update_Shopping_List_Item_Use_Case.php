<?php

namespace App\Application\Interfaces\ShoppingList;

use App\Application\DTOs\Shopping_List_Item_DTO;

interface I_Update_Shopping_List_Item_Use_Case
{
    public function update(Shopping_List_Item_DTO $dto): Shopping_List_Item_DTO;
}
