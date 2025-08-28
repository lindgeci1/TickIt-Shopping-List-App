<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_GetAll_Products_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Product_DTO;
use App\Domain\Entities\Product;

class GetAll_Products_Use_Case implements I_GetAll_Products_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(): array
    {
        $all = $this->productRepository->findAll(); // array of Product entities
        return array_map(fn(Product $p) => new Product_DTO($p), $all);
    }
}
