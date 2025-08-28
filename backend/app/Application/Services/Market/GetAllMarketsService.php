<?php

namespace App\Application\Services\Market;

use App\Domain\Entities\Market;
use App\Infrastructure\Repositories\MarketRepositoryInterface;
use App\Application\DTOs\MarketDto;

class GetAllMarketsService
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    // ── Get all Markets ──────────────────────────────
    public function getAll(): array
    {
        $all = $this->marketRepository->findAll(); // returns array of Market entities

        // Map each entity to a DTO
        return array_map(fn(Market $m) => new MarketDto($m), $all);
    }
}
