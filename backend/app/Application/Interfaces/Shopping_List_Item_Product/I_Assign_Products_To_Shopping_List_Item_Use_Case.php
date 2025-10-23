<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product;

use App\Application\DTOs\Assign_Products_To_Shopping_List_Item_DTO;

interface I_Assign_Products_To_Shopping_List_Item_Use_Case
{
    public function assign(Assign_Products_To_Shopping_List_Item_DTO $dto): void;
}
