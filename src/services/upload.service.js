'use strict';

const cloudinary = require('../configs/cloudinary.config');

class UploadService {
  // upload from url image
  static uploadImageFromUrl = async () => {
    try {
      const urlImage =
        'https://res-s.cloudinary.com/prod/image/upload/d_console:cld_new_default_cloud_logo_regular_padding.svg/w_32,h_32,c_fill,dpr_2.0/console/customer-logos/643abdaea10143beff0de421b1cd6e05';
      const folderName = 'product/shopId',
        newFileName = 'demo';

      const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
      });
      console.log('result:', result);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = UploadService;
