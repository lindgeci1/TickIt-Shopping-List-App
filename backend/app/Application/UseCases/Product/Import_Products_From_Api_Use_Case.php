<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Import_Products_From_Api_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Entities\Product;
use InvalidArgumentException;

class Import_Products_From_Api_Use_Case implements I_Import_Products_From_Api_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Import products from the API.
     *
     * @param int $perPage Number of products to fetch (default 11)
     * @return Product[] Array of imported Product entities
     */
    public function import(int $perPage = 11): array
    {
        // Call the repository method
        $importedProducts = $this->productRepository->importProductsFromApi($perPage);

        if (empty($importedProducts)) {
            throw new InvalidArgumentException("No products were imported from the API.");
        }

        return $importedProducts;
    }
}
