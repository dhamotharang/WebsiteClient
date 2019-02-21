import { GhmContextMenuModule } from './ghm-context-menu.module';

describe('GhmContextMenuModule', () => {
  let ghmContextMenuModule: GhmContextMenuModule;

  beforeEach(() => {
    ghmContextMenuModule = new GhmContextMenuModule();
  });

  it('should create an instance', () => {
    expect(ghmContextMenuModule).toBeTruthy();
  });
});
