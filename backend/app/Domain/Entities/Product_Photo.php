<?php

namespace App\Domain\Entities;

class Product_Photo
{
    public ?int $Product_PhotoID;
    public string $Url;
    public string $PublicID;
    public int $ProductID;
    public ?Product $Product = null;

    public function __construct(?int $Product_PhotoID, string $Url, string $PublicID, int $ProductID)
    {
        $this->Product_PhotoID = $Product_PhotoID;
        $this->Url = $Url;
        $this->PublicID = $PublicID;
        $this->ProductID = $ProductID;
    }
}
