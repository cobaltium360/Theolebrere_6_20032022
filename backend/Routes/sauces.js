const express = require('express');

const router = express.Router();

const controllers = require('../Controllers/sauces');
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

router.post('/', auth, multer, controllers.createSauce);
router.post('/:id/like', auth, controllers.postLike);
router.delete('/:id', auth, controllers.deleteSauce)
router.put('/:id', auth, multer, controllers.putId);



router.get('/', auth, controllers.getSauce);

router.get('/:id', auth, controllers.getId);

module.exports = router;