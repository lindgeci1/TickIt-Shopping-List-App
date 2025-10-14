<?php

namespace App\Application\UseCases\Shopping_List_Item_Product_Market;

use App\Application\Interfaces\Shopping_List_Item_Product_Market\I_Add_Product_To_Market_In_Shopping_List_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Market_Repository;
use App\Application\DTOs\Shopping_List_Item_Product_Market_DTO;
use InvalidArgumentException;

class Add_Product_To_Market_In_Shopping_List_Use_Case implements I_Add_Product_To_Market_In_Shopping_List_Use_Case
{
    private I_Shopping_List_Item_Product_Market_Repository $repository;

    public function __construct(I_Shopping_List_Item_Product_Market_Repository $repository)
    {
        $this->repository = $repository;
    }

    public function assign(int $shoppingListItemProductId, int $productMarketId): Shopping_List_Item_Product_Market_DTO
    {
        if ($shoppingListItemProductId <= 0) {
            throw new InvalidArgumentException("Invalid shopping list product ID.");
        }

        if ($productMarketId <= 0) {
            throw new InvalidArgumentException("Invalid product market ID.");
        }

        $entity = $this->repository->assignMarket($shoppingListItemProductId, $productMarketId);

        return new Shopping_List_Item_Product_Market_DTO($entity);
    }
}
