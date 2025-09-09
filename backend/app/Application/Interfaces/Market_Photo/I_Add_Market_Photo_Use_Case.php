<?php

namespace App\Application\Interfaces\Market_Photo;

use App\Application\DTOs\Market_Photo_DTO;

interface I_Add_Market_Photo_Use_Case
{
    public function add(Market_Photo_DTO $dto): Market_Photo_DTO;
}
