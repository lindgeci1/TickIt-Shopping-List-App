<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Market;

interface MarketRepositoryInterface
{

    public function findAll(): array;
    public function findById(int $MarketID): ?Market;
    public function create(Market $market): Market;
    public function update(Market $market): bool;
    public function delete(int $MarketID): bool;
    public function existsByName(string $name): bool;
}
