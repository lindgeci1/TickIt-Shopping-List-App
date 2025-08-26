<?php

namespace App\Application\Services\Person;

use App\Application\DTOs\PersonDto;
use App\Infrastructure\Repositories\PersonRepositoryInterface;
use InvalidArgumentException;

class GetPersonService
{
    private PersonRepositoryInterface $personRepository;

    public function __construct(PersonRepositoryInterface $personRepository)
    {
        $this->personRepository = $personRepository;
    }

    public function getById(int $id): PersonDto
    {
        $person = $this->personRepository->findById($id);

        if (!$person) {
            throw new InvalidArgumentException("Person not found.");
        }

        return new PersonDto($person);
    }
}
