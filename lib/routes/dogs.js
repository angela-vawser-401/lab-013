/* eslint-disable new-cap */
const router = require('express').Router();
const Dog = require('../models/dog');
const ensureAuth = require('../middleware/ensure-auth');
const ensureRole = require('../middleware/ensure-role');

router
  .get('/', (req, res, next) => {
    Dog.find()
      .lean()
      .then(dogs => {
        res.json(dogs);
      })
      .catch(next);
  })

  .post('/', ensureAuth(), ensureRole(), (req, res, next) => {
    Dog.create(req.body)
      .then(dog => res.json(dog))
      .catch(next);
  })

  .put('/:id', ensureAuth(), ensureRole('admin'), ({ params, body }, res, next) => {
    Dog.updateOne({
      _id: params.id
    }, body)
      .then(dog => res.json(dog))
      .catch(next);
  }) 

  .delete('/:id', ensureAuth(), ensureRole('admin'), ({ params }, res, next) => {
    Dog.findByIdAndRemove({
      _id: params.id
    })
      .then(dog => res.json(dog))
      .catch(next);
  });

module.exports = router; 