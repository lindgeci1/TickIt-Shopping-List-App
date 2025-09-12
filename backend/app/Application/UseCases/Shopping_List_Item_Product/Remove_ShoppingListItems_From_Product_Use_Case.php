<?php

namespace App\Application\UseCases\Shopping_List_Item_Product;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Remove_ShoppingListItems_From_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Application\DTOs\Assign_Products_To_ShoppingListItem_DTO;
use InvalidArgumentException;

class Remove_ShoppingListItems_From_Product_Use_Case implements I_Remove_ShoppingListItems_From_Product_Use_Case
{
    private I_Product_Repository $productRepository;
    private I_Shopping_List_Item_Repository $shoppingListItemRepository;

    public function __construct(
        I_Product_Repository $productRepository,
        I_Shopping_List_Item_Repository $shoppingListItemRepository
    ) {
        $this->productRepository = $productRepository;
        $this->shoppingListItemRepository = $shoppingListItemRepository;
    }

    public function remove(Assign_Products_To_ShoppingListItem_DTO $dto): void
    {
        // Check if all products exist
        foreach ($dto->ProductIDs as $productID) {
            if (!$this->productRepository->findById($productID)) {
                throw new InvalidArgumentException("Product with ID {$productID} does not exist.");
            }
        }

        // Check if all shopping list items exist
        foreach ($dto->ShoppingListItemIDs as $shoppingListItemId) {
            if (!$this->shoppingListItemRepository->findById($shoppingListItemId)) {
                throw new InvalidArgumentException("Shopping List Item with ID $shoppingListItemId does not exist.");
            }
        }

        // Detach all products from all shopping list items
        $this->productRepository->detachMultipleProductsFromShoppingLists($dto->ProductIDs, $dto->ShoppingListItemIDs);
    }
}
