<?php

namespace App\Application\Interfaces\Product;


interface I_Search_Product_Use_Case
{
    public function searchByName(string $name): array;
}
