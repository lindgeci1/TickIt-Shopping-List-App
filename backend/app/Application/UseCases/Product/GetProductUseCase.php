<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\GetProductServiceInterface;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\ProductRepositoryInterface;
use App\Application\DTOs\ProductDto;
use InvalidArgumentException;

class GetProductUseCase implements GetProductServiceInterface
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
