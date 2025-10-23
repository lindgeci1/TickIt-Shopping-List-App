<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product;

use App\Application\DTOs\Remove_Products_From_Shopping_List_Item_DTO;

interface I_Remove_Shopping_List_Items_From_Product_Use_Case
{
    public function remove(Remove_Products_From_Shopping_List_Item_DTO $dto): void;
}
