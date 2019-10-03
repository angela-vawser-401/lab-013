const mongoose = require('mongoose');
const Band = require('../band');

describe('Band model', () => {

  it('valid model all properties', () => {
    const data = {
      name: 'SsingSsing',
      genre: 'glam rock',
      owner: new mongoose.Types.ObjectId,
      yearFormed: 2010,
      members: 'Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won',
      albums: ['SsingSsing'],
      language: 'Korean',
      living: true,
    };

    const band = new Band(data);
    const errors = band.validateSync();
    expect(errors).toBeUndefined();

    const json = band.toJSON();

    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
    });
  });

  it('validates required properties', () => {
    const data = {};
    const band = new Band(data);
    const { errors } = band.validateSync();
    expect(errors.name.kind).toBe('required');
    expect(errors.owner.kind).toBe('required');
    expect(errors.members.kind).toBe('required');
  });

  it('populates default properties', () => {
    const data = {
      name: 'SsingSsing',
      genre: 'glam rock',
      owner: new mongoose.Types.ObjectId,
      yearFormed: 2010,
      members: 'Lee Hee-Moon, Shin Seung-Tae, Choo Da-Hye, Jang Young-Gyu, Lee Chul-Hee, Lee Tae-Won',
      albums: ['SsingSsing'],
      language: 'Korean',
      living: true,
    };
    const band = new Band(data);
    const err = band.validateSync();
    expect(err).toBeUndefined();

    expect(band.living).toBe(true);
  });

});