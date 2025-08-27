<?php

namespace App\Domain\Entities;

class Market
{
    public ?int $MarketID;
    public string $Name;
    public ?string $Location = null;

    public array $Products = [];

    public function __construct(?int $MarketID, string $Name, ?string $Location = null)
    {
        $this->MarketID = $MarketID;
        $this->Name = $Name;
        $this->Location = $Location;
    }
}
