<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Market;
use App\Infrastructure\Models\Product;
use App\Domain\Interfaces\I_Market_Repository;
use App\Infrastructure\Models\Market as MarketModel;
use App\Domain\Entities\Product as ProductEntity;
use App\Domain\Entities\Market as MarketEntity;
use App\Infrastructure\Models\Product_Market;
class Eloquent_Market_Repository implements I_Market_Repository
{


public function findAll(): array
{
    $models = MarketModel::with(['photo', 'products.photo'])->get();

    return $models->map(function ($m) {
        $market = new Market(
            $m->market_id,
            $m->name,
            $m->location
        );

        // Add market photo if exists
        $market->Photos = $m->photo ? [$m->photo->url] : [];

        // Map linked products and attach price separately
        $market->Products = $m->products->map(function ($p) use ($m) {

            // Create the product entity (no price property)
            $product = new ProductEntity(
                $p->product_id,
                $p->name,
                $p->is_favorite,
                $p->category
            );

            $product->Photos = $p->photo ? [$p->photo->url] : [];

            // 🔍 Find pivot price for this specific product-market pair
            $pivot = Product_Market::where('product_id', $p->product_id)
                ->where('market_id', $m->market_id)
                ->first();

            // ✅ Return a structured array with product data + price separately
            return [
                'Product' => $product,
                'FinalPrice' => $pivot ? (float) $pivot->final_price : null // ✅ cast to float
            ];
        })->all();

        return $market;
    })->all();
}

public function findAllMarketsOnly(): array
{
    // Fetch all markets without products
    $models = MarketModel::with('photo')->get(); // eager load photo

    return $models->map(function ($m) {
        $market = new Market(
            $m->market_id,
            $m->name,
            $m->location
        );

        // Add market photo if exists
        $market->Photos = $m->photo ? [$m->photo->url] : [];

        return $market;
    })->all();
}


public function getCheapestMarketForProduct(int $productId): ?array
{
    // Load product with all linked markets and their photos, including pivot price
    $product = Product::with(['markets.photo'])->find($productId);

    if (!$product || $product->markets->isEmpty()) {
        return null;
    }

    // Make sure pivot price is loaded
    $product->markets->each(function ($market) {
        $market->pivot->price = $market->pivot->price ?? 0;
    });

    // Find the market with the cheapest price
    $cheapestMarket = $product->markets->sortBy(fn($m) => $m->pivot->final_price)->first();

    return [
        'MarketID' => $cheapestMarket->market_id,
        'Name'     => $cheapestMarket->name,
        'Logo'     => optional($cheapestMarket->photo)->url,
        'FinalPrice'    => (float)$cheapestMarket->pivot->final_price,  // <-- included here
    ];
}


    public function findById(int $MarketID): ?Market
    {
        $model = MarketModel::with(['photo', 'products.photo'])->find($MarketID);
        if (!$model) return null;

        $market = new Market(
            $model->market_id,
            $model->name,
            $model->location
        );

        $market->Photos = $model->photo ? [$model->photo->url] : [];

        $market->Products = $model->products->map(function ($p) {
            $product = new ProductEntity(
                $p->product_id,
                $p->name,
                $p->is_favorite,
                $p->category
            );
            $product->Photos = $p->photo ? [$p->photo->url] : [];
            return $product;
        })->all();

        return $market;
    }


    public function create(Market $market): Market
    {
        $model = new MarketModel();
        $model->name     = $market->Name;     // map from entity
        $model->location = $market->Location; // map from entity
        $model->save();

        return new Market(
            $model->market_id, // lowercase DB field
            $model->name,
            $model->location
        );
    }

    public function update(Market $market): bool
    {
        $model = MarketModel::find($market->MarketID);
        if (!$model) return false;

        $model->name     = $market->Name;
        $model->location = $market->Location;
        return $model->save();
    }

    public function delete(int $MarketID): bool
    {
        $model = MarketModel::find($MarketID);
        if (!$model) return false;

        return $model->delete();
    }

    public function existsByName(string $name): bool
    {
        return MarketModel::where('name', $name)->exists();
    }
}
