<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\MarketDto;

interface GetMarketServiceInterface
{

    public function getById(int $MarketID): MarketDto;
}
