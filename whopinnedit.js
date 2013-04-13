(function() {
  $(function() {
    var choseWisely, correct, incorrect, pinnerLinks, pinnersByUsername, pins, scoreboard, usernames;

    $.fn.username = function() {
      var href;

      href = $(this).attr('href');
      return href.substr(1, href.length - 2);
    };
    $.fn.pinnerLink = function() {
      return $(this).find('.pinUserAttribution a.firstAttribution');
    };
    $.fn.hidePinner = function() {
      return $(this).find('.pinUserAttribution').hide();
    };
    $.fn.showPinner = function() {
      return $(this).find('.pinUserAttribution').slideDown();
    };
    $.fn.addRandomPinners = function(num) {
      return this.each(function() {
        var actualUsername, availableUsernames, hasPinnerLink, pin, pinnerLink, pinnerLinks, randomUsernames, whopinnedit;

        pin = $(this);
        pinnerLink = pin.pinnerLink();
        hasPinnerLink = pinnerLink.length;
        if (!hasPinnerLink) {
          return true;
        }
        actualUsername = pin.pinnerLink().username();
        availableUsernames = _.uniq(usernames);
        availableUsernames.splice(availableUsernames.indexOf(actualUsername), 1);
        randomUsernames = _.first(availableUsernames, num);
        pinnerLinks = _.map(randomUsernames, function(username) {
          return pinnersByUsername[username];
        });
        pinnerLinks.push(pinnersByUsername[actualUsername]);
        pinnerLinks = _.shuffle(pinnerLinks);
        pin.find('.pinWrapper').append('<div class="whopinnedit"</div>');
        whopinnedit = pin.find('.whopinnedit');
        return _.each(pinnerLinks, function(pinnerLink) {
          return whopinnedit.append(pinnerLink.outerHTML);
        });
      });
    };
    $.fn.zIndex = function(z) {
      var things;

      things = [$(this), $(this).find('.whopinnedit')];
      return _.each(things, function(ele) {
        return ele.css('z-index', z);
      });
    };
    $('.whopinnedit').remove();
    pins = $('.item');
    pinnerLinks = pins.pinnerLink();
    usernames = [];
    pinnersByUsername = {};
    _.each(pinnerLinks, function(link) {
      var username;

      username = $(link).username();
      usernames.push(username);
      return pinnersByUsername[username] = link;
    });
    pins.hidePinner();
    pins.addRandomPinners(2);
    pins.on('mouseover', function() {
      return $(this).zIndex(999);
    });
    pins.on('mouseout', function() {
      return $(this).zIndex('auto');
    });
    $('.whopinnedit a').on('click', function(event) {
      var color, correct, parentPin, pinLink;

      event.preventDefault();
      event.stopPropagation();
      pinLink = $(this);
      parentPin = pinLink.parents('.item');
      if (pinLink.data('chosen') || parentPin.data('finished')) {
        return;
      }
      pinLink.data('chosen', true);
      correct = pinLink.username() === parentPin.pinnerLink().username();
      if (correct) {
        choseWisely(true);
        parentPin.data('finished', true);
        color = 'rgba(93, 144, 49, 0.2)';
        parentPin.showPinner();
        parentPin.find('.whopinnedit').delay(1000).slideUp();
      } else {
        choseWisely(false);
        color = 'rgba(238, 10, 10, 0.2)';
      }
      return pinLink.css('background-color', color);
    });
    correct = 0;
    incorrect = 0;
    $('body').append('<table id="scoreboard" style="width: 100px; height: 100px; position: fixed; top: 50; right: 70; background: white; z-index: 9999">\n  <caption>WhoPinnedIt?</caption>\n  <tbody>\n    <tr>\n      <th>Correct</th>\n      <td id="num-correct">0</td>\n    </tr>\n    <tr>\n      <th>Incorrect</th>\n      <td id="num-incorrect">0</td>\n    </tr>\n  </tbody>\n</table>');
    scoreboard = $('#scoreboard');
    choseWisely = function(bool) {
      if (bool) {
        correct++;
        return $('#num-correct').html(correct);
      } else {
        incorrect++;
        return $('#num-incorrect').html(incorrect);
      }
    };
    return alert("Ready to play? For each pin, I've randomly added some pinners. Click on the one you think who actually pinned it.");
  });

}).call(this);
