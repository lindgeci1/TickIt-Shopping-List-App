<?php

namespace App\Application\UseCases\Shopping_List;

use App\Application\DTOs\Shopping_List_Item_DTO;
use App\Application\Interfaces\Shopping_List\I_Create_Shopping_List_Item_Use_Case;
use App\Domain\Entities\Shopping_List_Item;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use InvalidArgumentException;

class Create_Shopping_List_Item_Use_Case implements I_Create_Shopping_List_Item_Use_Case
{
    private I_Shopping_List_Item_Repository $repository;

    public function __construct(I_Shopping_List_Item_Repository $repository)
    {
        $this->repository = $repository;
    }

    public function create(Shopping_List_Item_DTO $dto): Shopping_List_Item_DTO
    {
        // Validate name
        $name = trim($dto->Name ?? '');
        if (empty($name)) {
            throw new InvalidArgumentException("Name is required.");
        }

        // Check if name already exists
        if ($this->repository->existsByName($name)) {
            throw new InvalidArgumentException("A shopping list with name '{$name}' already exists.");
        }

        // Create entity
        $item = new Shopping_List_Item(
            $dto->Shopping_List_ItemID ?? null,
            $name,
            $dto->AddedAt ?? null,
            $dto->BoughtAt ?? null
        );

        $this->repository->create($item);

        return new Shopping_List_Item_DTO($item);
    }
}
