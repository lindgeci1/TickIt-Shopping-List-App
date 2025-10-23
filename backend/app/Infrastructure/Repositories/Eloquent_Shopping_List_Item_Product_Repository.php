<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Product_Repository;
use App\Infrastructure\Models\Product as ProductModel;
use App\Infrastructure\Models\Shopping_List_Item_Product_Market;
use InvalidArgumentException;
use App\Infrastructure\Models\Shopping_List_Item as Shopping_List_ItemModel;
use App\Domain\Entities\Shopping_List_Item;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Repository;

class Eloquent_Shopping_List_Item_Product_Repository implements I_Shopping_List_Item_Product_Repository
{
   public function attachMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void
    {
        foreach ($productIDs as $productID) {
            $productModel = ProductModel::find($productID);
            if (!$productModel) continue;

            foreach ($shoppingListItemIDs as $shoppingListItemID) {
                // Delete existing record in the super main table for this combination
                Shopping_List_Item_Product_Market::where('product_id', $productID)
                    ->where('shopping_list_item_id', $shoppingListItemID)
                    ->delete();

                Shopping_List_Item_Product_Market::where('product_id', $productID)
                    ->where('shopping_list_item_id', '!=', $shoppingListItemID)
                    ->delete();
            }

            // Attach the product to the shopping list(s)
            $productModel->shoppingListItems()->syncWithoutDetaching($shoppingListItemIDs);
        }
    }
    public function detachMultipleProductsFromShoppingLists(array $productIDs, array $shoppingListItemIDs): void
        {
            foreach ($productIDs as $productID) {
                $productModel = ProductModel::find($productID);
                if (!$productModel) continue;

                // 1. Delete records from shopping_list_item_product_market
                Shopping_List_Item_Product_Market::where('product_id', $productID)
                    ->whereIn('shopping_list_item_id', $shoppingListItemIDs)
                    ->delete();

                // 2. Detach from shopping_list_items pivot
                $productModel->shoppingListItems()->detach($shoppingListItemIDs);
            }
        }
     public function syncMultipleProductsToShoppingLists(array $productIDs, array $shoppingListItemIDs): void
        {
                foreach ($productIDs as $productID) {
                    $productModel = ProductModel::find($productID);
                    if (!$productModel) continue;

                    $productModel->shoppingListItems()->syncWithoutDetaching($shoppingListItemIDs);
                }
        }

    public function getMarketPhotoAndSelectedPrice(int $productID, int $shoppingListItemID): ?array
{
    $record = Shopping_List_Item_Product_Market::with('market.photo')
        ->where('product_id', $productID)
        ->where('shopping_list_item_id', $shoppingListItemID)
        ->first();

    if (!$record) {
        return null;
    }

    $market = $record->market;
    $photo = $market && $market->photo ? $market->photo : null;

    return [
        'MarketID' => $market?->market_id,
        'MarketName' => $market?->name,
        'PhotoURL' => $photo?->url,
        'PhotoPublicID' => $photo?->public_id,
        'SelectedPrice' => $record->selected_price,
    ];
}
    public function updateStatus(int $productID, ?string $status): bool
    {
        $m = ProductModel::find($productID);
        if (!$m) return false;

        $m->status = $status; // null is allowed now
        return $m->save();
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

     public function updateIsFavorite(int $productID, bool $isFavorite): bool
        {
            $productModel = ProductModel::find($productID);
            if (!$productModel) {
                return false;
            }

            $productModel->is_favorite = $isFavorite;
            return $productModel->save();
        }

        public function findProductById(int $productID): ?Product
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

         public function findShoppingListById(int $id): ?Shopping_List_Item
    {
        $m = Shopping_List_ItemModel::with(['products'])->find($id);
        if (!$m) return null;

        $item = new Shopping_List_Item(
            $m->shopping_list_item_id,
            $m->name,
            $m->added_at,
            $m->bought_at
        );

 $item->Products = $m->products
            ? $m->products->map(function ($p) {
                $product = new Product(
                    $p->product_id,
                    $p->name,
                    $p->is_favorite ?? false,
                    $p->category
                );
                $product->Photos = $p->photo ? [$p->photo->url] : [];
                $product->Status = $p->status ?? null;
                return $product;
            })->all()
            : [];



        return $item;
    }
    public function propagateBoughtProductToAllLists(int $productId, int $marketId, ?float $selectedPrice = null): void
        {
            // 1️⃣ Fetch all shopping list items containing this product
            $listItems = \App\Infrastructure\Models\Shopping_List_Item_Product::where('product_id', $productId)->get();

            foreach ($listItems as $item) {
                // 2️⃣ Update existing record or create new one in super join table
               Shopping_List_Item_Product_Market::updateOrCreate(
                    [
                        'shopping_list_item_id' => $item->shopping_list_item_id,
                        'product_id' => $productId,
                    ],
                    [
                        'market_id' => $marketId,
                        'selected_price' => $selectedPrice,
                    ]
                );
            }
        }
}
