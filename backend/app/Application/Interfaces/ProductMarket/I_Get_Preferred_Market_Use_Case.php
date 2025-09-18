<?php

namespace App\Application\Interfaces\ProductMarket;
use App\Application\DTOs\Preferred_Market_DTO;
interface I_Get_Preferred_Market_Use_Case
{
    public function getPreferredMarket(int $productId): Preferred_Market_DTO;
}
