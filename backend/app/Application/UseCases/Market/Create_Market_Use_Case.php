<?php

namespace App\Application\UseCases\Market;

use App\Application\DTOs\Market_DTO;
use App\Application\Interfaces\Market\I_Create_Market_Use_Case;
use App\Domain\Entities\Market;
use App\Domain\Interfaces\I_Market_Repository;
use InvalidArgumentException;

class Create_Market_Use_Case implements I_Create_Market_Use_Case
{
    private I_Market_Repository $marketRepository;

    public function __construct(I_Market_Repository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function create(Market_DTO $dto): Market_DTO
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

        return new Market_DTO($market);
    }
}
