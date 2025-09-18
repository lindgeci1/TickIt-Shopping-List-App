<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Shopping_List_Item;
use App\Domain\Entities\Product as ProductEntity;

/**
 * @OA\Schema(
 *     schema="Shopping_List_Item_DTO",
 *     type="object",
 *     required={"Name"},
 *     @OA\Property(property="Shopping_List_ItemID", type="integer", nullable=true),
 *     @OA\Property(property="Name", type="string", description="Unique name for the shopping list"),
 *     @OA\Property(property="AddedAt", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="BoughtAt", type="string", format="date-time", nullable=true),
 *     @OA\Property(
 *         property="Products",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             @OA\Property(property="ProductID", type="integer"),
 *             @OA\Property(property="Name", type="string"),
 *             @OA\Property(property="Price", type="number", format="float"),
 *             @OA\Property(property="IsFavorite", type="boolean"),
 *             @OA\Property(property="Category", type="string"),
 *             @OA\Property(property="Photos", type="array", @OA\Items(type="string")),
 *             @OA\Property(
 *                 property="Status",
 *                 type="string",
 *                 enum={"ToBuy","Bought"},
 *                 nullable=true,
 *                 description="Status of the product in the shopping list"
 *             )
 *         )
 *     )
 * )
 */
class Shopping_List_Item_DTO
{
    public ?int $Shopping_List_ItemID = null;
    public string $Name;
    public ?string $AddedAt = null;
    public ?string $BoughtAt = null;

    /**
     * @var array<int, array> List of full product details including Status
     */
    public array $Products = [];

    public function __construct(?Shopping_List_Item $entity = null)
    {
        if ($entity) {
            $this->Shopping_List_ItemID = $entity->Shopping_List_ItemID;
            $this->Name = $entity->Name ?? '';
            $this->AddedAt = $entity->AddedAt;
            $this->BoughtAt = $entity->BoughtAt;

            // Map products with full details including Status and photos
            $this->Products = array_map(function (ProductEntity $p) {
                return [
                    'ProductID' => $p->ProductID,
                    'Name' => $p->Name,
                    'IsFavorite' => $p->IsFavorite,
                    'Category' => $p->Category,
                    'Photos' => $p->Photos ?? [],
                    'Status' => $p->Status,
                ];
            }, $entity->Products ?? []);
        }
    }
}
