<?php

namespace App\Application\UseCases\Market;

use App\Application\DTOs\Market_DTO;
use App\Application\Interfaces\Market\I_Get_All_Markets_Only_Use_Case;
use App\Domain\Interfaces\I_Market_Repository;

class Get_All_Markets_Only_Use_Case implements I_Get_All_Markets_Only_Use_Case
{
    private I_Market_Repository $marketRepository;

    public function __construct(I_Market_Repository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    /**
     * @return Market_DTO[]
     */
    public function execute(): array
    {
        $markets = $this->marketRepository->findAllMarketsOnly();

        return array_map(fn($market) => new Market_DTO($market), $markets);
    }
}
