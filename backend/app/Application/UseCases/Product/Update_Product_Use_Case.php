<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Update_Product_Use_Case;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Product_DTO;
use InvalidArgumentException;

class Update_Product_Use_Case implements I_Update_Product_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function update(Product_DTO $dto): Product_DTO
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

        return new Product_DTO($product);
    }
}
