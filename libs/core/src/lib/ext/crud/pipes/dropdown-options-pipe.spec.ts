import { DropdownOptionsPipe } from './dropdown-options-pipe';

describe('DropdownOptionsPipe', () => {
  let pipe: DropdownOptionsPipe;

  beforeEach(() => {
    pipe = new DropdownOptionsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return yes/no options for "yesNo"', () => {
    const result = pipe.transform('yesNo');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ value: true, label: 'Yes' });
    expect(result[1]).toEqual({ value: false, label: 'No' });
  });

  it('should return empty array for unknown key', () => {
    const result = pipe.transform('unknown');
    expect(result).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    const result = pipe.transform('');
    expect(result).toEqual([]);
  });
});
