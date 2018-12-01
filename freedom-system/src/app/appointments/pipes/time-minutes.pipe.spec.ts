import { TimeMinutesPipe } from './time-minutes.pipe';

describe('TimeMinutesPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeMinutesPipe();
    expect(pipe).toBeTruthy();
  });
});
