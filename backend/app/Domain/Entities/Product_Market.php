<?php

namespace App\Domain\Entities;

class Product_Market
{
    public ?int $Product_MarketID;
    public int $ProductID;
    public int $MarketID;
    public float $Price;
    public float $Discount;
    public float $FinalPrice;
    public ?Product $Product = null;
    public ?Market $Market = null;


    public function __construct(?int $Product_MarketID, int $ProductID, int $MarketID, float $Price, float $Discount, float $FinalPrice)
    {
        $this->Product_MarketID = $Product_MarketID;
        $this->ProductID = $ProductID;
        $this->MarketID = $MarketID;
        $this->Price = $Price;
        $this->Discount = $Discount;
        $this->FinalPrice = $FinalPrice > 0 ? $FinalPrice : $Price - $Discount;
    }
}
