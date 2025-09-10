<?php

namespace App\Domain\Entities;

class Shopping_List_Item
{
    public ?int $Shopping_List_ItemID;
    public string $Name;
    public string $Status; // 'ToBuy' or 'Bought'
    public ?string $AddedAt = null;
    public ?string $BoughtAt = null;

    public array $Products = [];

    public function __construct(?int $Shopping_List_ItemID, string $Name, string $Status, ?string $AddedAt = null, ?string $BoughtAt = null)
    {
        $this->Shopping_List_ItemID = $Shopping_List_ItemID;
        $this->Name = $Name;
        $this->Status = $Status;
        $this->AddedAt = $AddedAt;
        $this->BoughtAt = $BoughtAt;
    }
}
