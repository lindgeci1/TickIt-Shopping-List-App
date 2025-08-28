<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Product_DTO;

interface I_Update_Product_Use_Case
{

    public function update(Product_DTO $dto): Product_DTO;
}
