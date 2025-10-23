<?php

namespace App\Application\UseCases\ShoppingList;

use App\Application\DTOs\Shopping_List_Item_DTO;
use App\Application\Interfaces\ShoppingList\I_Get_All_Shopping_List_Items_Use_Case;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Domain\Entities\Shopping_List_Item;

class Get_All_Shopping_List_Items_Use_Case implements I_Get_All_Shopping_List_Items_Use_Case
{
    private I_Shopping_List_Item_Repository $shoppingListRepository;

    public function __construct(I_Shopping_List_Item_Repository $shoppingListRepository)
    {
        $this->shoppingListRepository = $shoppingListRepository;
    }

    public function getAll(): array
    {
        $all = $this->shoppingListRepository->findAll();

        return array_map(fn(Shopping_List_Item $item) => new Shopping_List_Item_DTO($item), $all);
    }
}
