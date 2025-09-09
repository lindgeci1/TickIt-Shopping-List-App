<?php

namespace App\Domain\Entities;

class Market_Photo
{
    public ?int $Market_PhotoID;
    public string $Url;
    public string $PublicID;
    public int $MarketID;
    public ?Market $Market = null;

    public function __construct(?int $Market_PhotoID, string $Url, string $PublicID, int $MarketID)
    {
        $this->Market_PhotoID = $Market_PhotoID;
        $this->Url = $Url;
        $this->PublicID = $PublicID;
        $this->MarketID = $MarketID;
    }
}
