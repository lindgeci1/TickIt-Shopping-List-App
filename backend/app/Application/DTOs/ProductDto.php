<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Product;

/**
 * @OA\Schema(
 *     schema="ProductDto",
 *     type="object",
 *     required={"Name","Category"},
 *     @OA\Property(property="ProductID", type="integer", nullable=true),
 *     @OA\Property(property="Name", type="string"),
 *     @OA\Property(property="Description", type="string", nullable=true),
 *     @OA\Property(property="Price", type="number", format="float", nullable=true),
 *     @OA\Property(property="IsFavorite", type="boolean"),
 *     @OA\Property(property="Category", type="string"),
 *     @OA\Property(
 *         property="Markets",
 *         type="array",
 *         @OA\Items(type="integer")
 *     )
 * )
 */
class ProductDto
{
    public ?int $ProductID = null;
    public string $Name;
    public ?string $Description = null;
    public ?float $Price = null;
    public bool $IsFavorite = false;
    public string $Category;
    public array $Markets = []; // array of Market IDs

    public function __construct(?Product $product = null)
    {
        if ($product) {
            $this->ProductID = $product->ProductID;
            $this->Name = $product->Name;
            $this->Description = $product->Description;
            $this->Price = $product->Price;
            $this->IsFavorite = $product->IsFavorite;
            $this->Category = $product->Category;

            // map related markets to their IDs
            $this->Markets = array_map(fn($m) => $m->MarketID, $product->Markets ?? []);
        }
    }
}
