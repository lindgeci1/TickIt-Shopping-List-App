<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Shopping_List_Item;
use App\Domain\Entities\Product;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Infrastructure\Models\Shopping_List_Item as Shopping_List_ItemModel;

class Eloquent_Shopping_List_Item_Repository implements I_Shopping_List_Item_Repository
{
    public function findAll(): array
    {
        $models = Shopping_List_ItemModel::with(['products'])->get();

        return $models->map(function ($m) {
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
            $p->price,
            $p->is_favorite ?? false,
            $p->category
        );
        // Single photo relationship
        $product->Photos = $p->photo ? [$p->photo->url] : [];
        return $product;
    })->all()
    : [];


            return $item;
        })->all();
    }

    public function findById(int $id): ?Shopping_List_Item
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
            $p->price,
            $p->is_favorite ?? false,
            $p->category
        );
        // Single photo relationship
        $product->Photos = $p->photo ? [$p->photo->url] : [];
        return $product;
    })->all()
    : [];



        return $item;
    }

    public function create(Shopping_List_Item $item): Shopping_List_Item
    {
        $m = new Shopping_List_ItemModel();
        $m->name = $item->Name;
        $m->added_at = $item->AddedAt;
        $m->bought_at = $item->BoughtAt;
        $m->save();

        $item->Shopping_List_ItemID = $m->shopping_list_item_id;
        return $item;
    }

    public function update(Shopping_List_Item $item): bool
    {
        $m = Shopping_List_ItemModel::find($item->Shopping_List_ItemID);
        if (!$m) return false;

        $m->name = $item->Name;
        $m->added_at = $item->AddedAt;
        $m->bought_at = $item->BoughtAt;

        return $m->save();
    }

    public function delete(int $id): bool
    {
        $m = Shopping_List_ItemModel::find($id);
        if (!$m) return false;

        return $m->delete();
    }


        public function existsByName(string $name, ?int $excludeId = null): bool
        {
            $query = Shopping_List_ItemModel::where('name', $name);
            if ($excludeId !== null) {
                $query->where('shopping_list_item_id', '<>', $excludeId);
            }
            return $query->exists();
        }

}
