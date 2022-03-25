const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};



const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const multerFilter = function (req, file, callback) {
  ext = file.mimetype;
  if(ext == 'image/jpg' || ext == 'image/jpeg' || ext == 'image/png'){
    callback(null, true);
  }else{
    callback(new  Error ( 'pas la bonne extension'));
    
  }
}
 

module.exports = multer({fileFilter: multerFilter,storage: storage}).single('image');