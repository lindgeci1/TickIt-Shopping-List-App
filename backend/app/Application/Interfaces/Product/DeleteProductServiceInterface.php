<?php

namespace App\Application\Interfaces\Product;

interface DeleteProductServiceInterface
{

    public function delete(int $ProductID): string;
}
