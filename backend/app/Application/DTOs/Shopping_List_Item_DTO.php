<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Shopping_List_Item;

/**
 * @OA\Schema(
 *     schema="Shopping_List_Item_DTO",
 *     type="object",
 *     required={"ProductID","Status"},
 *     @OA\Property(property="Shopping_List_ItemID", type="integer", nullable=true),
 *     @OA\Property(property="ProductID", type="integer"),
 *     @OA\Property(property="Status", type="string", enum={"ToBuy","Bought"}),
 *     @OA\Property(property="AddedAt", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="BoughtAt", type="string", format="date-time", nullable=true)
 * )
 */
class Shopping_List_Item_DTO
{
    public ?int $Shopping_List_ItemID = null;
    public int $ProductID;
    public string $Status; // 'ToBuy' or 'Bought'
    public ?string $AddedAt = null;
    public ?string $BoughtAt = null;

    public function __construct(?Shopping_List_Item $entity = null)
    {
        if ($entity) {
            $this->Shopping_List_ItemID = $entity->Shopping_List_ItemID;
            $this->ProductID = $entity->ProductID;
            $this->Status = $entity->Status;
            $this->AddedAt = $entity->AddedAt;
            $this->BoughtAt = $entity->BoughtAt;
        }
    }
}
