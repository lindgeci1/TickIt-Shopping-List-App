<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product;

use App\Application\DTOs\Update_Products_To_Shopping_List_Item_DTO;

interface I_Update_Shopping_List_Items_For_Product_Use_Case
{
    public function update(Update_Products_To_Shopping_List_Item_DTO $dto): void;
}
