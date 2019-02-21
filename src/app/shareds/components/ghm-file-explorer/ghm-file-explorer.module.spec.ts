import { GhmFileExplorerModule } from './ghm-file-explorer.module';

describe('GhmFileExplorerModule', () => {
  let ghmFileExplorerModule: GhmFileExplorerModule;

  beforeEach(() => {
    ghmFileExplorerModule = new GhmFileExplorerModule();
  });

  it('should create an instance', () => {
    expect(ghmFileExplorerModule).toBeTruthy();
  });
});
