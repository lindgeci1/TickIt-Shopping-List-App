<?php

namespace App\Application\UseCases\ProductMarket;

use App\Application\Interfaces\ProductMarket\I_Update_Markets_For_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Market_Repository;
use App\Application\DTOs\Assign_Markets_To_Product_DTO;
use InvalidArgumentException;

class Update_Markets_For_Product_Use_Case implements I_Update_Markets_For_Product_Use_Case
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

    public function update(Assign_Markets_To_Product_DTO $dto): void
    {
        // Check if the product exists
        if (!$this->productRepository->findById($dto->ProductID)) {
            throw new InvalidArgumentException("Product with ID {$dto->ProductID} does not exist.");
        }

        // Check if all provided markets exist
        foreach ($dto->MarketIDs as $marketId) {
            if (!$this->marketRepository->findById($marketId)) {
                throw new InvalidArgumentException("Market with ID $marketId does not exist.");
            }
        }

        // Update product's markets (replace old list with new one)
        $this->productRepository->syncMarkets($dto->ProductID, $dto->MarketIDs);
    }
}
