<?php

namespace App\Application\Interfaces\Market;

interface I_Delete_Market_Use_Case
{
    public function delete(int $MarketID): string;
}
