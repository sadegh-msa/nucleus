import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getHtmlElementId } from './html-helper';

describe('getHtmlElementId', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    vi.clearAllMocks();
  });

  it('generates and sets a UUID when element has no id', () => {
    const uuid = 'test-uuid-1234';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(uuid);

    const result = getHtmlElementId(element);

    expect(result).toBe(uuid);
    expect(element.getAttribute('id')).toBe(uuid);
  });

  it('returns existing id when element already has one', () => {
    element.setAttribute('id', 'existing-id');

    const result = getHtmlElementId(element);

    expect(result).toBe('existing-id');
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it('returns the same id on subsequent calls', () => {
    const uuid = 'test-uuid-1234';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(uuid);

    const firstCall = getHtmlElementId(element);
    const secondCall = getHtmlElementId(element);

    expect(firstCall).toBe(secondCall);
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it('treats empty string id as missing and generates new UUID', () => {
    element.setAttribute('id', '');
    const uuid = 'test-uuid-1234';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(uuid);

    const result = getHtmlElementId(element);

    expect(result).toBe(uuid);
    expect(element.getAttribute('id')).toBe(uuid);
  });

  it('works with different element types', () => {
    const uuid = 'test-uuid-1234';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(uuid);

    const button = document.createElement('button');
    const input = document.createElement('input');
    const span = document.createElement('span');

    expect(getHtmlElementId(button)).toBe(uuid);
    expect(getHtmlElementId(input)).toBe(uuid);
    expect(getHtmlElementId(span)).toBe(uuid);
  });
});
