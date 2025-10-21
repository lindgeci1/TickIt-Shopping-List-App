<?php

namespace App\Application\Interfaces\Product;

use App\Domain\Entities\Product;

interface I_Import_Products_From_Api_Use_Case
{
    /**
     * Import products from the external API.
     *
     * @param int $perPage Number of products to fetch
     * @return Product[] Array of imported Product entities
     */
    public function import(int $perPage = 11): array;
}
