import NugetVersionConvertor from './nuget-version-convertor';

it('generates file and assembly versions correctly', () => {
  const convertor = new NugetVersionConvertor();

  expect(convertor.convertToAssemblyVersion('1.19.10-beta.1')).toBe('1.19.10.1');
  expect(convertor.convertToAssemblyVersion('1.2.3-beta.345')).toBe('1.2.3.345');
  expect(convertor.convertToAssemblyVersion('2.3.6')).toBe('2.3.6');
  expect(convertor.convertToAssemblyVersion('2.abcf6')).toBeUndefined();
});
