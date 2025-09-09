<?php

namespace App\Application\UseCases\Product_Photo;

use App\Application\DTOs\Product_Photo_DTO;
use App\Application\Interfaces\Product_Photo\I_Add_Product_Photo_Use_Case;
use App\Domain\Entities\Product_Photo;
use App\Domain\Interfaces\I_Product_Photo_Repository;
use InvalidArgumentException;

class Add_Product_Photo_Use_Case implements I_Add_Product_Photo_Use_Case
{
    private I_Product_Photo_Repository $photoRepository;

    public function __construct(I_Product_Photo_Repository $photoRepository)
    {
        $this->photoRepository = $photoRepository;
    }

    public function add(Product_Photo_DTO $dto): Product_Photo_DTO
    {
        if (empty(trim($dto->Url))) {
            throw new InvalidArgumentException("Photo URL is required.");
        }

        if (empty(trim($dto->PublicID))) {
            throw new InvalidArgumentException("PublicID is required.");
        }

        if (empty($dto->ProductID) || $dto->ProductID <= 0) {
            throw new InvalidArgumentException("Valid ProductID is required.");
        }
        $existingPhoto = $this->photoRepository->getByProductId($dto->ProductID);
        if ($existingPhoto) {
            throw new InvalidArgumentException("A photo for this product already exists. Delete or replace it before adding a new one.");
        }
        $photo = new Product_Photo(
            $dto->Product_PhotoID ?? null,
            $dto->Url,
            $dto->PublicID,
            $dto->ProductID
        );

        $this->photoRepository->add($photo);

        return new Product_Photo_DTO($photo);
    }
}
