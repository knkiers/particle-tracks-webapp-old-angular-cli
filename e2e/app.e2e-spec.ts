import { ParticleTracksWebappPage } from './app.po';

describe('particle-tracks-webapp App', function() {
  let page: ParticleTracksWebappPage;

  beforeEach(() => {
    page = new ParticleTracksWebappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
