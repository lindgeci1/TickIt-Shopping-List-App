<?php

namespace App\Application\UseCases\Market;

use App\Domain\Interfaces\I_Market_Repository;
use InvalidArgumentException;
use App\Application\Interfaces\Market\I_Delete_Market_Use_Case;

class Delete_Market_Use_Case implements I_Delete_Market_Use_Case
{
    private I_Market_Repository $marketRepository;

    public function __construct(I_Market_Repository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function delete(int $MarketID): string
    {
        $existing = $this->marketRepository->findById($MarketID);
        if (!$existing) {
            throw new InvalidArgumentException("Market not found.");
        }

        $deleted = $this->marketRepository->delete($MarketID);

        if ($deleted) {
            return "Market deleted successfully.";
        }

        throw new \RuntimeException("Failed to delete market.");
    }
}
