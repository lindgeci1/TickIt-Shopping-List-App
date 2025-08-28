<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\I_Delete_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use InvalidArgumentException;

class Delete_Product_Use_Case implements I_Delete_Product_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function delete(int $ProductID): string
    {
        $existing = $this->productRepository->findById($ProductID);
        if (!$existing) {
            throw new InvalidArgumentException("Product not found.");
        }

        $deleted = $this->productRepository->delete($ProductID);

        if ($deleted) {
            return "Product deleted successfully.";
        }

        throw new \RuntimeException("Failed to delete product.");
    }
}
