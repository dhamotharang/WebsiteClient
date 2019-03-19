import { GoodsModule } from './goods.module';

describe('GoodsModule', () => {
  let goodsModule: GoodsModule;

  beforeEach(() => {
    goodsModule = new GoodsModule();
  });

  it('should create an instance', () => {
    expect(goodsModule).toBeTruthy();
  });
});
