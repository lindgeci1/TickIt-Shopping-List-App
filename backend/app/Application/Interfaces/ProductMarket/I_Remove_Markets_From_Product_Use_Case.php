<?php

namespace App\Application\Interfaces\ProductMarket;

use App\Application\DTOs\Remove_Markets_From_Product_DTO;

interface I_Remove_Markets_From_Product_Use_Case
{
    public function remove(Remove_Markets_From_Product_DTO $dto): void;
}
