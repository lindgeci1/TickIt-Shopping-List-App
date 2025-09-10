<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Shopping_List_Item;

interface I_Shopping_List_Item_Repository
{
    public function findAll(): array;
    public function findById(int $id): ?Shopping_List_Item;
    public function create(Shopping_List_Item $item): Shopping_List_Item;
    public function update(Shopping_List_Item $item): bool;
    public function delete(int $id): bool;
    // I_Shopping_List_Item_Repository.php
    public function existsByName(string $name, ?int $excludeId = null): bool;

}
