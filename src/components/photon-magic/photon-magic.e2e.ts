import { newE2EPage } from '@stencil/core/testing';

describe('photon-magic', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<photon-magic></photon-magic>');

    const element = await page.find('photon-magic');
    expect(element).toHaveClass('hydrated');
  });
});
