import { GhmDraggableModule } from './ghm-draggable.module';

describe('GhmDraggableModule', () => {
  let ghmDraggableModule: GhmDraggableModule;

  beforeEach(() => {
    ghmDraggableModule = new GhmDraggableModule();
  });

  it('should create an instance', () => {
    expect(ghmDraggableModule).toBeTruthy();
  });
});
