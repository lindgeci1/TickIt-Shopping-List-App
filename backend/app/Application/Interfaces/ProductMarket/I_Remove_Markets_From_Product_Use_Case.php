<?php

namespace App\Application\Interfaces\ProductMarket;

use App\Application\DTOs\Assign_Markets_To_Product_DTO;

interface I_Remove_Markets_From_Product_Use_Case
{
    public function remove(Assign_Markets_To_Product_DTO $dto): void;
}
