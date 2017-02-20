import { Pfila2017Page } from './app.po';

describe('pfila2017 App', () => {
  let page: Pfila2017Page;

  beforeEach(() => {
    page = new Pfila2017Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
