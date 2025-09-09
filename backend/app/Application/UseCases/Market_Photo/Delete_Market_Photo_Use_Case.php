<?php

namespace App\Application\UseCases\Market_Photo;

use App\Application\Interfaces\Market_Photo\I_Delete_Market_Photo_Use_Case;
use App\Domain\Interfaces\I_Market_Photo_Repository;
use App\Domain\Interfaces\I_Market_Repository; // Make sure you have this
use InvalidArgumentException;

class Delete_Market_Photo_Use_Case implements I_Delete_Market_Photo_Use_Case
{
    private I_Market_Photo_Repository $photoRepository;
    private I_Market_Repository $marketRepository;

    public function __construct(
        I_Market_Photo_Repository $photoRepository,
        I_Market_Repository $marketRepository
    ) {
        $this->photoRepository  = $photoRepository;
        $this->marketRepository = $marketRepository;
    }

    public function deleteByMarketId(int $marketId): bool
    {
        if ($marketId <= 0) {
            throw new InvalidArgumentException("Valid MarketID is required.");
        }

        // Check if the market exists
        $market = $this->marketRepository->findById($marketId);
        if (!$market) {
            throw new InvalidArgumentException("Market with ID {$marketId} does not exist.");
        }

        // Check if a photo exists for this market
        $existingPhoto = $this->photoRepository->getByMarketId($marketId);
        if (!$existingPhoto) {
            throw new InvalidArgumentException("No photo exists for MarketID {$marketId}.");
        }

        // Delete the photo
        $deleted = $this->photoRepository->deleteByMarketId($marketId);
        if (!$deleted) {
            throw new InvalidArgumentException("Deletion failed for MarketID {$marketId}.");
        }

        return true;
    }
}
