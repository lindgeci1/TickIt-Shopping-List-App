<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Shopping_List_Item;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Infrastructure\Models\Shopping_List_Item as Shopping_List_ItemModel;

class Eloquent_Shopping_List_Item_Repository implements I_Shopping_List_Item_Repository
{
    public function findAll(): array
    {
        $models = Shopping_List_ItemModel::all();
        return $models->map(fn($m) => new Shopping_List_Item(
            $m->shopping_list_item_id,
            $m->product_id,
            $m->status,
            $m->added_at,
            $m->bought_at
        ))->all();
    }

    public function findById(int $id): ?Shopping_List_Item
    {
        $m = Shopping_List_ItemModel::with('product')->find($id);
        if (!$m) return null;

        return new Shopping_List_Item(
            $m->shopping_list_item_id,
            $m->product_id,
            $m->status,
            $m->added_at,
            $m->bought_at
        );
    }

    public function create(Shopping_List_Item $item): Shopping_List_Item
    {
        $m = new Shopping_List_ItemModel();
        $m->product_id = $item->ProductID;
        $m->status = $item->Status;
        $m->added_at = $item->AddedAt;
        $m->bought_at = $item->BoughtAt;
        $m->save();

        $item->ShoppingListItemID = $m->shopping_list_item_id;
        return $item;
    }

    public function update(Shopping_List_Item $item): bool
    {
        $m = Shopping_List_ItemModel::find($item->Shopping_List_ItemID);
        if (!$m) return false;

        $m->product_id = $item->ProductID;
        $m->status = $item->Status;
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
}
