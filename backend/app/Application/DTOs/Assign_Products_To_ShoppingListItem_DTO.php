<?php

namespace App\Application\DTOs;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Assign_Products_To_ShoppingListItem_DTO",
 *     type="object",
 *     required={"ProductID","ShoppingListItemIDs"},
 *     @OA\Property(property="ProductID", type="integer"),
 *     @OA\Property(
 *         property="ShoppingListItemIDs",
 *         type="array",
 *         @OA\Items(type="integer"),
 *         description="Array of shopping list item IDs to assign to the product"
 *     )
 * )
 */
class Assign_Products_To_ShoppingListItem_DTO
{
    public int $ProductID;
    public array $ShoppingListItemIDs;

    public function __construct(int $ProductID, array $ShoppingListItemIDs)
    {
        $this->ProductID = $ProductID;
        $this->ShoppingListItemIDs = $ShoppingListItemIDs;
    }
}
