<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Market;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Market_Repository;
use App\Infrastructure\Models\Market as MarketModel;

class Eloquent_Market_Repository implements I_Market_Repository
{
    public function findAll(): array
    {
        // Include 1-to-1 photo and linked products
        $models = MarketModel::with(['photo', 'products.photo'])->get();

        return $models->map(function ($m) {
            $market = new Market(
                $m->market_id,
                $m->name,
                $m->location
            );

            // Add photo if exists
            $market->Photos = $m->photo ? [$m->photo->url] : [];

            // Map linked products
            $market->Products = $m->products->map(function ($p) {
                $product = new Product(
                    $p->product_id,
                    $p->name,
                    $p->is_favorite,
                    $p->category
                );
                $product->Photos = $p->photo ? [$p->photo->url] : [];
                return $product;
            })->all();

            return $market;
        })->all();
    }
    //! duke qita me e ndreqe
        public function getMarketsForProduct(int $productId): array
        {
            // Join product_market and market_photos to get price and logo URL
            $markets = MarketModel::query()
                ->join('product_market', 'markets.market_id', '=', 'product_market.market_id')
                ->leftJoin('market_photos', 'markets.market_id', '=', 'market_photos.market_id')
                ->where('product_market.product_id', $productId)
                ->select(
                    'markets.market_id as MarketID',
                    'markets.name as Name',
                    'market_photos.url as Logo', // get logo from market_photos
                    'product_market.price as Price'
                )
                ->get()
                ->toArray();

            return $markets;
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
            $product = new Product(
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
