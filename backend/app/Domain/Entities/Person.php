<?php

namespace App\Domain\Entities;

class Person
{
    public string $name;
    public string $email;
    public ?string $phone = null;

    public function __construct(string $name, string $email, ?string $phone = null)
    {
        $this->name  = $name;
        $this->email = $email;
        $this->phone = $phone;
    }

    public array $vehicles = [];
}
