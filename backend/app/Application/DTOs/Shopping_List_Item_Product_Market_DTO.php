<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Shopping_List_Item_Product_Market;

/**
 * @OA\Schema(
 *     schema="Shopping_List_Item_Product_Market_DTO",
 *     type="object",
 *     required={"Shopping_List_Item_ID", "Product_ID", "Market_ID"},
 *     @OA\Property(property="Shopping_List_Item_Product_MarketID", type="integer", nullable=true),
 *     @OA\Property(property="Shopping_List_Item_ID", type="integer"),
 *     @OA\Property(property="Product_ID", type="integer"),
 *     @OA\Property(property="Market_ID", type="integer"),
 *     @OA\Property(property="SelectedPrice", type="number", format="float", nullable=true)
 * )
 */
class Shopping_List_Item_Product_Market_DTO
{
    public ?int $Shopping_List_Item_Product_MarketID = null;
    public int $Shopping_List_Item_ID;
    public int $Product_ID;
    public int $Market_ID;
    public ?float $SelectedPrice = null;

    public function __construct(?Shopping_List_Item_Product_Market $entity = null)
    {
        if ($entity) {
            $this->Shopping_List_Item_Product_MarketID = $entity->Shopping_List_Item_Product_MarketID;
            $this->Shopping_List_Item_ID = $entity->Shopping_List_Item_ID;
            $this->Product_ID = $entity->Product_ID;
            $this->Market_ID = $entity->Market_ID;
            $this->SelectedPrice = $entity->SelectedPrice ?? null;
        }
    }
}
