<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Product_Photo;
use App\Domain\Interfaces\I_Product_Photo_Repository;
use App\Infrastructure\Models\Product_Photo as ProductPhotoModel;
use Cloudinary\Cloudinary;

class Eloquent_Product_Photo_Repository implements I_Product_Photo_Repository
{
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $cloudinaryUrl = env('CLOUDINARY_URL');
        $this->cloudinary = new Cloudinary($cloudinaryUrl);
    }


    public function add(Product_Photo $photo): Product_Photo
    {
        // Upload local file to Cloudinary
        $uploadResult = $this->cloudinary->uploadApi()->upload($photo->Url, [
            'folder' => 'product_photos' // optional folder
        ]);

        $cloudinaryUrl = $uploadResult['secure_url'];
        $publicId      = $uploadResult['public_id'];

        // Save to DB
        $model = new ProductPhotoModel();
        $model->url        = $cloudinaryUrl;
        $model->public_id  = $publicId;
        $model->product_id = $photo->ProductID;
        $model->save();

        return new Product_Photo(
            $model->product_photo_id,
            $model->url,
            $model->public_id,
            $model->product_id
        );
    }

    public function getByProductId(int $productId): ?Product_Photo
    {
        $model = ProductPhotoModel::where('product_id', $productId)->first();

        if (!$model) {
            return null;
        }

        return new Product_Photo(
            $model->product_photo_id,
            $model->url,
            $model->public_id,
            $model->product_id
        );
    }

     public function deleteByProductId(int $productId): bool
    {
        $model = ProductPhotoModel::where('product_id', $productId)->first();

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
