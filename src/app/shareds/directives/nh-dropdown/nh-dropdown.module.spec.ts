import { NhDropdownModule } from './nh-dropdown.module';

describe('NhDropdownModule', () => {
  let nhDropdownModule: NhDropdownModule;

  beforeEach(() => {
    nhDropdownModule = new NhDropdownModule();
  });

  it('should create an instance', () => {
    expect(nhDropdownModule).toBeTruthy();
  });
});
