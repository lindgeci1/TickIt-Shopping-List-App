<?php

namespace App\Domain\Entities;

class Person
{
    public ?int $PersonID; 
    public string $name;
    public string $email;
    public ?int $phone = null;

    public function __construct(?int $PersonID, string $name, string $email, ?int $phone = null)
    {
        $this->PersonID = $PersonID;
        $this->name     = $name;
        $this->email    = $email;
        $this->phone    = $phone;
    }

    public array $vehicles = [];
}
