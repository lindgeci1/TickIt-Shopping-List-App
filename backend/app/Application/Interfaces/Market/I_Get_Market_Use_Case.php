<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\Market_DTO;

interface I_Get_Market_Use_Case
{

    public function getById(int $MarketID): Market_DTO;
}
