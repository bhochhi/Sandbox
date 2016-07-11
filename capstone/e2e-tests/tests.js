// vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2
'use strict';

describe('online planning poker app e2e tests', function() {
  function createRoom(name) {
    browser.get('/');
    element(by.buttonText('Create Room')).click();

    element(by.tagName('input')).sendKeys(name);
    element(by.buttonText('Join Room')).click();

    browser.driver.wait(function() {
      return browser.isElementPresent(by.buttonText('Reset'));
    });
  }


  it('can create a new planning room', function() {
    createRoom('Sean');

    expect(element.all(by.css('.users .row')).count()).toBe(1);
    expect(element(by.css('.users')).getText()).toContain('Sean');
  });

  describe('planning room', function() {
    it('contains join uri that can be used to join a room', function(done) {
      createRoom('Sean');

      element(by.css('.join-uri input')).getAttribute('value').then(function(value) {
        browser.get(value);

        // Type in name field to verify we are at join page
        element(by.tagName('input')).sendKeys('Blah');

        done();
      });
    });

    it('user can click on card to vote', function() {
      createRoom('Sean');

      element(by.buttonText('5')).click();

      expect(element.all(by.css('.users .row .hidden')).count()).toBe(1);
    });

    it('clicking show exposes hidden cards so everyone can see them', function() {
      createRoom('Sean');

      element(by.buttonText('5')).click();
      element(by.buttonText('Show')).click();

      expect(element.all(by.css('.users .row .hidden')).count()).toBe(0);
      expect(element.all(by.css('.users .row .card')).getText()).toEqual(['5'])
    });

    it('clicking reset clears out cards', function() {
      createRoom('Sean');

      element(by.buttonText('5')).click();

      expect(element.all(by.css('.users .row .hidden')).count()).toBe(1);

      element(by.buttonText('Reset')).click();

      expect(element.all(by.css('.users .row .hidden')).count()).toBe(0);
      expect(element.all(by.css('.users .row .no-card')).getText()).toEqual(['-'])
    });
  });
});
