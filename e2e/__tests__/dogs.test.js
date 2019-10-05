const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('dogs API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('dogs'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const dog = {
    breed: 'Jindo',
    temperment: 'Alert, Intelligent, Bold',
    group: 'Foundation Stock Service',
    countryOfOrigin: 'South Korea',
    yearAKC: 1998,
  };

  function postDog(dog, user) {
    return request
      .post('/api/dogs')
      .set('Authorization', user.token)
      .send(dog)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a dog', () => {
    return postDog(dog, user)
      .then(dog => {
        expect(dog).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...dog
        });
      });
  });

  it('post a dog for this user', () => {
    return request
      .post('/api/dog')
      .set('Authorization', user.token)
      .send(dog)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
        );
      });
  });

  it('gets a list of dogs', () => {
    const firstDog = {
      breed: 'Jindo',
      temperment: 'Alert, Intelligent, Bold',
      group: 'Foundation Stock Service',
      countryOfOrigin: 'South Korea',
      yearAKC: 1998,
    };
    return Promise.all([
      postDog(firstDog, user),
      postDog({ breed: 'Tibetan Mastiff', temperment: 'Independent, Reserved, Intelligent', group: 'Working', countryOfOrigin: 'Tibet/Nepal', yearAKC: 2006 }, user),
      postDog({ breed: 'Alaskan Malamute', temperment: 'Affectionate, Loyal, Playful', group: 'Working', countryOfOrigin: 'USA', yearAKC: 1935 }, user),
      postDog({ breed: 'Otterhound', temperment: 'Even-Tempered, Amiable, Boisterous', group: 'Hound', countryOfOrigin: 'England', yearAKC: 1909 }, user),
    ])
      .then(() => {
        return request
          .get('/api/dogs')
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(4);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          breed: firstDog.breed,
          yearAKC: firstDog.yearAKC,
          countryOfOrigin: firstDog.countryOfOrigin,
        });
      });
  });

  it('updates a dog', () => {
    return postDog(dog, user)
      .then(dog => {
        dog.countryOfOrigin = 'Korea';
        return request
          .put(`/api/dogs/${dog._id}`)
          .send(dog)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.countryOfOrigin).toBe('Korea');
      });
  });

  it('deletes a dog', () => {
    return postDog(dog, user).then(dog => {
      return request
        .delete(`/api/dogs/${dog._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });
});
