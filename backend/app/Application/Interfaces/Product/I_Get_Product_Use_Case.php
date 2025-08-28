<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Product_DTO;

interface I_Get_Product_Use_Case
{

    public function getById(int $ProductID): Product_DTO;
}
