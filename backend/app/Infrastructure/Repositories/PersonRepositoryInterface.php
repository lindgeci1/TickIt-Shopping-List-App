<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Person;

interface PersonRepositoryInterface
{
    public function findAll(): array;

    public function findById(int $PersonID): ?Person;

    public function create(Person $person): Person;

    public function update(Person $person): bool;

    public function delete(int $PersonID): bool;

    public function existsByEmail(string $email): bool;
}
