<?php

namespace App\Application\UseCases\Shopping_List;

use App\Application\DTOs\Shopping_List_Item_DTO;
use App\Application\Interfaces\Shopping_List\I_Get_Shopping_List_Item_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use InvalidArgumentException;

class Get_Shopping_List_Item_Use_Case implements I_Get_Shopping_List_Item_Use_Case
{
    private I_Shopping_List_Item_Repository $repository;

    public function __construct(I_Shopping_List_Item_Repository $repository)
    {
        $this->repository = $repository;
    }

    public function getById(int $id): Shopping_List_Item_DTO
    {
        $item = $this->repository->findById($id);
        if (!$item) {
            throw new InvalidArgumentException("ShoppingListItem not found.");
        }

        return new Shopping_List_Item_DTO($item);
    }
}
