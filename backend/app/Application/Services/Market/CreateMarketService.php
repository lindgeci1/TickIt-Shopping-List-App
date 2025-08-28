<?php

namespace App\Application\Services\Market;

use App\Domain\Entities\Market;
use App\Infrastructure\Repositories\MarketRepositoryInterface;
use App\Application\DTOs\MarketDto;
use InvalidArgumentException;

class CreateMarketService
{
    private MarketRepositoryInterface $marketRepository;

    public function __construct(MarketRepositoryInterface $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    // ── Create a new Market ─────────────────────────
    public function create(MarketDto $dto): MarketDto
    {
        // ── Basic validation ─────────────────────────────
        if (empty(trim($dto->Name))) {
            throw new InvalidArgumentException("Market name is required.");
        }

        if (empty(trim($dto->Location))) {
            throw new InvalidArgumentException("Location is required.");
        }

        if ($this->marketRepository->existsByName($dto->Name)) {
            throw new InvalidArgumentException("Market name already exists.");
        }

        // ── Map DTO to Entity ───────────────────────────
        $market = new Market(
            $dto->MarketID ?? null,
            $dto->Name,
            $dto->Location
        );

        // ── Save via repository ──────────────────────────
        $this->marketRepository->create($market);

        // ── Return DTO based on saved entity ───────────
        return new MarketDto($market);
    }
}
