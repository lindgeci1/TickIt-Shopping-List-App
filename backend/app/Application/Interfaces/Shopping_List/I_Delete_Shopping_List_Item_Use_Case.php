<?php

namespace App\Application\Interfaces\Shopping_List;

interface I_Delete_Shopping_List_Item_Use_Case
{

    public function delete(int $ShoppingListItemID): string;
}
