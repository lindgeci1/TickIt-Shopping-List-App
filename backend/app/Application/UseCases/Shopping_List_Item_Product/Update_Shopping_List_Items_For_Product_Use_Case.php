<?php

namespace App\Application\UseCases\Shopping_List_Item_Product;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Update_Shopping_List_Items_For_Product_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Repository;
use App\Domain\Interfaces\I_Product_Repository;
use App\Application\DTOs\Update_Products_To_Shopping_List_Item_DTO;
use InvalidArgumentException;

class Update_Shopping_List_Items_For_Product_Use_Case implements I_Update_Shopping_List_Items_For_Product_Use_Case
{
 private I_Shopping_List_Item_Product_Repository $shoppingListItemProductRepository;
 private I_Product_Repository $productRepository;

    public function __construct(
        I_Shopping_List_Item_Product_Repository $shoppingListItemProductRepository,
        I_Product_Repository $productRepository
    ) {
        $this->shoppingListItemProductRepository = $shoppingListItemProductRepository;
        $this->productRepository = $productRepository;
    }

    public function update(Update_Products_To_Shopping_List_Item_DTO $dto): void
    {
        // 1️⃣ Check if all products exist
        foreach ($dto->ProductIDs as $productID) {
            if (!$this->shoppingListItemProductRepository->findProductById($productID)) {
                throw new InvalidArgumentException("Product with ID {$productID} does not exist.");
            }
        }

        // 2️⃣ Check if all shopping list items exist
        foreach ($dto->ShoppingListItemIDs as $shoppingListItemId) {
            if (!$this->shoppingListItemProductRepository->findShoppingListById($shoppingListItemId)) {
                throw new InvalidArgumentException("Shopping List Item with ID $shoppingListItemId does not exist.");
            }
        }

        // 3️⃣ Sync products to the lists — removes old associations, avoids duplicates
        $this->shoppingListItemProductRepository->syncMultipleProductsToShoppingLists($dto->ProductIDs, $dto->ShoppingListItemIDs);

        // 4️⃣ Update product status globally
        foreach ($dto->ProductIDs as $productID) {
            $this->shoppingListItemProductRepository->updateStatus($productID, 'Bought'); // or 'ToBuy'

            // 5️⃣ Propagate market info to all shopping lists containing the product
            // Fetch the first existing market info for this product, if any
            $marketInfo = $this->productRepository->getMarketPhotoAndSelectedPrice($productID, $dto->ShoppingListItemIDs[0] ?? 0);
            if ($marketInfo) {
                $this->shoppingListItemProductRepository->propagateBoughtProductToAllLists(
                    $productID,
                    $marketInfo['MarketID'],
                    $marketInfo['SelectedPrice'] ?? null
                );
            }
        }
    }

}
