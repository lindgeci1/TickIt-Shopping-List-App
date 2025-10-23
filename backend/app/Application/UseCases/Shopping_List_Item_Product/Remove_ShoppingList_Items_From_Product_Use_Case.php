<?php

namespace App\Application\UseCases\Shopping_List_Item_Product;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Remove_Shopping_List_Items_From_Product_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Repository;
use App\Application\DTOs\Remove_Products_From_Shopping_List_Item_DTO;
use InvalidArgumentException;

class Remove_ShoppingList_Items_From_Product_Use_Case implements I_Remove_Shopping_List_Items_From_Product_Use_Case
{
 private I_Shopping_List_Item_Product_Repository $shoppingListItemProductRepository;

    public function __construct(
        I_Shopping_List_Item_Product_Repository $shoppingListItemProductRepository
    ) {
        $this->shoppingListItemProductRepository = $shoppingListItemProductRepository;
    }

    public function remove(Remove_Products_From_Shopping_List_Item_DTO $dto): void
    {
        // Check if all products exist
        foreach ($dto->ProductIDs as $productID) {
            if (!$this->shoppingListItemProductRepository->findProductById($productID)) {
                throw new InvalidArgumentException("Product with ID {$productID} does not exist.");
            }
        }

        // Check if all shopping list items exist
        foreach ($dto->ShoppingListItemIDs as $shoppingListItemId) {
            if (!$this->shoppingListItemProductRepository->findShoppingListById($shoppingListItemId)) {
                throw new InvalidArgumentException("Shopping List Item with ID $shoppingListItemId does not exist.");
            }
        }

        // Detach all products from all shopping list items
        $this->shoppingListItemProductRepository->detachMultipleProductsFromShoppingLists($dto->ProductIDs, $dto->ShoppingListItemIDs);

// foreach ($dto->ProductIDs as $productID) {
//     $this->productRepository->updateStatus($productID, null);
// }


    }
}
