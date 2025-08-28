<?php

namespace App\Application\UseCases\Market;

use App\Application\DTOs\MarketDto;
use App\Application\Interfaces\Market\CreateMarketServiceInterface;
use App\Domain\Entities\Market;
use App\Domain\Interfaces\MarketRepositoryInterface;
use InvalidArgumentException;

class CreateMarketUseCase implements CreateMarketServiceInterface
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function create(MarketDto $dto): MarketDto
    {
        if (empty(trim($dto->Name))) {
            throw new InvalidArgumentException("Market name is required.");
        }

        if (empty(trim($dto->Location))) {
            throw new InvalidArgumentException("Location is required.");
        }

        if ($this->marketRepository->existsByName($dto->Name)) {
            throw new InvalidArgumentException("Market name already exists.");
        }

        $market = new Market(
            $dto->MarketID ?? null,
            $dto->Name,
            $dto->Location
        );

        $this->marketRepository->create($market);

        return new MarketDto($market);
    }
}
