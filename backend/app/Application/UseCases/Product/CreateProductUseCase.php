<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\CreateProductServiceInterface;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\ProductRepositoryInterface;
use App\Application\DTOs\ProductDto;
use InvalidArgumentException;

class CreateProductUseCase implements CreateProductServiceInterface
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function create(ProductDto $dto): ProductDto
    {
        if (empty(trim($dto->Name))) {
            throw new InvalidArgumentException("Product name is required.");
        }

        if (empty(trim($dto->Category))) {
            throw new InvalidArgumentException("Category is required.");
        }

        if ($this->productRepository->existsByName($dto->Name)) {
            throw new InvalidArgumentException("Product already exists.");
        }

        $product = new Product(
            $dto->ProductID ?? null,
            $dto->Name,
            $dto->Description,
            $dto->Price,
            $dto->IsFavorite ?? false,
            $dto->Category
        );

        $this->productRepository->create($product);

        return new ProductDto($product);
    }
}
