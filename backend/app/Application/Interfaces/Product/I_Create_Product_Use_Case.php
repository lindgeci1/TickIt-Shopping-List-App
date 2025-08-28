<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Product_DTO;

interface I_Create_Product_Use_Case
{
    public function create(Product_DTO $dto): Product_DTO;
}
