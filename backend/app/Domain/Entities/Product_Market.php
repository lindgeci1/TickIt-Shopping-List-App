<?php

namespace App\Domain\Entities;

class Product_Market
{
    public ?int $Product_MarketID;
    public int $ProductID;
    public int $MarketID;

    public ?Product $Product = null;
    public ?Market $Market = null;

    public function __construct(?int $Product_MarketID, int $ProductID, int $MarketID)
    {
        $this->Product_MarketID = $Product_MarketID;
        $this->ProductID = $ProductID;
        $this->MarketID = $MarketID;
    }
}
