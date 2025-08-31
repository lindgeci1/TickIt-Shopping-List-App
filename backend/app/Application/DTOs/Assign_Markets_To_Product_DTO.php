<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Assign_Markets_To_Product_DTO",
 *     type="object",
 *     required={"ProductID", "MarketIDs"},
 *     @OA\Property(property="ProductID", type="integer"),
 *     @OA\Property(
 *         property="MarketIDs",
 *         type="array",
 *         @OA\Items(type="integer"),
 *         description="Array of market IDs to assign"
 *     )
 * )
 */
class Assign_Markets_To_Product_DTO
{
    public int $ProductID;
    public array $MarketIDs;

    public function __construct(int $ProductID, array $MarketIDs)
    {
        $this->ProductID = $ProductID;
        $this->MarketIDs = $MarketIDs;
    }
}