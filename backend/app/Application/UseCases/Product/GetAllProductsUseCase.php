<?php

namespace App\Application\UseCases\Product;

use App\Application\Interfaces\Product\GetAllProductsServiceInterface;
use App\Domain\Interfaces\ProductRepositoryInterface;
use App\Application\DTOs\ProductDto;
use App\Domain\Entities\Product;

class GetAllProductsUseCase implements GetAllProductsServiceInterface
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
