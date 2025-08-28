<?php

namespace App\Application\Services\Market;

use App\Application\DTOs\MarketDto;
use App\Infrastructure\Repositories\MarketRepositoryInterface;
use InvalidArgumentException;

class GetMarketService
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function getById(int $MarketID): MarketDto
    {
        $market = $this->marketRepository->findById($MarketID);

        if (!$market) {
            throw new InvalidArgumentException("Market not found.");
        }

        return new MarketDto($market);
    }
}
