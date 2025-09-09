<?php

namespace App\Application\UseCases\Product_Photo;

use App\Application\Interfaces\Product_Photo\I_Delete_Product_Photo_Use_Case;
use App\Domain\Interfaces\I_Product_Photo_Repository;
use App\Domain\Interfaces\I_Product_Repository; // Make sure you have this
use InvalidArgumentException;

class Delete_Product_Photo_Use_Case implements I_Delete_Product_Photo_Use_Case
{
    private I_Product_Photo_Repository $photoRepository;
    private I_Product_Repository $productRepository;

    public function __construct(
        I_Product_Photo_Repository $photoRepository,
        I_Product_Repository $productRepository
    ) {
        $this->photoRepository   = $photoRepository;
        $this->productRepository = $productRepository;
    }

    public function deleteByProductId(int $productId): bool
    {
        if ($productId <= 0) {
            throw new InvalidArgumentException("Valid ProductID is required.");
        }

        // Check if the product exists
        $product = $this->productRepository->findById($productId);
        if (!$product) {
            throw new InvalidArgumentException("Product with ID {$productId} does not exist.");
        }

        // Check if a photo exists for this product
        $existingPhoto = $this->photoRepository->getByProductId($productId);
        if (!$existingPhoto) {
            throw new InvalidArgumentException("No photo exists for ProductID {$productId}.");
        }

        // Delete the photo
        $deleted = $this->photoRepository->deleteByProductId($productId);
        if (!$deleted) {
            throw new InvalidArgumentException("Deletion failed for ProductID {$productId}.");
        }

        return true;
    }
}
