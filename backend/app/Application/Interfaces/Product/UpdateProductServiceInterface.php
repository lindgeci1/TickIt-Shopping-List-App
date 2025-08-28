<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\ProductDto;

interface UpdateProductServiceInterface
{

    public function update(ProductDto $dto): ProductDto;
}
