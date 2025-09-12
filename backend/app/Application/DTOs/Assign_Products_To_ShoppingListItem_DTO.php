<?php

namespace App\Application\DTOs;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Assign_Products_To_ShoppingListItem_DTO",
 *     type="object",
 *     required={"ProductIDs","ShoppingListItemIDs"},
 *     @OA\Property(
 *         property="ProductIDs",
 *         type="array",
 *         @OA\Items(type="integer"),
 *         description="Array of product IDs to assign to shopping list items"
 *     ),
 *     @OA\Property(
 *         property="ShoppingListItemIDs",
 *         type="array",
 *         @OA\Items(type="integer"),
 *         description="Array of shopping list item IDs to assign products to"
 *     )
 * )
 */
class Assign_Products_To_ShoppingListItem_DTO
{
    public array $ProductIDs;
    public array $ShoppingListItemIDs;

    public function __construct(array $ProductIDs, array $ShoppingListItemIDs)
    {
        $this->ProductIDs = $ProductIDs;
        $this->ShoppingListItemIDs = $ShoppingListItemIDs;
    }
}
