import { GhmMaskModule } from './ghm-mask.module';

describe('GhmMaskModule', () => {
  let ghmMaskModule: GhmMaskModule;

  beforeEach(() => {
    ghmMaskModule = new GhmMaskModule();
  });

  it('should create an instance', () => {
    expect(ghmMaskModule).toBeTruthy();
  });
});
