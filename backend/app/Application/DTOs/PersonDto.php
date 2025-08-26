<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Person;

/**
 * @OA\Schema(
 *     schema="PersonDto",
 *     type="object",
 *     required={"name","email"},
 *     @OA\Property(property="PersonID", type="integer", nullable=true),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string"),
 *     @OA\Property(property="phone", type="integer", nullable=true)
 * )
 */
class PersonDto
{
    public ?int $PersonID = null;
    public string $name;
    public string $email;
    public ?int $phone = null;

    public function __construct(?Person $person = null)
    {
        if ($person) {
            $this->PersonID = $person->PersonID;
            $this->name     = $person->name;
            $this->email    = $person->email;
            $this->phone    = $person->phone;
        }
    }
}
