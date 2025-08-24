<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Person;

interface PersonRepositoryInterface {
public function findAll(): array;

    public function create(Person $person): void;
}
