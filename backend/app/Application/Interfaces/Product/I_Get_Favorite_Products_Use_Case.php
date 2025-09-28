<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Product_DTO;

interface I_Get_Favorite_Products_Use_Case
{
    public function getFavorites(): array;
}
