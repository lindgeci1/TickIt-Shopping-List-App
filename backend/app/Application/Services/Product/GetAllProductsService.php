<?php

namespace App\Application\Services\Product;

use App\Infrastructure\Repositories\ProductRepositoryInterface;
use App\Application\DTOs\ProductDto;
use App\Domain\Entities\Product;

class GetAllProductsService
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(): array
    {
        $all = $this->productRepository->findAll(); // array of Product entities
        return array_map(fn(Product $p) => new ProductDto($p), $all);
    }
}
