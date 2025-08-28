<?php

namespace App\Application\Interfaces\Market;

interface DeleteMarketServiceInterface
{
    public function delete(int $MarketID): string;
}
