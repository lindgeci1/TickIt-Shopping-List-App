<?php

namespace App\Application\UseCases\Shopping_List_Item_Product;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Update_ShoppingListItems_For_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Application\DTOs\Assign_Products_To_ShoppingListItem_DTO;
use InvalidArgumentException;

class Update_ShoppingListItems_For_Product_Use_Case implements I_Update_ShoppingListItems_For_Product_Use_Case
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

    public function update(Assign_Products_To_ShoppingListItem_DTO $dto): void
    {
        // Check if product exists
        if (!$this->productRepository->findById($dto->ProductID)) {
            throw new InvalidArgumentException("Product with ID {$dto->ProductID} does not exist.");
        }

        // Check if all shopping list items exist
        foreach ($dto->ShoppingListItemIDs as $shoppingListItemId) {
            if (!$this->shoppingListItemRepository->findById($shoppingListItemId)) {
                throw new InvalidArgumentException("Shopping List Item with ID $shoppingListItemId does not exist.");
            }
        }

        // Sync product's shopping list items (replace old with new)
        $this->productRepository->syncShoppingListItems($dto->ProductID, $dto->ShoppingListItemIDs);
    }
}
