import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafePipe', () => {
  it('create an instance', () => {
    const sanitizerMock = {} as DomSanitizer; 

    const pipe = new SafePipe(sanitizerMock); 
    expect(pipe).toBeTruthy();
  });
});
