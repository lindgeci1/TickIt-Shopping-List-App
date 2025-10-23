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
    public function findFavorites(): array;
    public function findByCategory(string $category): array;
    public function findAllCategories(): array;
    public function getMarketsWithPriceAndPhoto(int $productID): array;
    public function getMarketPhotoAndSelectedPrice(int $productID, int $shoppingListItemID): ?array;
    public function removeFromShoppingList(int $productID, int $shoppingListItemID): void;
    public function importProductsFromApi(int $perPage = 11): array;

}
