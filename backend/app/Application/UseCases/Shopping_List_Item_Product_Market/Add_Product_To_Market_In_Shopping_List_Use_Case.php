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
    public function assign(int $shoppingListItemId, int $productId, int $marketId): Shopping_List_Item_Product_Market_DTO
    {
        if ($shoppingListItemId <= 0) {
            throw new InvalidArgumentException("Invalid shopping list item ID.");
        }

        if ($productId <= 0) {
            throw new InvalidArgumentException("Invalid product ID.");
        }

        if ($marketId <= 0) {
            throw new InvalidArgumentException("Invalid market ID.");
        }

        // Pass all three IDs to the repository
        $entity = $this->repository->assignMarket($shoppingListItemId, $productId, $marketId);

        return new Shopping_List_Item_Product_Market_DTO($entity);
    }
}
