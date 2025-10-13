<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Get_Product_Markets_Use_Case;
use App\Application\DTOs\Product_Markets_DTO; // <- corrected
use App\Domain\Interfaces\I_Product_Repository;

class Get_Product_Markets_Use_Case implements I_Get_Product_Markets_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function execute(int $productID): array
    {
        $markets = $this->productRepository->getMarketsWithPriceAndPhoto($productID);

        // Map raw data to DTOs
        return array_map(fn($m) => new Product_Markets_DTO($m), $markets); // <- corrected
    }
}
