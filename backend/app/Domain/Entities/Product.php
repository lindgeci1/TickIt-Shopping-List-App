<?php

namespace App\Domain\Entities;

class Product
{
    public ?int $ProductID;
    public string $Name;
    public ?string $Description = null;
    public ?float $Price = null;
    public bool $IsFavorite = false;
    public string $Category;
    public array $Markets = [];
    public array $ShoppingListItems = [];

    public function __construct(?int $ProductID, string $Name, ?string $Description = null, ?float $Price = null, bool $IsFavorite = false, string $Category)
    {
        $this->ProductID = $ProductID;
        $this->Name = $Name;
        $this->Description = $Description;
        $this->Price = $Price;
        $this->IsFavorite = $IsFavorite;
        $this->Category = $Category;
    }
}
