<?php

namespace App\Application\DTOs;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Preferred_Market_DTO",
 *     type="object",
 *     required={"ProductID","PreferredMarketLogo"},
 *     @OA\Property(
 *         property="ProductID",
 *         type="integer",
 *         description="The ID of the product"
 *     ),
 *     @OA\Property(
 *         property="PreferredMarketLogo",
 *         type="string",
 *         description="URL of the market logo with the cheapest price for this product"
 *     )
 * )
 */
class Preferred_Market_DTO
{
    public int $ProductID;
    public string $PreferredMarketLogo;

    public function __construct(int $ProductID, string $PreferredMarketLogo)
    {
        $this->ProductID = $ProductID;
        $this->PreferredMarketLogo = $PreferredMarketLogo;
    }
}
