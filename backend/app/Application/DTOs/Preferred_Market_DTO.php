<?php

namespace App\Application\DTOs;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Preferred_Market_DTO",
 *     type="object",
 *     required={"ProductID","PreferredMarketLogo","FinalPrice"},
 *     @OA\Property(
 *         property="ProductID",
 *         type="integer",
 *         description="The ID of the product"
 *     ),
 *     @OA\Property(
 *         property="PreferredMarketLogo",
 *         type="string",
 *         description="URL of the market logo with the cheapest price for this product"
 *     ),
 *     @OA\Property(
 *         property="FinalPrice",
 *         type="number",
 *         format="float",
 *         description="The cheapest price of the product in that market"
 *     )
 * )
 */
class Preferred_Market_DTO
{
    public int $ProductID;
    public string $PreferredMarketLogo;
    public ?float $FinalPrice;

    public function __construct(int $ProductID, string $PreferredMarketLogo, ?float $FinalPrice)
    {
        $this->ProductID = $ProductID;
        $this->PreferredMarketLogo = $PreferredMarketLogo;
        $this->FinalPrice = $FinalPrice;
    }
}
