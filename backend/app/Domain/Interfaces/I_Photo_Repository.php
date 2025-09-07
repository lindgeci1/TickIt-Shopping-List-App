<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Product_Photo;

interface I_Photo_Repository
{
    public function add(Product_Photo $photo): Product_Photo;

    public function getByProductId(int $productId): ?Product_Photo;


}
