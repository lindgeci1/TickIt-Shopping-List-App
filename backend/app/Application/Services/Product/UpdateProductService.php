<?php

namespace App\Application\Services\Product;

use App\Domain\Entities\Product;
use App\Infrastructure\Repositories\ProductRepositoryInterface;
use App\Application\DTOs\ProductDto;
use InvalidArgumentException;

class UpdateProductService
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function update(ProductDto $dto): ProductDto
    {
        if (!$dto->ProductID) {
            throw new InvalidArgumentException("ProductID is required for update.");
        }

        $existing = $this->productRepository->findById($dto->ProductID);
        if (!$existing) {
            throw new InvalidArgumentException("Product not found.");
        }

        if (empty(trim($dto->Name))) {
            throw new InvalidArgumentException("Product name is required.");
        }

        if (empty(trim($dto->Category))) {
            throw new InvalidArgumentException("Category is required.");
        }

        $product = new Product(
            $dto->ProductID,
            $dto->Name,
            $dto->Description,
            $dto->Price,
            $dto->IsFavorite ?? false,
            $dto->Category
        );

        $this->productRepository->update($product);

        return new ProductDto($product);
    }
}
