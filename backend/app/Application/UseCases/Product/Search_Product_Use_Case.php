<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Search_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Product_DTO;

class Search_Product_Use_Case implements I_Search_Product_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Search for products by name (partial match)
     *
     * @param string $name
     * @return Product_DTO[]
     */
    public function searchByName(string $name): array
    {
        if (empty(trim($name))) {
            return []; // return empty array if search string is empty
        }

        $products = $this->productRepository->searchByName($name);

        // Map domain Product entities to Product_DTO
        return array_map(fn($product) => new Product_DTO($product), $products);
    }
}
