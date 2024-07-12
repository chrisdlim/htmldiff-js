import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: false,
  typescript: {
    parserOptions: {
      projectService: true,
    },
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
});
