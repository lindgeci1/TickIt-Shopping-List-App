<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Product;
use App\Infrastructure\Models\Product as ProductModel;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function findAll(): array
    {
        $models = ProductModel::with('markets')->get();
        return $models->map(fn($m) => new Product(
            $m->product_id,
            $m->name,
            $m->description,
            $m->price,
            $m->is_favorite,
            $m->category,
        ))->all();
    }

    public function attachToMarkets(int $productID, array $marketIDs): void
    {
        $productModel = ProductModel::find($productID);
        if (!$productModel) return;

        // Add new markets without removing existing ones
        $productModel->markets()->syncWithoutDetaching($marketIDs);
    }


    public function findById(int $productID): ?Product
    {
        $m = ProductModel::with('markets')->find($productID);
        if (!$m) return null;

        return new Product(
            $m->product_id,
            $m->name,
            $m->description,
            $m->price,
            $m->is_favorite,
            $m->category,
        );
    }

    public function create(Product $product): Product
    {
        $m = new ProductModel();
        $m->name = $product->Name;
        $m->description = $product->Description;
        $m->price = $product->Price;
        $m->is_favorite = $product->IsFavorite;
        $m->category = $product->Category;
        $m->save();

        return new Product(
            $m->product_id,
            $m->name,
            $m->description,
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
        $m->description = $product->Description;
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
