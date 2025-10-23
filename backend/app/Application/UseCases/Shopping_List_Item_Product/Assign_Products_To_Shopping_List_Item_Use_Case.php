<?php

namespace App\Application\UseCases\Shopping_List_Item_Product;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Assign_Products_To_Shopping_List_Item_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Repository;
use App\Application\DTOs\Assign_Products_To_Shopping_List_Item_DTO;
use InvalidArgumentException;

class Assign_Products_To_Shopping_List_Item_Use_Case implements I_Assign_Products_To_Shopping_List_Item_Use_Case
{
    private I_Shopping_List_Item_Product_Repository $shoppingListItemProductRepository;

    public function __construct(
        I_Shopping_List_Item_Product_Repository $shoppingListItemProductRepository
    ) {
        $this->shoppingListItemProductRepository = $shoppingListItemProductRepository;
    }

    public function assign(Assign_Products_To_Shopping_List_Item_DTO $dto): void
    {
        // Check if all products exist
        foreach ($dto->ProductIDs as $productID) {
            if (!$this->shoppingListItemProductRepository->findProductById($productID)) {
                throw new InvalidArgumentException("Product with ID {$productID} does not exist.");
            }
        }

        // Check all shopping list items exist
        foreach ($dto->ShoppingListItemIDs as $shoppingListItemId) {
            if (!$this->shoppingListItemProductRepository->findShoppingListById($shoppingListItemId)) {
                throw new InvalidArgumentException("Shopping List Item with ID $shoppingListItemId does not exist.");
            }
        }

        // Attach products to the lists WITHOUT removing existing associations
        $this->shoppingListItemProductRepository->attachMultipleProductsToShoppingLists($dto->ProductIDs, $dto->ShoppingListItemIDs);

        // ✅ Update product status globally to 'ToBuy'
        foreach ($dto->ProductIDs as $productID) {
            // This updates the status on the product itself,
            // so all shopping lists containing this product will see the change
            $this->shoppingListItemProductRepository->updateStatus($productID, 'ToBuy');

             // Check how many shopping lists this product is linked to
            $shoppingListCount = $this->shoppingListItemProductRepository->countShoppingListsForProduct($productID);

            // ✅ If linked to more than 1, mark as favorite
            if ($shoppingListCount > 1) {
                $this->shoppingListItemProductRepository->updateIsFavorite($productID, true);
            }
        }
    }
}
