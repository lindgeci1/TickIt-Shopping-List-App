<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Shopping_List_Item_Product_Market;

/**
 * @OA\Schema(
 *     schema="Shopping_List_Item_Product_Market_DTO",
 *     type="object",
 *     required={"Shopping_List_Item_ProductID", "Product_MarketID"},
 *     @OA\Property(property="Shopping_List_Item_Product_MarketID", type="integer", nullable=true),
 *     @OA\Property(property="Shopping_List_Item_ProductID", type="integer"),
 *     @OA\Property(property="Product_MarketID", type="integer"),
 *     @OA\Property(property="SelectedPrice", type="number", format="float", nullable=true)
 * )
 */
class Shopping_List_Item_Product_Market_DTO
{
    public ?int $Shopping_List_Item_Product_MarketID = null;
    public int $Shopping_List_Item_ProductID;
    public int $Product_MarketID;
    public ?float $SelectedPrice = null;

    public function __construct(?Shopping_List_Item_Product_Market $entity = null)
    {
        if ($entity) {
            $this->Shopping_List_Item_Product_MarketID = $entity->Shopping_List_Item_Product_MarketID;
            $this->Shopping_List_Item_ProductID = $entity->Shopping_List_Item_ProductID;
            $this->Product_MarketID = $entity->Product_MarketID;
            $this->SelectedPrice = $entity->SelectedPrice ?? null;
        }
    }
}
