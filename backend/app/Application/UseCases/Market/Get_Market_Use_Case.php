<?php

namespace App\Application\UseCases\Market;

use App\Application\DTOs\Market_DTO;
use App\Domain\Interfaces\I_Market_Repository;
use InvalidArgumentException;
use App\Application\Interfaces\Market\I_Get_Market_UseCase;
class Get_Market_Use_Case implements I_Get_Market_UseCase
{
    private I_Market_Repository $marketRepository;

    public function __construct(I_Market_Repository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function getById(int $MarketID): Market_DTO
    {
        $market = $this->marketRepository->findById($MarketID);

        if (!$market) {
            throw new InvalidArgumentException("Market not found.");
        }

        return new Market_DTO($market);
    }
}
