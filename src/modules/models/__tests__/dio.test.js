const knex = require('../../../../knexClient');
const Dio = require('../dio');
const initDios = [
  {
    dio_id: 1,
    room_id: 1,
    name: 'test',
  },
  {
    dio_id: 2,
    room_id: 2,
    name: 'test',
  },
];

beforeAll(async () => {
  await knex(Dio.TABLE).truncate();
});

describe('Dio', () => {
  beforeEach(async () => {
    await knex(Dio.TABLE).insert(initDios);
  });

  afterEach(async () => {
    await knex(Dio.TABLE).truncate();
  });

  describe('findAll', () => {
    it('should return all dios', async () => {
      const expected = [
        {
          dioId: 1,
          roomId: 1,
          name: 'test',
        },
        {
          dioId: 2,
          roomId: 2,
          name: 'test',
        },
      ];

      const result = await Dio.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return only one dio', async () => {
      const expected = {
        dioId: 1,
        roomId: 1,
        name: 'test',
      };

      const result = await Dio.findById(1);
      expect(result).toEqual(expected);
    });

    it('should return undefined', async () => {
      const result = await Dio.findById(-1);
      expect(result).toBe(undefined);
    });
  });

  describe('save', () => {
    it('should save a new dio', async () => {
      const save = {
        dioId: 3,
        roomId: 1,
        name: 'test-save',
      };

      await Dio.save(save);
      const dios = await knex(Dio.TABLE)
        .select('*')
        .where('dio_id', 3);
      expect(dios).toMatchSnapshot();
    });
  });

  describe('delete', () => {
    it('should delete a dio', async () => {
      await Dio.delete(1);
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toMatchSnapshot();
    });

    it('should not delete a dio', async () => {
      await Dio.delete(-1);
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toEqual(initDios);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a dio', async () => {
      await Dio.findByIdAndUpdate(1, { name: 'updated' });
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toMatchSnapshot();
    });

    it('should update a dio', async () => {
      await Dio.findByIdAndUpdate(-1, { name: 'updated' });
      const dios = await knex(Dio.TABLE).select('*');
      expect(dios).toEqual(initDios);
    });
  });

  describe('validate', () => {
    it('should return true when a dio is valid', () => {
      const dio = {
        dioId: 3,
        roomId: 1,
        name: 'test-save',
      };

      expect(Dio.validate(dio)).toBeTruthy();
    });

    it('should return false when a dio is missing a props', () => {
      const dio = {
        dioId: 3,
        name: 'test-save',
      };

      expect(Dio.validate(dio)).toBeFalsy();
    });

    it('should return false when a dio has unknow props', () => {
      const dio = {
        dioId: 3,
        roomId: 1,
        name: 'test-save',
        test: 2,
      };

      expect(Dio.validate(dio)).toBeFalsy();
    });
  });
});
