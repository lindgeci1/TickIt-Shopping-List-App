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

    public function delete(int $id): string
    {
        $existing = $this->personRepository->findById($id);
        if (!$existing) {
            throw new InvalidArgumentException("Person not found.");
        }

        $deleted = $this->personRepository->delete($id);

        if ($deleted) {
            return "Person deleted successfully.";
        }

        throw new \RuntimeException("Failed to delete person.");
    }
}
