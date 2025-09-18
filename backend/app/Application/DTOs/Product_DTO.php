<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Product;

/**
 * @OA\Schema(
 *     schema="Product_DTO",
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
 *     ),
 *       @OA\Property(
 *         property="Status",
 *         type="string",
 *         enum={"ToBuy","Bought"},
 *         nullable=true,
 *         description="Status of the product in the shopping list (nullable)"
 *     )
 * )
 */
class Product_DTO
{
    public ?int $ProductID = null;
    public string $Name;
    public ?float $Price = null;
    public bool $IsFavorite = false;
    public string $Category;
    public array $Photos = [];

    public function __construct(?Product $product = null)
    {
        if ($product) {
            $this->ProductID = $product->ProductID;
            $this->Name = $product->Name;

            $this->IsFavorite = $product->IsFavorite;
            $this->Category = $product->Category;

            // Include photos if available (1-to-1)
            $this->Photos = $product->Photos ?? [];
        }
    }
}
