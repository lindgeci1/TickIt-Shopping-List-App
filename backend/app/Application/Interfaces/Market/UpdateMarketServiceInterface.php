<?php

namespace App\Application\Interfaces\Market;

use App\Application\DTOs\MarketDto;

interface UpdateMarketServiceInterface
{
    public function update(MarketDto $dto): MarketDto;
}
