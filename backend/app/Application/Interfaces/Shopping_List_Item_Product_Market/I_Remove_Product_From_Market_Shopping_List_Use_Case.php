<?php

namespace App\Application\Interfaces\Shopping_List_Item_Product_Market;

use App\Application\DTOs\Remove_Product_From_Market_Shopping_List_Item_DTO;

interface I_Remove_Product_From_Market_Shopping_List_Use_Case
{
    public function execute(Remove_Product_From_Market_Shopping_List_Item_DTO $dto): void;
}
