<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\Market_DTO;

interface I_Get_All_Markets_Only_Use_Case
{
    /**
     * @return Market_DTO[]
     */
    public function execute(): array;
}
