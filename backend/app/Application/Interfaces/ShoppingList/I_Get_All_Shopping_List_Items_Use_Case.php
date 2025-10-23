<?php

namespace App\Application\Interfaces\ShoppingList;

use App\Application\DTOs\Shopping_List_Item_DTO;

interface I_Get_All_Shopping_List_Items_Use_Case
{
    public function getAll(): array;
}
