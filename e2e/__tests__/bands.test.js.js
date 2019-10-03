const request = require('../request');
const db = require('../db');
const mongoose = require('mongoose');
const { signupUser } = require('../data-helpers');

describe('Band API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('bands'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const band = {
    name: 'SsingSsing',
    genre: 'glam rock',
    owner: new mongoose.Types.ObjectId(),
    yearFormed: 2010,
    members:
      'Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won',
    albums: ['SsingSsing'],
    language: 'Korean',
    living: true
  };

  it('post a band for this user', () => {
    return request
      .post('/api/bands')
      .set('Authorization', user.token)
      .send(band)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "albums": Array [
              "SsingSsing",
            ],
            "genre": "glam rock",
            "language": "Korean",
            "living": true,
            "members": "Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won",
            "name": "SsingSsing",
            "owner": Any<String>,
            "yearFormed": 2010,
          }
        `
        );
      });
  });
});
