<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Get_Products_By_Category_Use_Case;
use App\Application\DTOs\Product_DTO;
use App\Domain\Interfaces\I_Product_Repository;

class Get_Products_By_Category_Use_Case implements I_Get_Products_By_Category_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getByCategory(string $category): array
    {
        $products = $this->productRepository->findByCategory($category);

        return array_map(function ($product) {
            return new Product_DTO($product);
        }, $products);
    }
}
