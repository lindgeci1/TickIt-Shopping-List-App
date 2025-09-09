<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Market_Photo;
use App\Domain\Interfaces\I_Market_Photo_Repository;
use App\Infrastructure\Models\Market_Photo as MarketPhotoModel;
use Cloudinary\Cloudinary;

class Eloquent_Market_Photo_Repository implements I_Market_Photo_Repository
{
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $cloudinaryUrl = env('CLOUDINARY_URL');
        $this->cloudinary = new Cloudinary($cloudinaryUrl);
    }

    public function add(Market_Photo $photo): Market_Photo
    {
        // Upload local file to Cloudinary
        $uploadResult = $this->cloudinary->uploadApi()->upload($photo->Url, [
            'folder' => 'market_photos' // folder for market photos
        ]);

        $cloudinaryUrl = $uploadResult['secure_url'];
        $publicId      = $uploadResult['public_id'];

        // Save to DB
        $model = new MarketPhotoModel();
        $model->url       = $cloudinaryUrl;
        $model->public_id = $publicId;
        $model->market_id = $photo->MarketID;
        $model->save();

        return new Market_Photo(
            $model->market_photo_id,
            $model->url,
            $model->public_id,
            $model->market_id
        );
    }

    public function getByMarketId(int $marketId): ?Market_Photo
    {
        $model = MarketPhotoModel::where('market_id', $marketId)->first();

        if (!$model) {
            return null;
        }

        return new Market_Photo(
            $model->market_photo_id,
            $model->url,
            $model->public_id,
            $model->market_id
        );
    }

    public function deleteByMarketId(int $marketId): bool
    {
        $model = MarketPhotoModel::where('market_id', $marketId)->first();

        if (!$model) {
            return false;
        }

        // Delete from Cloudinary
        if ($model->public_id) {
            $this->cloudinary->uploadApi()->destroy($model->public_id);
        }

        // Delete from DB
        return $model->delete();
    }
}
