const request = require('./request');

function signupUser(user) {
  return request
    .post('/api/auth/signup')
    .send(user)
    .expect(200)
    .then(({ body }) => body);
} 

function signinUser(user) {
  return request
    .post('/api/auth/signin')
    .send(user)
    .expect(200)
    .then(({ body }) => body);
} 

module.exports = {
  signupUser,
  signinUser
};