<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Shopping_List_Item_Product_Market;

interface I_Shopping_List_Item_Product_Market_Repository
{
     public function assignMarket(int $shoppingListItemProductId, int $productMarketId): ?Shopping_List_Item_Product_Market;
}
