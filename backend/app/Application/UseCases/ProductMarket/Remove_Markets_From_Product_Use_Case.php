<?php

namespace App\Application\UseCases\ProductMarket;

use App\Application\Interfaces\ProductMarket\I_Remove_Markets_From_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Market_Repository;
use App\Application\DTOs\Remove_Markets_From_Product_DTO;
use InvalidArgumentException;

class Remove_Markets_From_Product_Use_Case implements I_Remove_Markets_From_Product_Use_Case
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

public function remove(Remove_Markets_From_Product_DTO $dto): void
{
    $product = $this->productRepository->findById($dto->ProductID);
    if (!$product) {
        // Instead of failing silently or letting Eloquent throw
        throw new InvalidArgumentException("Product with ID {$dto->ProductID} does not exist.");
    }

    foreach ($dto->MarketIDs as $marketId) {
        if (!$this->marketRepository->findById($marketId)) {
            throw new InvalidArgumentException("Market with ID $marketId does not exist.");
        }
    }

    // Detach
    $this->productRepository->detachFromMarkets($dto->ProductID, $dto->MarketIDs);
}

}
