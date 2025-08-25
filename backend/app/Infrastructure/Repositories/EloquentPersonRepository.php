<?php

namespace App\Infrastructure\Repositories;

use Illuminate\Support\Facades\Log;
use App\Domain\Entities\Person;
use App\Infrastructure\Models\Person as PersonModel;

class EloquentPersonRepository implements PersonRepositoryInterface
{
// Return all Person models directly
    public function findAll(): array
    {
        // Fetch all Person models from the database
        $models = PersonModel::all();

        // Map each model to a domain Person entity with attributes
        return $models->map(fn($m) => new Person(
            $m->id,
            $m->name,
            $m->email,
            $m->phone
            // Add other attributes here if your Person entity has them
        ))->all();
    }

    // Save a new Person model without specifying attributes
        public function create(Person $person): void
        {
            $model = new PersonModel();
            $model->name  = $person->name;
            $model->email = $person->email;
            $model->phone = $person->phone; // optional
            $model->save();
        }

    public function existsByEmail(string $email): bool
    {
        return PersonModel::where('email', $email)->exists();
    }

}
