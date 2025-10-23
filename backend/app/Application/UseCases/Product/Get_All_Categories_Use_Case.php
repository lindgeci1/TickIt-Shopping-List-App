<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Get_All_Categories_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;

class Get_All_Categories_Use_Case implements I_Get_All_Categories_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(): array
    {
        return $this->productRepository->findAllCategories();
    }
}
