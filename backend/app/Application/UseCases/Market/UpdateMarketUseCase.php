<?php

namespace App\Application\UseCases\Market;

use App\Domain\Entities\Market;
use App\Domain\Interfaces\MarketRepositoryInterface;
use App\Application\DTOs\MarketDto;
use InvalidArgumentException;
use App\Application\Interfaces\Market\UpdateMarketServiceInterface;
class UpdateMarketUseCase implements UpdateMarketServiceInterface
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function update(MarketDto $dto): MarketDto
    {
        if (!$dto->MarketID) {
            throw new InvalidArgumentException("MarketID is required for update.");
        }

        $existing = $this->marketRepository->findById($dto->MarketID);
        if (!$existing) {
            throw new InvalidArgumentException("Market not found.");
        }

        if (empty(trim($dto->Name))) {
            throw new InvalidArgumentException("Name is required.");
        }

        if (empty(trim($dto->Location))) {
            throw new InvalidArgumentException("Location is required.");
        }

        $market = new Market(
            $dto->MarketID,
            $dto->Name,
            $dto->Location
        );

        $this->marketRepository->update($market);

        return new MarketDto($market);
    }
}
