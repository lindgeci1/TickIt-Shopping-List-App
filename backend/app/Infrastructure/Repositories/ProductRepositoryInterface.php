<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Product;

interface ProductRepositoryInterface
{
    public function findAll(): array;
    public function findById(int $ProductID): ?Product;
    public function create(Product $product): Product;
    public function update(Product $product): bool;
    public function delete(int $ProductID): bool;
    public function existsByName(string $name): bool;
    public function attachToMarkets(int $productID, array $marketIDs): void;
}
