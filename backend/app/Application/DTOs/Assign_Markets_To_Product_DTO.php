<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Assign_Markets_To_Product_DTO",
 *     type="object",
 *     required={"ProductID","Markets"},
 *     @OA\Property(property="ProductID", type="integer"),
 *     @OA\Property(
 *         property="Markets",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             required={"MarketID","Price"},
 *             @OA\Property(property="MarketID", type="integer"),
 *             @OA\Property(property="Price", type="number", format="float")
 *         ),
 *         description="Array of market objects with ID and price"
 *     )
 * )
 */
class Assign_Markets_To_Product_DTO
{
    public int $ProductID;
    public array $Markets; // array of ['MarketID' => int, 'Price' => float]

    /**
     * @param int $ProductID
     * @param array $Markets Array of ['MarketID' => int, 'Price' => float]
     */
    public function __construct(int $ProductID, array $Markets)
    {
        $this->ProductID = $ProductID;
        $this->Markets = $Markets;
    }
}
