<?php

namespace App\Application\Interfaces\Product;

interface I_Delete_Product_Use_Case
{

    public function delete(int $ProductID): string;
}
