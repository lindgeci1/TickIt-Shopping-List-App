<?php

namespace App\Application\Interfaces\ProductMarket;

interface AssignMarketsToProductServiceInterface
{
    public function assign(int $productId, array $marketIds): void;
}
