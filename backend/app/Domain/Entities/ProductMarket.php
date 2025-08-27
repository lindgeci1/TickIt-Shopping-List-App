<?php

namespace App\Domain\Entities;

class ProductMarket
{
    public ?int $ProductMarketID;
    public int $ProductID;
    public int $MarketID;

    public ?Product $Product = null;
    public ?Market $Market = null;

    public function __construct(?int $ProductMarketID, int $ProductID, int $MarketID)
    {
        $this->ProductMarketID = $ProductMarketID;
        $this->ProductID = $ProductID;
        $this->MarketID = $MarketID;
    }
}
