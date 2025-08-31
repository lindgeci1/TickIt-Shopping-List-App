<?php

namespace App\Application\UseCases\ShoppingList;

use App\Application\DTOs\Shopping_List_Item_DTO;
use App\Application\Interfaces\ShoppingList\I_Create_Shopping_List_Item_Use_Case;
use App\Domain\Entities\Shopping_List_Item;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Domain\Interfaces\I_Product_Repository;
use InvalidArgumentException;

class Create_Shopping_List_Item_Use_Case implements I_Create_Shopping_List_Item_Use_Case
{
    private I_Shopping_List_Item_Repository $repository;
    private I_Product_Repository $productRepository;
    public function __construct(I_Shopping_List_Item_Repository $repository, I_Product_Repository $productRepository)
    {
        $this->repository = $repository;
        $this->productRepository = $productRepository;
    }

    public function create(Shopping_List_Item_DTO $dto): Shopping_List_Item_DTO
    {
        if (!$dto->ProductID) {
            throw new InvalidArgumentException("ProductID is required.");
        }

        if (empty(trim($dto->Status))) {
            throw new InvalidArgumentException("Status is required.");
        }

        if (!$this->productRepository->findById($dto->ProductID)) {
            throw new InvalidArgumentException("Product with ID {$dto->ProductID} does not exist.");
        }
        $item = new Shopping_List_Item(
            $dto->Shopping_List_ItemID ?? null,
            $dto->ProductID,
            $dto->Status,
            $dto->AddedAt ?? null,
            $dto->BoughtAt ?? null
        );

        $this->repository->create($item);

        return new Shopping_List_Item_DTO($item);
    }
}
