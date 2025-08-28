<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\Market_DTO;

interface I_Update_Market_Use_Case
{
    public function update(Market_DTO $dto): Market_DTO;
}
