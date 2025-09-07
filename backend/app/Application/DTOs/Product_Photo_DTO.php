<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Product_Photo;

/**
 * @OA\Schema(
 *     schema="Product_Photo_DTO",
 *     type="object",
 *     required={"Url", "PublicID", "ProductID"},
 *     @OA\Property(property="Product_PhotoID", type="integer", nullable=true),
 *     @OA\Property(property="Url", type="string"),
 *     @OA\Property(property="PublicID", type="string"),
 *     @OA\Property(property="ProductID", type="integer"),
 * )
 */
class Product_Photo_DTO
{
    public ?int $Product_PhotoID = null;
    public string $Url;
    public string $PublicID;
    public int $ProductID;

    public function __construct(?Product_Photo $photo = null)
    {
        if ($photo) {
            $this->Product_PhotoID = $photo->Product_PhotoID;
            $this->Url             = $photo->Url;
            $this->PublicID        = $photo->PublicID;
            $this->ProductID       = $photo->ProductID;
        }
    }
}
