<?php

namespace App\Application\UseCases\Market_Photo;

use App\Application\DTOs\Market_Photo_DTO;
use App\Application\Interfaces\Market_Photo\I_Add_Market_Photo_Use_Case;
use App\Domain\Entities\Market_Photo;
use App\Domain\Interfaces\I_Market_Photo_Repository;
use InvalidArgumentException;

class Add_Market_Photo_Use_Case implements I_Add_Market_Photo_Use_Case
{
    private I_Market_Photo_Repository $photoRepository;

    public function __construct(I_Market_Photo_Repository $photoRepository)
    {
        $this->photoRepository = $photoRepository;
    }

    public function add(Market_Photo_DTO $dto): Market_Photo_DTO
    {
        if (empty(trim($dto->Url))) {
            throw new InvalidArgumentException("Photo URL is required.");
        }

        if (empty(trim($dto->PublicID))) {
            throw new InvalidArgumentException("PublicID is required.");
        }

        if (empty($dto->MarketID) || $dto->MarketID <= 0) {
            throw new InvalidArgumentException("Valid MarketID is required.");
        }

        $existingPhoto = $this->photoRepository->getByMarketId($dto->MarketID);
        if ($existingPhoto) {
            throw new InvalidArgumentException("A photo for this market already exists. Delete or replace it before adding a new one.");
        }

        $photo = new Market_Photo(
            $dto->Market_PhotoID ?? null,
            $dto->Url,
            $dto->PublicID,
            $dto->MarketID
        );

        $this->photoRepository->add($photo);

        return new Market_Photo_DTO($photo);
    }
}
