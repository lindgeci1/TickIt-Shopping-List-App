<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Product;

/**
 * @OA\Schema(
 *     schema="Imported_Product_DTO",
 *     type="object",
 *     required={"Name","Category"},
 *     @OA\Property(property="ProductID", type="integer", nullable=true),
 *     @OA\Property(property="Name", type="string"),
 *     @OA\Property(property="Price", type="number", format="float", nullable=true),
 *     @OA\Property(property="IsFavorite", type="boolean"),
 *     @OA\Property(property="Category", type="string"),
 *     @OA\Property(
 *         property="Photos",
 *         type="array",
 *         @OA\Items(type="string")
 *     )
 * )
 */
class Imported_Product_DTO
{
    public ?int $ProductID = null;
    public string $Name;
    public ?float $Price = null;
    public bool $IsFavorite = false;
    public string $Category;
    public array $Photos = [];

    public function __construct(Product $product)
    {
        $this->ProductID = $product->ProductID;
        $this->Name = $product->Name;
        $this->IsFavorite = $product->IsFavorite;
        $this->Category = $product->Category;
        $this->Photos = $product->Photos ?? [];
    }
}
