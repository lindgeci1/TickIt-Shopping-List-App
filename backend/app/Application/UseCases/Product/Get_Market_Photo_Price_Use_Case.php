<?php

namespace App\Application\UseCases\Product;

use App\Application\DTOs\Market_Photo_Price_DTO;
use App\Application\Interfaces\Product\I_Get_Market_Photo_Price_Use_Case;
use App\Domain\Interfaces\I_Product_Repository;

class Get_Market_Photo_Price_Use_Case implements I_Get_Market_Photo_Price_Use_Case
{
    private I_Product_Repository $productRepository;

    public function __construct(I_Product_Repository $productRepository)
    {
        $this->productRepository = $productRepository;
    }
    public function getMarketPhotoAndSelectedPrice(int $productID, int $shoppingListItemID): ?Market_Photo_Price_DTO
    {
        $data = $this->productRepository->getMarketPhotoAndSelectedPrice($productID, $shoppingListItemID);

        if (!$data) {
            return null;
        }

        return new Market_Photo_Price_DTO($data);
    }
}
