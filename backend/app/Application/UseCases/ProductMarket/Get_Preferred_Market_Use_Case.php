<?php

namespace App\Application\UseCases\ProductMarket;

use App\Application\DTOs\Preferred_Market_DTO;
use App\Application\Interfaces\ProductMarket\I_Get_Preferred_Market_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Market_Repository;
use InvalidArgumentException;

class Get_Preferred_Market_Use_Case implements I_Get_Preferred_Market_Use_Case
{
    private I_Product_Repository $productRepository;
    private I_Market_Repository $marketRepository;

    public function __construct(
        I_Product_Repository $productRepository,
        I_Market_Repository $marketRepository
    ) {
        $this->productRepository = $productRepository;
        $this->marketRepository = $marketRepository;
    }

    public function getPreferredMarket(int $productId): Preferred_Market_DTO
    {
        $product = $this->productRepository->findById($productId);
        if (!$product) {
            throw new InvalidArgumentException("Product with ID $productId does not exist.");
        }

        $cheapestMarket = $this->marketRepository->getCheapestMarketForProduct($productId);

        if (!$cheapestMarket) {
            throw new InvalidArgumentException("Product is not assigned to any market.");
        }

        // cheapestMarket is already an array: ['MarketID' => ..., 'Name' => ..., 'Logo' => ..., 'Price' => ...]
        return new Preferred_Market_DTO($productId, $cheapestMarket['Logo'], $cheapestMarket['Price']);

    }
}
