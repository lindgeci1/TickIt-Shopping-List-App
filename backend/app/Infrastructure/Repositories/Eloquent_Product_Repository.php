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
                    $m->is_favorite,
                    $m->category,
                );

                // Use lowercase 'url' as per DB column
                $product->Photos = $m->photo ? [$m->photo->url] : [];

                return $product;
            })->all();
        }
        public function countShoppingListsForProduct(int $productID): int
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) {
                return 0;
            }

            // Count how many shopping list items this product is attached to
            return $productModel->shoppingListItems()->count();
        }
        public function findFavorites(): array
        {
            $models = ProductModel::with('photo')
                ->where('is_favorite', true)
                ->get();

            return $models->map(function ($m) {
                $product = new Product(
                    $m->product_id,
                    $m->name,
                    $m->is_favorite,
                    $m->category
                );

                $product->Photos = $m->photo ? [$m->photo->url] : [];

                return $product;
            })->all();
        }

        public function updateIsFavorite(int $productID, bool $isFavorite): bool
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) {
                return false;
            }

            $productModel->is_favorite = $isFavorite;
            return $productModel->save();
        }

        public function attachToMarkets(int $productID, array $marketsWithPrices): void
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) return;

            // Prepare data for syncWithoutDetaching
            // $marketsWithPrices should be in the form: [marketId => ['price' => 2.5], ...]
            $attachData = [];
            foreach ($marketsWithPrices as $market) {
                $attachData[$market['MarketID']] = ['price' => $market['Price']];
            }

            // Attach markets with their respective prices
            $productModel->markets()->syncWithoutDetaching($attachData);
        }


    public function detachFromMarkets(int $productID, array $marketIDs): void
    {
        $productModel = ProductModel::find($productID);
        if (!$productModel) return;

        // Detach the product from the given markets
        $productModel->markets()->detach($marketIDs);
    }

    public function syncMarkets(int $productID, array $marketIDs): void
    {
        $productModel = ProductModel::find($productID);
        if (!$productModel) return;

        // Replace existing markets with the new list
        $productModel->markets()->sync($marketIDs);
    }
        public function attachMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void
        {
            foreach ($productIDs as $productID) {
                $productModel = ProductModel::find($productID);
                if (!$productModel) continue;

                $productModel->shoppingListItems()->syncWithoutDetaching($shoppingListItemIDs);
            }
        }


        public function detachMultipleProductsFromShoppingLists(array $productIDs, array $shoppingListItemIDs): void
        {
            foreach ($productIDs as $productID) {
                $productModel = ProductModel::find($productID);
                if (!$productModel) continue;

                // Detach only the given shopping list items, keep the rest
                $productModel->shoppingListItems()->detach($shoppingListItemIDs);
            }
        }

            public function syncMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void
            {
                foreach ($productIDs as $productID) {
                    $productModel = ProductModel::find($productID);
                    if (!$productModel) continue;

                    // Replace existing shopping list items with the new list
                    $productModel->shoppingListItems()->sync($shoppingListItemIDs);
                }
            }


    public function findById(int $productID): ?Product
{
    $m = ProductModel::with('photo', 'markets')->find($productID);
    if (!$m) return null;

    $product = new Product(
        $m->product_id,
        $m->name,
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
        $m->is_favorite = $product->IsFavorite;
        $m->category = $product->Category;
        $m->save();

        return new Product(
            $m->product_id,
            $m->name,
            $m->is_favorite,
            $m->category,
        );
    }

    public function update(Product $product): bool
    {
        $m = ProductModel::find($product->ProductID);
        if (!$m) return false;

        $m->name = $product->Name;
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

public function updateStatus(int $productID, ?string $status): bool
{
    $m = ProductModel::find($productID);
    if (!$m) return false;

    $m->status = $status; // null is allowed now
    return $m->save();
}


}
