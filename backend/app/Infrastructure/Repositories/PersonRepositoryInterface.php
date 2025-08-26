<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Person;

interface PersonRepositoryInterface
{
    public function findAll(): array;

    public function findById(int $id): ?Person;

    public function create(Person $person): Person;

    public function update(Person $person): bool;

    public function delete(int $id): bool;

    public function existsByEmail(string $email): bool;
}
