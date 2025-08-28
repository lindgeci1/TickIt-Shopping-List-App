<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Market;
use App\Domain\Interfaces\I_Market_Repository;
use App\Infrastructure\Models\Market as MarketModel;

class Eloquent_Market_Repository implements I_Market_Repository
{
    public function findAll(): array
    {
        $models = MarketModel::all();

        return $models->map(fn($m) => new Market(
            $m->market_id,  // lowercase DB field
            $m->name,       // lowercase DB field
            $m->location    // lowercase DB field
        ))->all();
    }

    public function findById(int $MarketID): ?Market
    {
        $model = MarketModel::find($MarketID);
        if (!$model) return null;

        return new Market(
            $model->market_id, // lowercase DB field
            $model->name,      // lowercase DB field
            $model->location   // lowercase DB field
        );
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
