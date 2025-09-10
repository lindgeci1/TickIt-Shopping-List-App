<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Shopping_List_Item;

/**
 * @OA\Schema(
 *     schema="Shopping_List_Item_DTO",
 *     type="object",
 *     required={"Name"},
 *     @OA\Property(property="Shopping_List_ItemID", type="integer", nullable=true),
 *     @OA\Property(property="Name", type="string", description="Unique name for the shopping list"),
 *     @OA\Property(property="AddedAt", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="BoughtAt", type="string", format="date-time", nullable=true)
 * )
 */
class Shopping_List_Item_DTO
{
    public ?int $Shopping_List_ItemID = null;
    public string $Name; // Unique name for the list
    public ?string $AddedAt = null;
    public ?string $BoughtAt = null;

    public function __construct(?Shopping_List_Item $entity = null)
    {
        if ($entity) {
            $this->Shopping_List_ItemID = $entity->Shopping_List_ItemID;
            $this->Name = $entity->Name ?? '';
            $this->AddedAt = $entity->AddedAt;
            $this->BoughtAt = $entity->BoughtAt;
        }
    }
}
