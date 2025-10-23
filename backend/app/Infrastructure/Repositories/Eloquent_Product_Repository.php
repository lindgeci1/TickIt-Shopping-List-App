<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Product_Repository;
use App\Infrastructure\Models\Product as ProductModel;
use App\Infrastructure\Models\Shopping_List_Item_Product_Market;
use InvalidArgumentException;
use App\Infrastructure\Models\Product_Market;
class Eloquent_Product_Repository implements I_Product_Repository
{
    public function removeFromShoppingList(int $productID, int $shoppingListItemID): void
    {
        Shopping_List_Item_Product_Market::where('product_id', $productID)
        ->where('shopping_list_item_id', $shoppingListItemID)
        ->delete();
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

        public function findAllCategories(): array
        {
            return ProductModel::query()
                ->select('category')
                ->distinct()
                ->pluck('category')
                ->toArray();
        }

        public function findByCategory(string $category): array
        {
            $models = ProductModel::with('photo')
                ->where('category', $category)
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
        public function getMarketsWithPriceAndPhoto(int $productID): array
        {
            $productModel = ProductModel::with(['markets.photo'])->find($productID);
            if (!$productModel) {
                return [];
            }

            // Map markets to simple array including photo and price
            return $productModel->markets->map(function ($market) {
                return [
                    'MarketID' => $market->market_id,
                    'Name'     => $market->name,
                    'Price'    => $market->pivot->price ?? null,        // price from product_market pivot
                    'PhotoURL' => $market->photo ? $market->photo->url : null, // photo from market_photos table
                ];
            })->all();
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

public function importProductsFromApi(int $perPage = 11): array
{
    $apiUrl = env('PRODUCT_API_URL');
    if (!$apiUrl) {
        throw new InvalidArgumentException('PRODUCT_API_URL not defined in .env');
    }

    $response = file_get_contents($apiUrl . "?organization_id=9&per_page={$perPage}");
    $json = json_decode($response, true);

    if (empty($json['data'])) {
        return [];
    }

    $createdProducts = [];
    $photoRepo = new Eloquent_Product_Photo_Repository();

    foreach ($json['data'] as $item) {
        $name = $item['name'] ?? null;
        $category = $item['category_name'] ?? 'Uncategorized';
        $images = $item['images'] ?? null;
        $price = $item['base_price'] ?? null; // <— take base_price from API

        if (!$name) continue;
        if ($this->existsByName($name)) continue;

        // Create product
        $product = new Product(null, $name, false, $category);
        $savedProduct = $this->create($product);

        // Save product images
        if (!empty($images) && is_array($images)) {
            foreach ($images as $imageUrl) {
                if (!is_string($imageUrl)) continue;
                if (!str_starts_with($imageUrl, 'http')) {
                    $imageUrl = '//' . ltrim($imageUrl, '/');
                }

                $photoEntity = new \App\Domain\Entities\Product_Photo(
                    null,
                    $imageUrl,
                    '',
                    $savedProduct->ProductID
                );
                $photoRepo->add($photoEntity);
            }
        }

        // ✅ Insert into product_market table

        if ($price !== null) {
            Product_Market::create([
                'product_id' => $savedProduct->ProductID,
                'market_id'  => 1,
                'price'      => $price,
            ]);
        }

        $createdProducts[] = $savedProduct;
    }

    return $createdProducts;
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

}
