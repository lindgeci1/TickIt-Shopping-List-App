<?php

namespace App\Domain\Entities;

class Person
{

    public ?int $id; 
    public string $name;
    public string $email;
    public ?string $phone = null;

    public function __construct(?int $id, string $name, string $email, ?string $phone = null)
    {
        $this->id    = $id;
        $this->name  = $name;
        $this->email = $email;
        $this->phone = $phone;
    }
}
