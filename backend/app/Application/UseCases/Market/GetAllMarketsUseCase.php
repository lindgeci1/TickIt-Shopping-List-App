<?php

namespace App\Application\UseCases\Market;

use App\Domain\Entities\Market;
use App\Domain\Interfaces\MarketRepositoryInterface;
use App\Application\DTOs\MarketDto;
use App\Application\Interfaces\Market\GetAllMarketsServiceInterface;

class GetAllMarketsUseCase implements GetAllMarketsServiceInterface
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function getAll(): array
    {
        $all = $this->marketRepository->findAll();

        return array_map(fn(Market $m) => new MarketDto($m), $all);
    }
}
