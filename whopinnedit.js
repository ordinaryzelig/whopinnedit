(function() {
  $(function() {
    var choseWisely, correct, incorrect, menuZIndex, pinnerLinks, pinnersByUsername, pins, playerUsername, scoreboard, scoreboardHTML, usernames;

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
        availableUsernames = _.chain(usernames).uniq().without(actualUsername, playerUsername).value();
        randomUsernames = _.chain(availableUsernames).shuffle().first(num).value();
        pinnerLinks = _.map(randomUsernames, function(username) {
          return pinnersByUsername[username];
        });
        pinnerLinks.push(pinnersByUsername[actualUsername]);
        pinnerLinks = _.shuffle(pinnerLinks);
        pin.find('.pinWrapper').append('<div class="whopinnedit pinUserAttribution"></div>');
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
    playerUsername = $('.UserMenu a:first').username();
    pins.hidePinner();
    pins.addRandomPinners(2);
    menuZIndex = parseInt($('.headerBackground').css('z-index'));
    pins.on('mouseover', function() {
      return $(this).zIndex(menuZIndex - 1);
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
      } else {
        choseWisely(false);
        color = 'rgba(238, 10, 10, 0.2)';
      }
      return pinLink.css('background-color', color);
    });
    correct = 0;
    incorrect = 0;
    scoreboardHTML = '<style>\n  #scoreboard {\n    float: right;\n    margin-right: 10px;\n  }\n  #scoreboard li {\n    display: inline-block;\n    width: 15px;\n    line-height: 15px;\n    font-size: 15pt;\n    text-align: center;\n    font-weight: bold;\n    padding: 10px;\n  }\n  #num-correct, #num-incorrect {\n    color: white;\n  }\n  #num-correct {\n    background-color: green;\n  }\n  #num-incorrect {\n    background-color: red;\n  }\n  #logo {\n    color: red;\n  }\n</style>\n<ul id="scoreboard">\n  <li id="logo">?</li>\n  <li id="num-correct">0</li>\n  <li id="num-incorrect">0</li>\n</ul>';
    $('.rightHeaderContent').after(scoreboardHTML);
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
