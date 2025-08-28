<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\Market_DTO;

interface I_Create_Market_Use_Case
{
    public function create(Market_DTO $dto): Market_DTO;
}
