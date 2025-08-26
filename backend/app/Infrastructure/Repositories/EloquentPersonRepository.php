<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Person;
use App\Infrastructure\Models\Person as PersonModel;

class EloquentPersonRepository implements PersonRepositoryInterface
{
    public function findAll(): array
    {
        $models = PersonModel::all();

        return $models->map(fn($m) => new Person(
            $m->PersonID,
            $m->name,
            $m->email,
            $m->phone
        ))->all();
    }

    public function findById(int $PersonID): ?Person
    {
        $model = PersonModel::find($PersonID);
        if (!$model) return null;

        return new Person(
            $model->PersonID,
            $model->name,
            $model->email,
            $model->phone
        );
    }

    public function create(Person $person): Person
    {
        $model = new PersonModel();
        $model->name  = $person->name;
        $model->email = $person->email;
        $model->phone = $person->phone;
        $model->save();

        return new Person(
            $model->PersonID,
            $model->name,
            $model->email,
            $model->phone
        );
    }

    public function update(Person $person): bool
    {
        $model = PersonModel::find($person->PersonID);
        if (!$model) return false;

        $model->name  = $person->name;
        $model->email = $person->email;
        $model->phone = $person->phone;
        return $model->save();
    }

    public function delete(int $PersonID): bool
    {
        $model = PersonModel::find($PersonID);
        if (!$model) return false;

        return $model->delete();
    }

    public function existsByEmail(string $email): bool
    {
        return PersonModel::where('email', $email)->exists();
    }
}
