<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Remove_Product_From_Shopping_List_DTO;

interface I_Remove_Product_From_Shopping_List_Use_Case
{
    public function execute(Remove_Product_From_Shopping_List_DTO $dto): void;
}
