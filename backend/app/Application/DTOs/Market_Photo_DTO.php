<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Market_Photo;

/**
 * @OA\Schema(
 *     schema="Market_Photo_DTO",
 *     type="object",
 *     required={"Url", "PublicID", "MarketID"},
 *     @OA\Property(property="Market_PhotoID", type="integer", nullable=true),
 *     @OA\Property(property="Url", type="string"),
 *     @OA\Property(property="PublicID", type="string"),
 *     @OA\Property(property="MarketID", type="integer"),
 * )
 */
class Market_Photo_DTO
{
    public ?int $Market_PhotoID = null;
    public string $Url;
    public string $PublicID;
    public int $MarketID;

    public function __construct(?Market_Photo $photo = null)
    {
        if ($photo) {
            $this->Market_PhotoID = $photo->Market_PhotoID;
            $this->Url            = $photo->Url;
            $this->PublicID       = $photo->PublicID;
            $this->MarketID       = $photo->MarketID;
        }
    }
}
