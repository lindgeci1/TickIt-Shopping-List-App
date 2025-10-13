<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Product_Markets_DTO;

interface I_Get_Product_Markets_Use_Case
{
    public function execute(int $productID): array;
}
