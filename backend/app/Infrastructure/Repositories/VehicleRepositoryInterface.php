<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Vehicle;

interface VehicleRepositoryInterface
{
    public function findAll(): array;

    public function findById(int $VehicleID): ?Vehicle;

    public function create(Vehicle $vehicle): Vehicle;

    public function update(Vehicle $vehicle): bool;

    public function delete(int $VehicleID): bool;

    public function existsByPersonId(int $PersonID): bool;
}
