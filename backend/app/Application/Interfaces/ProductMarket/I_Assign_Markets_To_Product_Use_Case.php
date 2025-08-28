<?php

namespace App\Application\Interfaces\ProductMarket;

interface I_Assign_Markets_To_Product_Use_Case
{
    public function assign(int $productId, array $marketIds): void;
}
