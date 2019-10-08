const Dog = require('../dog');

describe('Dog model', () => {

  it('valid model all properties', () => {
    const data = {
      breed: 'Jindo',
      temperment: 'Alert, Intelligent, Bold',
      group: 'Foundation Stock Service',
      countryOfOrigin: 'South Korea',
      yearAKC: 1998
    };

    const dog = new Dog(data);
    const errors = dog.validateSync();
    expect(errors).toBeUndefined();

    const json = dog.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
    });
  });

  it('validates required properties', () => {
    const data = {};
    const dog = new Dog(data);
    const { errors } = dog.validateSync();
    expect(errors.breed.kind).toBe('required');
  });

  it('populates default properties', () => {
    const data = {
      breed: 'Jindo',
      temperment: 'Alert, Intelligent, Bold',
      group: 'Foundation Stock Service',
      countryOfOrigin: 'South Korea',
      yearAKC: 1998
    };
    const dog = new Dog(data);
    const err = dog.validateSync();
    expect(err).toBeUndefined();

    expect(dog.countryOfOrigin).toBe('South Korea');
  });

});