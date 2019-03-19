import { GhmAmountToWordModule } from './ghm-amount-to-word.module';

describe('GhmAmountToWordModule', () => {
  let ghmAmountToWordModule: GhmAmountToWordModule;

  beforeEach(() => {
    ghmAmountToWordModule = new GhmAmountToWordModule();
  });

  it('should create an instance', () => {
    expect(ghmAmountToWordModule).toBeTruthy();
  });
});
