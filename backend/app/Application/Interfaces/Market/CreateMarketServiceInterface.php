<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\MarketDto;

interface CreateMarketServiceInterface
{
    public function create(MarketDto $dto): MarketDto;
}
