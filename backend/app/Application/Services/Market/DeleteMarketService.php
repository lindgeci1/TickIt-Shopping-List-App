<?php

namespace App\Application\Services\Market;

use App\Infrastructure\Repositories\MarketRepositoryInterface;
use InvalidArgumentException;

class DeleteMarketService
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
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
