<?php

namespace App\Application\UseCases\Market;

use App\Domain\Entities\Market;
use App\Domain\Interfaces\I_Market_Repository;
use App\Application\DTOs\Market_DTO;
use InvalidArgumentException;
use App\Application\Interfaces\Market\I_Update_Market_Use_Case;
class Update_Market_Use_Case implements I_Update_Market_Use_Case
{
    private I_Market_Repository $marketRepository;

    public function __construct(I_Market_Repository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function update(Market_DTO $dto): Market_DTO
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

        return new Market_DTO($market);
    }
}
