<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Create_Product_Use_Case;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Product_DTO;
use InvalidArgumentException;

class Create_Product_Use_Case implements I_Create_Product_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function create(Product_DTO $dto): Product_DTO
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
            $dto->Price,
            $dto->IsFavorite ?? false,
            $dto->Category
        );

        $this->productRepository->create($product);

        return new Product_DTO($product);
    }
}
