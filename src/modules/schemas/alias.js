module.exports = {
  $id: 'alias',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-z_]{5,}$',
    },
    description: {
      type: 'string',
      minLength: 3,
    },
    sceneId: {
      type: 'integer',
    },
    enabled: { type: 'boolean' },
  },
  required: ['name', 'sceneId'],
};
