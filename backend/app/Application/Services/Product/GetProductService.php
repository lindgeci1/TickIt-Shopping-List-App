<?php

namespace App\Application\Services\Product;

use App\Domain\Entities\Product;
use App\Infrastructure\Repositories\ProductRepositoryInterface;
use App\Application\DTOs\ProductDto;
use InvalidArgumentException;

class GetProductService
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getById(int $ProductID): ProductDto
    {
        $product = $this->productRepository->findById($ProductID);

        if (!$product) {
            throw new InvalidArgumentException("Product not found.");
        }

        return new ProductDto($product);
    }
}
