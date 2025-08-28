<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\ProductDto;

interface CreateProductServiceInterface
{
    public function create(ProductDto $dto): ProductDto;
}
