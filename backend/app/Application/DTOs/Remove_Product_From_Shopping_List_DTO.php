<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Remove_Product_From_Shopping_List_DTO",
 *     type="object",
 *     required={"ProductID", "ShoppingListItemID"},
 *     @OA\Property(property="ProductID", type="integer", example=101),
 *     @OA\Property(property="ShoppingListItemID", type="integer", example=5)
 * )
 */
class Remove_Product_From_Shopping_List_DTO
{
    public int $ProductID;
    public int $ShoppingListItemID;

    public function __construct(array $data)
    {
        $this->ProductID = $data['ProductID'];
        $this->ShoppingListItemID = $data['ShoppingListItemID'];
    }
}
