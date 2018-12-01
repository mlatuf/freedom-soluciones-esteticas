import { AreasModule } from './areas.module';

describe('AreasModule', () => {
  let areasModule: AreasModule;

  beforeEach(() => {
    areasModule = new AreasModule();
  });

  it('should create an instance', () => {
    expect(areasModule).toBeTruthy();
  });
});
