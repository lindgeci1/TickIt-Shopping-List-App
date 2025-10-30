<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Product_Markets_DTO",
 *     type="object",
 *     required={"MarketID","Name"},
 *     @OA\Property(property="MarketID", type="integer"),
 *     @OA\Property(property="Name", type="string"),
 *     @OA\Property(property="Price", type="number", format="float", nullable=true),
 *     @OA\Property(property="Discount", type="number", format="float", nullable=true),
 *     @OA\Property(property="FinalPrice", type="number", format="float", nullable=true),
 *     @OA\Property(property="PhotoURL", type="string", nullable=true)
 * )
 */
class Product_Markets_DTO
{
    public int $MarketID;
    public string $Name;
    public ?float $Price = null;
    public ?float $Discount = null;
    public ?float $FinalPrice = null;
    public ?string $PhotoURL = null;

    public function __construct(array $market)
    {
        $this->MarketID   = $market['MarketID'];
        $this->Name       = $market['Name'];
        $this->Price      = $market['Price'] ?? null;
        $this->Discount   = $market['Discount'] ?? null;
        $this->FinalPrice = $market['FinalPrice'] ?? null;
        $this->PhotoURL   = $market['PhotoURL'] ?? null;
    }
}
