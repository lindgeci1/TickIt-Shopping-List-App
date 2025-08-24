<?php

namespace App\Application\Services\Person;

use App\Domain\Entities\Person;
use App\Infrastructure\Repositories\PersonRepositoryInterface;
use App\Application\DTOs\PersonDto;

class GetAllPersonsService
{
    private PersonRepositoryInterface $personRepository;

    public function __construct(PersonRepositoryInterface $personRepository)
    {
        $this->personRepository = $personRepository;
    }

    // ── Get all Persons ──────────────────────────────
    public function getAll(): array
    {
        $all = $this->personRepository->findAll(); // returns array of Person entities

        // Map each entity to a DTO
        return array_map(fn(Person $p) => new PersonDto($p), $all);
    }
}
