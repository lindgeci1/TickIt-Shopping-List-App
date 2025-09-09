<?php

namespace App\Application\Interfaces\Market_Photo;

interface I_Delete_Market_Photo_Use_Case
{
    public function deleteByMarketId(int $marketId): bool;
}
