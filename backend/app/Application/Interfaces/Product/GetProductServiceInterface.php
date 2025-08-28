<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\ProductDto;

interface GetProductServiceInterface
{

    public function getById(int $ProductID): ProductDto;
}
