<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Product;

interface I_Product_Repository
{
    public function findAll(): array;
    public function findById(int $ProductID): ?Product;
    public function create(Product $product): Product;
    public function update(Product $product): bool;
    public function delete(int $ProductID): bool;
    public function existsByName(string $name): bool;
    public function attachToMarkets(int $productID, array $marketsWithPrices): void;
    public function detachFromMarkets(int $productID, array $marketIDs): void;
    public function syncMarkets(int $productID, array $marketIDs): void;
    public function searchByName(string $query): array;
    public function attachMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void;
    public function detachMultipleProductsFromShoppingLists(array $productIDs, array $shoppingListItemIDs): void;
     public function syncMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void;
    public function updateStatus(int $productID, ?string $status): bool;
}
