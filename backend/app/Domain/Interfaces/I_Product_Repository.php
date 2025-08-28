<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Product;

interface I_Product_Repository
{
    public function findAll(): array;
    public function findById(int $ProductID): ?Product;
    public function create(Product $product): Product;
    public function update(Product $product): bool;
    public function delete(int $ProductID): bool;
    public function existsByName(string $name): bool;
    public function attachToMarkets(int $productID, array $marketIDs): void;
}
