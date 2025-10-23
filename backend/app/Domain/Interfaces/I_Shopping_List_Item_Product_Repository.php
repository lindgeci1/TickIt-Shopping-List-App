<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Product;
use App\Domain\Entities\Shopping_List_Item;

interface I_Shopping_List_Item_Product_Repository
{
    public function attachMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void;
    public function detachMultipleProductsFromShoppingLists(array $productIDs, array $shoppingListItemIDs): void;
    public function syncMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void;
    public function propagateBoughtProductToAllLists(int $productId, int $marketId, ?float $selectedPrice = null): void;
    public function getMarketPhotoAndSelectedPrice(int $productID, int $shoppingListItemID): ?array;
    public function updateStatus(int $productID, ?string $status): bool;
    public function countShoppingListsForProduct(int $productID): int;
    public function updateIsFavorite(int $productID, bool $isFavorite): bool;
    public function findProductById(int $productID): ?Product;
    public function findShoppingListById(int $id): ?Shopping_List_Item;
}
