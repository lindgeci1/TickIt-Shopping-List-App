<?php

namespace App\Application\Services\Person;

use App\Domain\Entities\Person;
use App\Infrastructure\Repositories\PersonRepositoryInterface;
use App\Application\DTOs\PersonDto;
use InvalidArgumentException;

class UpdatePersonService
{
    private PersonRepositoryInterface $personRepository;

    public function __construct(PersonRepositoryInterface $personRepository)
    {
        $this->personRepository = $personRepository;
    }

    public function update(PersonDto $dto): PersonDto
    {
        if (!$dto->PersonID) {
            throw new InvalidArgumentException("PersonID is required for update.");
        }

        $existing = $this->personRepository->findById($dto->PersonID);
        if (!$existing) {
            throw new InvalidArgumentException("Person not found.");
        }

        if (empty(trim($dto->name))) {
            throw new InvalidArgumentException("Name is required.");
        }

        if (empty(trim($dto->email))) {
            throw new InvalidArgumentException("Email is required.");
        }

        if (!filter_var($dto->email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format.");
        }

        // Validate phone
        if ($dto->phone !== null && !is_int($dto->phone)) {
            throw new InvalidArgumentException("Phone must be an integer.");
        }

        $person = new Person(
            $dto->PersonID,
            $dto->name,
            $dto->email,
            $dto->phone ?? null
        );

        $this->personRepository->update($person);

        return new PersonDto($person);
    }
}
