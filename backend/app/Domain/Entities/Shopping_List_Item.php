<?php

namespace App\Domain\Entities;

class Shopping_List_Item
{
    public ?int $Shopping_List_ItemID;
    public int $ProductID;
    public string $Status; // 'ToBuy' or 'Bought'
    public ?string $AddedAt = null;
    public ?string $BoughtAt = null;

    public ?Product $Product = null;

    public function __construct(?int $Shopping_List_ItemID, int $ProductID, string $Status, ?string $AddedAt = null, ?string $BoughtAt = null)
    {
        $this->Shopping_List_ItemID = $Shopping_List_ItemID;
        $this->ProductID = $ProductID;
        $this->Status = $Status;
        $this->AddedAt = $AddedAt;
        $this->BoughtAt = $BoughtAt;
    }
}
