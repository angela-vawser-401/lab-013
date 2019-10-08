const request = require('../request');
const db = require('../db');
const mongoose = require('mongoose');
const { signupUser, signinUser } = require('../data-helpers');

describe('bands api', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('bands'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  let user = null;
  beforeEach(() => {
    return signupUser(testUser).then(() => {
      return signinUser(testUser).then(body => (user = body));
    });
  });

  const band = {
    name: 'SsingSsing',
    genre: 'glam rock',
    yearFormed: 2010,
    members:
      'Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won',
    albums: ['SsingSsing'],
    language: 'Korean',
    living: true
  };

  function postBand(band, user) {
    return request
      .post('/api/bands')
      .set('Authorization', user.token)
      .send(band)
      .expect(200)
      .then(({ body }) => body);
  }

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

  it('post a band', () => {
    return postBand(band, user).then(band => {
      expect(band).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...band
      });
    });
  });

  it('updates a band', () => {
    return postBand(band, user)
      .then(band => {
        band.yearFormed = 2009;
        return request
          .put(`/api/bands/${band._id}`)
          .send(band)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.yearFormed).toBe(2009);
      });
  });

  it('deletes a band', () => {
    return postBand(band, user).then(band => {
      return request
        .delete(`/api/bands/${band._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });

  it('gets a list of bands', () => {
    const firstBand = {
      name: 'SsingSsing',
      genre: 'glam rock',
      yearFormed: 2010,
      members:
        'Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won',
      albums: ['SsingSsing'],
      language: 'Korean',
      living: true
    };
    return Promise.all([
      postBand(firstBand, user),
      postBand(
        {
          name: 'Joy Division',
          genre: 'post punk',
          owner: new mongoose.Types.ObjectId(),
          yearFormed: 1978,
          members: 'Ian Curtis, Bernard Sumner, Peter Hook, Stephen Morris',
          albums: [
            'An Ideal For Living',
            'Short Circuit: Live at the Electric Circus',
            'Unknown Pleasures',
            'Closer',
            'Still',
            'Substance',
            'Permanent',
            'Heart and Soul'
          ],
          language: 'English'
        },
        user
      ),

      postBand(
        {
          name: 'Tennis',
          genre: 'dream pop',
          owner: new mongoose.Types.ObjectId(),
          yearFormed: 2010,
          members: 'Alaina Moore, Patrick Riley',
          albums: [
            'Cape Dory',
            'Young & Old',
            'Small Sound, Ritual in Repeat',
            'Yours Conditionally',
            'We Can Die Happy'
          ],
          language: 'English'
        },
        user
      ),

      postBand(
        {
          name: 'Huun Huur Tu',
          genre: 'tuvan throat singing',
          owner: new mongoose.Types.ObjectId(),
          yearFormed: 1992,
          members:
            '	Kaigal-ool Khovalyg, Sayan Bapa, Radik Tülüsh, Alexei Saryglar',
          albums: [
            '60 Horses In My Herd',
            "The Orphan's Lament",
            "If I'd Been Born An Eagle",
            'Where Young Grass Grows',
            'Live 1',
            'Live 2',
            'More Live',
            'Live at Fantasy Studios',
            'Ancestors Call'
          ],
          language: 'Tuvan'
        },
        user
      )
    ])

      .then(() => {
        return request
          .get('/api/bands')
          .expect(200)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(4);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          name: firstBand.name,
          genre: firstBand.genre,
          albums: firstBand.albums
        });
      });
  });
});
