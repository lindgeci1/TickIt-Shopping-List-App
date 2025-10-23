<?php

namespace App\Application\Interfaces\Shopping_List;

use App\Application\DTOs\Shopping_List_Item_DTO;

interface I_Create_Shopping_List_Item_Use_Case
{
    public function create(Shopping_List_Item_DTO $dto): Shopping_List_Item_DTO;
}
