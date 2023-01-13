import { render } from '@testing-library/react';

import ControllableResolve from './controllable-resolve';

describe('ControllableResolve', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ControllableResolve />);
    expect(baseElement).toBeTruthy();
  });
});
