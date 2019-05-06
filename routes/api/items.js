const express= require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Item = require('../../modules/Item');



// @route GET api/items
// @desc Get All Items
// @access Private 
router.get('/',auth, (req , res) => {
    Item.find()
    .sort({ date : -1})//descendant
    .then(items => res.json(items));
});


// @route POST api/items
// @desc  create An item
// @access Private
router.post('/',auth, (req , res) => {
    const newItem = new Item({
        name: req.body.name
    }); 
    newItem.save().then(item => res.json(item));

});

// @route delete api/items/:id
// @desc  delete An item
// @access Private
router.delete('/:id',auth, (req , res) => {
    Item
    .findById(req.params.id)
    .then(item => item
        .remove()
        .then(() => res.json({success: true}) ))
    .catch(err => res.status(404).json({success: false}));
    })

module.exports = router;