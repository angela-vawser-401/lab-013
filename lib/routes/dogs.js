/* eslint-disable new-cap */
const router = require('express').Router();
const Dog = require('../models/dog');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;

    Dog.create(req.body)
      .then(dog => res.json(dog))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Dog.findByIf(req.params.id)
      .lean()
      .then(dog => res.json(dog))
      .catch(next);
  })

  .get('/', ({ query }, res, next) => {
    const findQuery = {};
    if(query.breed) findQuery.breed = query.breed;
    if(query.yearAKC) findQuery.yearAKC = query.yearAKC;
    if(query.countryOfOrigin) findQuery.countryOfOrigin = query.countryOfOrigin;

    Dog.find(findQuery)
      .select('breed yearAKC countryOfOrigin')
      .lean()
      .then(dogs => {
        res.json(dogs);
      })
      .catch(next);
  })

  .put('/:id', ({ params, body, user }, res, next) => {
    Dog.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
      .then(dog => res.json(dog))
      .catch(next);
  })

  .delete('/:id', ({ params, user }, res, next) => {
    Dog.findOneAndRemove({
      _id: params.id,
      owner: user.id
    })
      .then(dog => res.json(dog))
      .catch(next);
  });

module.exports = router;