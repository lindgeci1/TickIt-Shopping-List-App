<?php

namespace App\Application\Interfaces\Product_Photo;

use App\Application\DTOs\Product_Photo_DTO;

interface I_Add_Product_Photo_Use_Case
{
    public function add(Product_Photo_DTO $dto): Product_Photo_DTO;
}
