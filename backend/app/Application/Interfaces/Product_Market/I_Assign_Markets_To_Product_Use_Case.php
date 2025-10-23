<?php

namespace App\Application\Interfaces\Product_Market;
use App\Application\DTOs\Assign_Markets_To_Product_DTO;
interface I_Assign_Markets_To_Product_Use_Case
{
    public function assign(Assign_Markets_To_Product_DTO $dto): void;
}
