<?php

namespace App\Application\UseCases\ProductMarket;

use App\Application\Interfaces\ProductMarket\AssignMarketsToProductServiceInterface;
use App\Domain\Interfaces\ProductRepositoryInterface;
use App\Domain\Interfaces\MarketRepositoryInterface;
use InvalidArgumentException;

class AssignMarketsToProductService implements AssignMarketsToProductServiceInterface
{
    private ProductRepositoryInterface $productRepository;
    private MarketRepositoryInterface $marketRepository;

    public function __construct(
        ProductRepositoryInterface $productRepository,
        MarketRepositoryInterface $marketRepository
    ) {
        $this->productRepository = $productRepository;
        $this->marketRepository = $marketRepository;
    }

    public function assign(int $productId, array $marketIds): void
    {
        // Check if product exists
        if (!$this->productRepository->findById($productId)) {
            throw new InvalidArgumentException("Product with ID $productId does not exist.");
        }

        // Check if all markets exist
        foreach ($marketIds as $marketId) {
            if (!$this->marketRepository->findById($marketId)) {
                throw new InvalidArgumentException("Market with ID $marketId does not exist.");
            }
        }

        // Assign product to markets
        $this->productRepository->attachToMarkets($productId, $marketIds);
    }
}
