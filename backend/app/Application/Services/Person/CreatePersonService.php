<?php

namespace App\Application\Services\Person;

use App\Domain\Entities\Person;
use App\Infrastructure\Repositories\PersonRepositoryInterface;
use App\Application\DTOs\PersonDto;
use InvalidArgumentException;

class CreatePersonService
{
    private PersonRepositoryInterface $personRepository;

    public function __construct(PersonRepositoryInterface $personRepository)
    {
        $this->personRepository = $personRepository;
    }

    // ── Create a new Person ─────────────────────────
    public function create(PersonDto $dto): PersonDto
    {
        // ── Basic validation ─────────────────────────────
        if (empty(trim($dto->name))) {
            throw new InvalidArgumentException("Name is required.");
        }
        if (empty(trim($dto->email))) {
            throw new InvalidArgumentException("Email is required.");
        }
        if (!filter_var($dto->email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format.");
        }
        if ($this->personRepository->existsByEmail($dto->email)) {
            throw new InvalidArgumentException("Email already exists.");
        }

        // Validate phone number if provided
        if ($dto->phone !== null && !is_int($dto->phone)) {
            throw new InvalidArgumentException("Phone must be an integer.");
        }
        // ── Map DTO to Entity ───────────────────────────
        $person = new Person(
            $dto->id ?? null,
            $dto->name,
            $dto->email,
            $dto->phone ?? null
        );

        // ── Save via repository ──────────────────────────
        $this->personRepository->create($person);

        // ── Return DTO based on saved entity ───────────
        return new PersonDto($person);
    }
}
