<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Market;

/**
 * @OA\Schema(
 *     schema="MarketDto",
 *     type="object",
 *     required={"Name"},
 *     @OA\Property(property="MarketID", type="integer", nullable=true),
 *     @OA\Property(property="Name", type="string"),
 *     @OA\Property(property="Location", type="string", nullable=true),
 * )
 */
class MarketDto
{
    public ?int $MarketID = null;
    public string $Name;
    public ?string $Location = null;


    public function __construct(?Market $market = null)
    {
        if ($market) {
            $this->MarketID = $market->MarketID;
            $this->Name     = $market->Name;
            $this->Location = $market->Location;
        }
    }
}
