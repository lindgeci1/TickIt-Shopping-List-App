<?php

namespace App\Application\UseCases\Market;

use App\Domain\Interfaces\MarketRepositoryInterface;
use InvalidArgumentException;
use App\Application\Interfaces\Market\DeleteMarketServiceInterface;

class DeleteMarketUseCase implements DeleteMarketServiceInterface
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
