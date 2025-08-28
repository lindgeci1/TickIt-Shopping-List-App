<?php

namespace App\Application\Services\Product;

use App\Infrastructure\Repositories\ProductRepositoryInterface;
use InvalidArgumentException;

class DeleteProductService
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
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
