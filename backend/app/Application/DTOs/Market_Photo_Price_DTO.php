<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Market_Photo_Price_DTO",
 *     type="object",
 *     required={"MarketID", "MarketName", "SelectedPrice"},
 *     @OA\Property(property="MarketID", type="integer", example=1),
 *     @OA\Property(property="MarketName", type="string", example="SuperMarket Central"),
 *     @OA\Property(property="PhotoURL", type="string", nullable=true, example="https://example.com/photo.jpg"),
 *     @OA\Property(property="PhotoPublicID", type="string", nullable=true, example="market_photos/abc123"),
 *     @OA\Property(property="SelectedPrice", type="number", format="float", example=4.99)
 * )
 */
class Market_Photo_Price_DTO
{
    public ?int $MarketID = null;
    public ?string $MarketName = null;
    public ?string $PhotoURL = null;
    public ?string $PhotoPublicID = null;
    public ?float $SelectedPrice = null;

    public function __construct(?array $data = null)
    {
        if ($data) {
            $this->MarketID = $data['MarketID'] ?? null;
            $this->MarketName = $data['MarketName'] ?? null;
            $this->PhotoURL = $data['PhotoURL'] ?? null;
            $this->PhotoPublicID = $data['PhotoPublicID'] ?? null;
            $this->SelectedPrice = isset($data['SelectedPrice']) ? (float) $data['SelectedPrice'] : null;
        }
    }
}
