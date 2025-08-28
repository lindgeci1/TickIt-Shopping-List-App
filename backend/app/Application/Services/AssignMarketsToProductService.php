<?php

namespace App\Application\Services;

use App\Infrastructure\Repositories\ProductRepositoryInterface;

class AssignMarketsToProductService
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function assign(int $productId, array $marketIds): void
    {
        $this->productRepository->attachToMarkets($productId, $marketIds);
    }
}
