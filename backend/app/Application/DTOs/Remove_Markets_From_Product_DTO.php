<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Remove_Markets_From_Product_DTO",
 *     type="object",
 *     required={"ProductID","MarketIDs"},
 *     @OA\Property(property="ProductID", type="integer"),
 *     @OA\Property(
 *         property="MarketIDs",
 *         type="array",
 *         @OA\Items(type="integer"),
 *         description="Array of market IDs from which the product should be removed"
 *     )
 * )
 */
class Remove_Markets_From_Product_DTO
{
    public int $ProductID;
    public array $MarketIDs; // array of integers

    /**
     * @param int $ProductID
     * @param array $MarketIDs Array of market IDs
     */
    public function __construct(int $ProductID, array $MarketIDs)
    {
        $this->ProductID = $ProductID;
        $this->MarketIDs = $MarketIDs;
    }
}
