<?php

namespace App\Application\UseCases\Product_Market;

use App\Application\Interfaces\Product_Market\I_Assign_Markets_To_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Market_Repository;
use App\Application\DTOs\Assign_Markets_To_Product_DTO;
use InvalidArgumentException;

class Assign_Markets_To_Product_Use_Case implements I_Assign_Markets_To_Product_Use_Case
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

    public function assign(Assign_Markets_To_Product_DTO $dto): void
    {
        // Check if product exists
        if (!$this->productRepository->findById($dto->ProductID)) {
            throw new InvalidArgumentException("Product with ID {$dto->ProductID} does not exist.");
        }

        // Validate markets and prepare array for repository
        $marketsWithPrices = [];
        foreach ($dto->Markets as $marketData) {
            $marketId = $marketData['MarketID'];
            $price = $marketData['Price'];

            if (!$this->marketRepository->findById($marketId)) {
                throw new InvalidArgumentException("Market with ID $marketId does not exist.");
            }

            $marketsWithPrices[] = ['MarketID' => $marketId, 'Price' => $price];
        }

        // Attach product to markets with their respective prices
        $this->productRepository->attachToMarkets($dto->ProductID, $marketsWithPrices);
    }
}
