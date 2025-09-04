<?php

namespace App\Application\Interfaces\ProductMarket;

use App\Application\DTOs\Assign_Markets_To_Product_DTO;

interface I_Update_Markets_For_Product_Use_Case
{
    public function update(Assign_Markets_To_Product_DTO $dto): void;
}
