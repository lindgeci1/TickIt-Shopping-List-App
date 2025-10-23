<?php

namespace App\Application\UseCases\Shopping_List;

use App\Application\Interfaces\Shopping_List\I_Delete_Shopping_List_Item_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use InvalidArgumentException;

class Delete_Shopping_List_Item_Use_Case implements I_Delete_Shopping_List_Item_Use_Case
{
    private I_Shopping_List_Item_Repository $repository;

    public function __construct(I_Shopping_List_Item_Repository $repository)
    {
        $this->repository = $repository;
    }

    public function delete(int $id): string
    {
        $existing = $this->repository->findById($id);
        if (!$existing) {
            throw new InvalidArgumentException("ShoppingListItem not found.");
        }

        $deleted = $this->repository->delete($id);
        if ($deleted) {
            return "ShoppingListItem deleted successfully.";
        }

        throw new \RuntimeException("Failed to delete ShoppingListItem.");
    }
}
