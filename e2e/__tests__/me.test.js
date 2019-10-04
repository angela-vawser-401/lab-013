const request = require('../request');
const db = require('../db');
const mongoose = require('mongoose');
const { signupUser } = require('../data-helpers');



describe.only('me API', () => {
  beforeEach(() => db.dropCollection('users'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const firstBand = {
    name: 'SsingSsing',
    genre: 'glam rock',
    owner: new mongoose.Types.ObjectId,
    yearFormed: 2010,
    members: 'Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won',
    albums: ['SsingSsing'],
    language: 'Korean',
    living: true
  };

  function postBand(band) {
    return request
      .post('/api/bands')
      .set('Authorization', user.token)
      .send(band)
      .expect(200)
      .then(({ body }) => body);
  }

  it('getting no favorites returns empty array', () => {
    return request
      .get('/api/me/favorites')
      .set('Authorization', user.token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([]);
      });
  });

  it('updates a favorite band for a user', () => {
    return postBand(firstBand)
      .then(band => {
        return request
          .put(`/api/me/favorites/${band._id}`)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body[0].name).toBe(firstBand.name);
      });
  });

  it('gets a favorite band for a user', () => {
    return postBand(firstBand)
      .then(band => {
        return request
          .put(`/api/me/favorites/${band._id}`)
          .set('Authorization', user.token)
          .send(band)
          .expect(200);
      })
      .then(() => {
        return request
          .get('/api/me/favorites')
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(1);
        expect(body[0].name).toBe(firstBand.name);
      });
  });

  it('removes a favorite animal for a user', () => {
    return postBand(firstBand)
      .then(band => {
        return request
          .put(`/api/me/favorites/${band._id}`)
          .set('Authorization', user.token)
          .send(band)
          .expect(200);
      })
      .then(({ body }) => {
        return request
          .delete(`/api/me/favorites/${body[0]._id}`)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});