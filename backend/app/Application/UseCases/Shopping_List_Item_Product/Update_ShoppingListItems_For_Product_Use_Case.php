<?php

namespace App\Application\UseCases\Shopping_List_Item_Product;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Update_ShoppingListItems_For_Product_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Application\DTOs\Assign_Products_To_Shopping_List_Item_DTO;
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

    public function update(Assign_Products_To_Shopping_List_Item_DTO $dto): void
    {
        // 1️⃣ Check if all products exist
        foreach ($dto->ProductIDs as $productID) {
            if (!$this->productRepository->findById($productID)) {
                throw new InvalidArgumentException("Product with ID {$productID} does not exist.");
            }
        }

        // 2️⃣ Check if all shopping list items exist
        foreach ($dto->ShoppingListItemIDs as $shoppingListItemId) {
            if (!$this->shoppingListItemRepository->findById($shoppingListItemId)) {
                throw new InvalidArgumentException("Shopping List Item with ID $shoppingListItemId does not exist.");
            }
        }

        // 3️⃣ Sync products to the lists — removes old associations, avoids duplicates
        $this->productRepository->syncMultipleProductsToShoppingLists($dto->ProductIDs, $dto->ShoppingListItemIDs);

        // 4️⃣ Update product status globally
        foreach ($dto->ProductIDs as $productID) {
            $this->productRepository->updateStatus($productID, 'Bought'); // or 'ToBuy'

            // 5️⃣ Propagate market info to all shopping lists containing the product
            // Fetch the first existing market info for this product, if any
            $marketInfo = $this->productRepository->getMarketPhotoAndSelectedPrice($productID, $dto->ShoppingListItemIDs[0] ?? 0);
            if ($marketInfo) {
                $this->productRepository->propagateBoughtProductToAllLists(
                    $productID,
                    $marketInfo['MarketID'],
                    $marketInfo['SelectedPrice'] ?? null
                );
            }
        }
    }

}
