<?php

namespace App\Domain\Entities;

class Product
{
    public ?int $ProductID;
    public string $Name;
    public bool $IsFavorite = false;
    public string $Category;
    public ?string $Status = null;
    public array $Markets = [];
    public array $ShoppingListItems = [];
    public array $Photos = [];

    public function __construct(?int $ProductID, string $Name, bool $IsFavorite = false, string $Category)
    {
        $this->ProductID = $ProductID;
        $this->Name = $Name;
        $this->IsFavorite = $IsFavorite;
        $this->Category = $Category;
    }
}
