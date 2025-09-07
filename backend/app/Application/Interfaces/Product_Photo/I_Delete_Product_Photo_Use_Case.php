<?php

namespace App\Application\Interfaces\Product_Photo;

interface I_Delete_Product_Photo_Use_Case
{
    /**
     * Delete the photo linked to a specific product.
     *
     * @param int $productId
     * @return bool Returns true if deleted successfully, false otherwise.
     */
    public function deleteByProductId(int $productId): bool;
}
