const request = require('../request');
const db = require('../db');
const User = require('../../lib/models/user');
const { signupUser } = require('../data-helpers');

describe('dogs API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('dogs'));

  const normalUser = {
    email: 'normal@normal.com',
    password: 'abc123'
  };

  const adminUser = {
    email: 'admin@admin.com',
    password: 'abc123'
  };

  const dog1 = {
    breed: 'Jindo',
    temperment: 'Alert, Intelligent, Bold',
    group: 'Foundation Stock Service',
    countryOfOrigin: 'South Korea',
    yearAKC: 1998
  };

  const dog2 = {
    breed: 'Otterhound',
    temperment: 'Even-Tempered, Amiable, Boisterous',
    group: 'Hound',
    countryOfOrigin: 'England',
    yearAKC: 1909
  };

  const dog3 = {
    breed: 'Alaskan Malamute',
    temperment: 'Affectionate, Loyal, Playful',
    group: 'Hound',
    countryOfOrigin: 'USA',
    yearAKC: 1935
  };

  function signinAdminUser(admin = adminUser) {
    return request
      .post('/api/auth/signin')
      .send(admin)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a dog with user permission', () => {
    return signupUser(adminUser)
      .then(user => {
        return User.updateById(user._id, {
          $addToSet: {
            roles: 'admin'
          }
        });
      })
      .then(() => {
        return Promise.all([
          signinAdminUser()
        ])
          .then(([admin]) => {
            return request
              .post('/api/dogs')
              .set('Authorization', admin.token)
              .send(dog1)
              .expect(200)
              .then(({ body }) => {
                expect(body).toEqual({
                  ...dog1,
                  _id: expect.any(String),
                  __v: 0
                });
              });
          });
      });
  });

  it('denies the ability of someone without user permission to post', () => {
    return signupUser(normalUser)
      .then(() => {
        return request
          .post('/api/auth/signin')
          .send(normalUser)
          .expect(200)
          .then(({ body }) => body)
          .then(user => {
            return request
              .post('/api/dogs')
              .set('Authorization', user.token)
              .send(dog2)
              .expect(401)
              .then(({ body }) => {
                expect(body.error).toBe('User not authorized, must be admin');
              });
          });
      });
  });

  it('only allows those with admin access to put', () => {
    return signupUser(normalUser)
      .then(() => {
        return signupUser(adminUser)
          .then(user => {
            return User.updateById(user._id, {
              $addToSet: {
                roles: 'admin'
              }
            });
          })
          .then(() => {
            return signinAdminUser()
              .then(admin => {
                return request
                  .post('/api/dogs')
                  .set('Authorization', admin.token)
                  .send(dog3)
                  .expect(200)
                  .then(({ body }) => body)
                  .then(dog => {
                    return request
                      .put(`/api/dogs/${dog._id}`)
                      .set('Authorization', admin.token)
                      .send({ breed: 'Tibetan Mastiff' })
                      .expect(200)
                      .then(({ body }) => {
                        expect(body.breed).toBe('Tibetan Mastiff');
                      });
                  });
              });
          });
      });
  });

  it('gets can be done by any authorized user', () => {
    return signupUser(normalUser)
      .then(() => {
        return signupUser(adminUser)
          .then(user => {
            return User.updateById(user._id, {
              $addToSet: {
                roles: 'admin'
              }
            });
          })
          .then(() => {
            return signinAdminUser()
              .then(admin => {
                return request
                  .post('/api/dogs')
                  .set('Authorization', admin.token)
                  .send(dog3)
                  .expect(200)
                  .then(() => {
                    return request
                      .post('/api/dogs')
                      .set('Authorization', admin.token)
                      .send(dog3)
                      .expect(200)
                      .then(() => {
                        return signinAdminUser(normalUser)
                          .then(user => {
                            return request
                              .get('/api/dogs')
                              .set('Authorization', user.token)
                              .expect(200)
                              .then(({ body }) => {
                                expect(body.length).toBe(2);
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  it('deletes a dog, but only those with admin access', () => {
    return signupUser(normalUser)
      .then(() => {
        return signupUser(adminUser)
          .then(user => {
            return User.updateById(user._id, {
              $addToSet: {
                roles: 'admin'
              }
            });
          })
          .then(() => {
            return signinAdminUser()
              .then(admin => {
                return request
                  .post('/api/dogs')
                  .set('Authorization', admin.token)
                  .send(dog3)
                  .expect(200)
                  .then(({ body }) => {
                    return request
                      .delete(`/api/dogs/${body._id}`)
                      .set('Authorization', admin.token)
                      .expect(200)
                      .then(() => {
                        return request
                          .get('/api/dogs')
                          .set('Authorization', admin.token)
                          .expect(200)
                          .then(() => {
                            expect(body).toEqual({
                              ...dog3,
                              _id: expect.any(String),
                              __v: 0
                            });
                          });
                      });
                  });
              });
          });
      });
  });
});