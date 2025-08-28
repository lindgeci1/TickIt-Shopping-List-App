<?php

namespace App\Application\UseCases\Market;

use App\Application\DTOs\MarketDto;
use App\Domain\Interfaces\MarketRepositoryInterface;
use InvalidArgumentException;
use App\Application\Interfaces\Market\GetMarketServiceInterface;
class GetMarketUseCase implements GetMarketServiceInterface
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
