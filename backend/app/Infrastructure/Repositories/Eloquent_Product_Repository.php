<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Product_Repository;
use App\Infrastructure\Models\Product as ProductModel;

class Eloquent_Product_Repository implements I_Product_Repository
{
    public function findAll(): array
    {
         $models = ProductModel::with('photo')->get();

            return $models->map(function($m) {
                $product = new Product(
                    $m->product_id,
                    $m->name,
                    $m->price,
                    $m->is_favorite,
                    $m->category,
                );

                // Use lowercase 'url' as per DB column
                $product->Photos = $m->photo ? [$m->photo->url] : [];

                return $product;
            })->all();
        }

    public function attachToMarkets(int $productID, array $marketIDs): void
    {
        $productModel = ProductModel::find($productID);
        if (!$productModel) return;

        // Add new markets without removing existing ones
        $productModel->markets()->syncWithoutDetaching($marketIDs);
    }

    public function detachFromMarkets(int $productID, array $marketIDs): void
    {
        $productModel = ProductModel::find($productID);
        if (!$productModel) return;

        // Remove only the given market IDs, keep the rest
        $productModel->markets()->detach($marketIDs);
    }

    public function syncMarkets(int $productID, array $marketIDs): void
    {
        $productModel = ProductModel::find($productID);
        if (!$productModel) return;

        // Replace existing markets with the new list
        $productModel->markets()->sync($marketIDs);
    }
        public function attachToShoppingListItems(int $productID, array $shoppingListItemIDs): void
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) return;

            // Add new shopping list items without removing existing ones
            $productModel->shoppingListItems()->syncWithoutDetaching($shoppingListItemIDs);
        }

        public function detachFromShoppingListItems(int $productID, array $shoppingListItemIDs): void
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) return;

            // Remove only the given shopping list item IDs, keep the rest
            $productModel->shoppingListItems()->detach($shoppingListItemIDs);
        }

        public function syncShoppingListItems(int $productID, array $shoppingListItemIDs): void
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) return;

            // Replace existing shopping list items with the new list
            $productModel->shoppingListItems()->sync($shoppingListItemIDs);
        }

    public function findById(int $productID): ?Product
{
    $m = ProductModel::with('photo', 'markets')->find($productID);
    if (!$m) return null;

    $product = new Product(
        $m->product_id,
        $m->name,
        $m->price,
        $m->is_favorite,
        $m->category,
    );

    $product->Photos = $m->photo ? [$m->photo->url] : [];

    return $product;
}

public function searchByName(string $query): array
{
    $models = ProductModel::with('photo')
        ->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($query) . '%'])
        ->get();

    return $models->map(function($m) {
        $product = new Product(
            $m->product_id,
            $m->name,
            $m->price,
            $m->is_favorite,
            $m->category
        );

        $product->Photos = $m->photo ? [$m->photo->url] : [];

        return $product;
    })->all();
}



    public function create(Product $product): Product
    {
        $m = new ProductModel();
        $m->name = $product->Name;
        $m->price = $product->Price;
        $m->is_favorite = $product->IsFavorite;
        $m->category = $product->Category;
        $m->save();

        return new Product(
            $m->product_id,
            $m->name,
            $m->price,
            $m->is_favorite,
            $m->category,
        );
    }

    public function update(Product $product): bool
    {
        $m = ProductModel::find($product->ProductID);
        if (!$m) return false;

        $m->name = $product->Name;
        $m->price = $product->Price;
        $m->is_favorite = $product->IsFavorite;
        $m->category = $product->Category;
        $saved = $m->save();

        if (!empty($product->Markets)) {
            $m->markets()->sync($product->Markets);
        }

        return $saved;
    }

    public function delete(int $productID): bool
    {
        $m = ProductModel::find($productID);
        if (!$m) return false;
        return $m->delete();
    }

    public function existsByName(string $name): bool
    {
        return ProductModel::where('name', $name)->exists();
    }
}
