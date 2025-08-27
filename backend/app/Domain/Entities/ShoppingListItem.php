<?php

namespace App\Domain\Entities;

class ShoppingListItem
{
    public ?int $ShoppingListItemID;
    public int $ProductID;
    public string $Status; // 'ToBuy' or 'Bought'
    public ?string $AddedAt = null;
    public ?string $BoughtAt = null;

    public ?Product $Product = null;

    public function __construct(?int $ShoppingListItemID, int $ProductID, string $Status, ?string $AddedAt = null, ?string $BoughtAt = null)
    {
        $this->ShoppingListItemID = $ShoppingListItemID;
        $this->ProductID = $ProductID;
        $this->Status = $Status;
        $this->AddedAt = $AddedAt;
        $this->BoughtAt = $BoughtAt;
    }
}
