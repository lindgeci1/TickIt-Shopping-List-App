<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Get_All_Categories_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Product_Category_DTO;

class Get_All_Categories_Use_Case implements I_Get_All_Categories_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(): array
    {
        $categories = $this->productRepository->findAllCategories();

        // Map each category string to a DTO, keeping the array flat
        return array_map(fn($c) => new Product_Category_DTO($c), $categories);
    }
}
