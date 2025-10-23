<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Product_DTO;

interface I_Get_Products_By_Category_Use_Case
{
    public function getByCategory(string $category): array;
}
