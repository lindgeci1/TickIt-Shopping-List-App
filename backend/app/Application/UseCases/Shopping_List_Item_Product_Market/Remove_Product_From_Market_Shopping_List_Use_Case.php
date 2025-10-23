<?php

namespace App\Application\UseCases\Shopping_List_Item_Product_Market;

use App\Application\DTOs\Remove_Product_From_Market_Shopping_List_Item_DTO;
use App\Application\Interfaces\Shopping_List_Item_Product_Market\I_Remove_Product_From_Market_Shopping_List_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Infrastructure\Models\Shopping_List_Item;
use InvalidArgumentException;

class Remove_Product_From_Market_Shopping_List_Use_Case implements I_Remove_Product_From_Market_Shopping_List_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function execute(Remove_Product_From_Market_Shopping_List_Item_DTO $dto): void
    {
        // Fetch the shopping list item
        $shoppingListItem = Shopping_List_Item::find($dto->ShoppingListItemID);
        if (!$shoppingListItem) {
            throw new InvalidArgumentException("Shopping list item not found.");
        }

        // Check if the product exists in this shopping list
        $productExists = $shoppingListItem->products()->where('products.product_id', $dto->ProductID)->exists();
        if (!$productExists) {
            throw new InvalidArgumentException("The product is not part of this shopping list.");
        }

        // Perform the removal via repository
        $this->productRepository->removeFromShoppingList($dto->ProductID, $dto->ShoppingListItemID);
    }
}
