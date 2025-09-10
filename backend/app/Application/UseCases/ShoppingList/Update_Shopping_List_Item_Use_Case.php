<?php

namespace App\Application\UseCases\ShoppingList;

use App\Application\DTOs\Shopping_List_Item_DTO;
use App\Application\Interfaces\ShoppingList\I_Update_Shopping_List_Item_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Domain\Entities\Shopping_List_Item;
use InvalidArgumentException;

class Update_Shopping_List_Item_Use_Case implements I_Update_Shopping_List_Item_Use_Case
{
    private I_Shopping_List_Item_Repository $shoppingListRepository;

    public function __construct(I_Shopping_List_Item_Repository $shoppingListRepository)
    {
        $this->shoppingListRepository = $shoppingListRepository;
    }

    public function update(Shopping_List_Item_DTO $dto): Shopping_List_Item_DTO
    {
        if (!$dto->Shopping_List_ItemID) {
            throw new InvalidArgumentException("ShoppingListItemID is required for update.");
        }

        $existing = $this->shoppingListRepository->findById($dto->Shopping_List_ItemID);
        if (!$existing) {
            throw new InvalidArgumentException("Shopping list item not found.");
        }

        // Validate status
        if (!in_array($dto->Status, ['ToBuy', 'Bought'])) {
            throw new InvalidArgumentException("Status must be 'ToBuy' or 'Bought'.");
        }

        // Determine name: use DTO name if provided, else keep existing
        $name = $dto->Name ?? $existing->Name;

// Check for duplicate name (exclude current item)
if ($this->shoppingListRepository->existsByName($name, $dto->Shopping_List_ItemID)) {
    throw new InvalidArgumentException("A shopping list item with name '$name' already exists.");
}



        // Create updated entity with name
        $item = new Shopping_List_Item(
            $dto->Shopping_List_ItemID,
            $name,
            $dto->Status,
            $dto->AddedAt,
            $dto->BoughtAt
        );

        $this->shoppingListRepository->update($item);

        return new Shopping_List_Item_DTO($item);
    }
}
