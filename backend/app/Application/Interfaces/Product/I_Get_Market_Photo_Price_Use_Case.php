<?php

namespace App\Application\Interfaces\Product;

use App\Application\DTOs\Market_Photo_Price_DTO;

interface I_Get_Market_Photo_Price_Use_Case
{
    public function getMarketPhotoAndSelectedPrice(int $productID, int $shoppingListItemID): ?Market_Photo_Price_DTO;
}
