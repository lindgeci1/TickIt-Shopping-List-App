<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Market;

/**
 * @OA\Schema(
 *     schema="Market_DTO",
 *     type="object",
 *     required={"Name"},
 *     @OA\Property(property="MarketID", type="integer", nullable=true),
 *     @OA\Property(property="Name", type="string"),
 *     @OA\Property(property="Location", type="string", nullable=true),
 *      @OA\Property(
 *         property="Photos",
 *         type="array",
 *         @OA\Items(type="string")
 *     )
 * )
 */
class Market_DTO
{
    public ?int $MarketID = null;
    public string $Name;
    public ?string $Location = null;
    public array $Photos = [];

    public function __construct(?Market $market = null)
    {
        if ($market) {
            $this->MarketID = $market->MarketID;
            $this->Name     = $market->Name;
            $this->Location = $market->Location;

            // Map 1-to-1 photo relation
             $this->Photos = $market->Photos ?? [];
        }
    }
}
