<?php

namespace App\Domain\Interfaces;

use App\Domain\Entities\Market_Photo;

interface I_Market_Photo_Repository
{
    public function add(Market_Photo $photo): Market_Photo;

    public function getByMarketId(int $marketId): ?Market_Photo;

    public function deleteByMarketId(int $marketId): bool;
}
