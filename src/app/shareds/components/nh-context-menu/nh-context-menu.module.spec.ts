import { NhContextMenuModule } from './nh-context-menu.module';

describe('NhContextMenuModule', () => {
  let nhContextMenuModule: NhContextMenuModule;

  beforeEach(() => {
    nhContextMenuModule = new NhContextMenuModule();
  });

  it('should create an instance', () => {
    expect(nhContextMenuModule).toBeTruthy();
  });
});
