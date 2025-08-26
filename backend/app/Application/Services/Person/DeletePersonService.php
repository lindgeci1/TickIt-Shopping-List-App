<?php

namespace App\Application\Services\Person;

use App\Infrastructure\Repositories\PersonRepositoryInterface;
use InvalidArgumentException;

class DeletePersonService
{
    private PersonRepositoryInterface $personRepository;

    public function __construct(PersonRepositoryInterface $personRepository)
    {
        $this->personRepository = $personRepository;
    }

    public function delete(int $PersonID): string
    {
        $existing = $this->personRepository->findById($PersonID);
        if (!$existing) {
            throw new InvalidArgumentException("Person not found.");
        }

        $deleted = $this->personRepository->delete($PersonID);

        if ($deleted) {
            return "Person deleted successfully.";
        }

        throw new \RuntimeException("Failed to delete person.");
    }
}
