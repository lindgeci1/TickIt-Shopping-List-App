<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Get_Product_Use_Case;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Product_DTO;
use InvalidArgumentException;

class Get_Product_Use_Case implements I_Get_Product_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getById(int $ProductID): Product_DTO
    {
        $product = $this->productRepository->findById($ProductID);

        if (!$product) {
            throw new InvalidArgumentException("Product not found.");
        }

        return new Product_DTO($product);
    }
}
