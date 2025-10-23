<?php

namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Product_Category_DTO",
 *     type="string",
 *     description="Product category as a plain string"
 * )
 */
class Product_Category_DTO
{
    public string $category;

    public function __construct(string $category)
    {
        $this->category = $category;
    }
}
