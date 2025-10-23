<?php

namespace App\Application\UseCases\Market;

use App\Domain\Entities\Market;
use App\Domain\Interfaces\I_Market_Repository;
use App\Application\DTOs\Market_DTO;
use App\Application\Interfaces\Market\I_Get_All_Markets_Use_Case;

class Get_All_Markets_Use_Case implements I_Get_All_Markets_Use_Case
{
    private I_Market_Repository $marketRepository;

    public function __construct(I_Market_Repository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    public function getAll(): array
    {
        $all = $this->marketRepository->findAll();

        return array_map(fn(Market $m) => new Market_DTO($m), $all);
    }
}
