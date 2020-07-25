import { newSpecPage } from '@stencil/core/testing';
import { PhotonMagic } from './photon-magic';

describe('photon-magic', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PhotonMagic],
      html: `<photon-magic></photon-magic>`,
    });
    expect(page.root).toEqualHtml(`
      <photon-magic>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </photon-magic>
    `);
  });
});
