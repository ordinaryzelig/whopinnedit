$(function() {
  // Username from pinnerLink
  $.fn.username = function() {
    href = $(this).attr('href')
    return href.substr(1,href.length - 2)
  }

  $.fn.pinnerLink = function() {
    return $(this).find('.pinUserAttribution a.firstAttribution')
  }

  $.fn.hidePinner = function() {
    $(this).find('.pinUserAttribution').hide()
  }

  $.fn.showPinner = function() {
    $(this).find('.pinUserAttribution').slideDown().delay(200)
  }

  $.fn.addRandomPinners = function(num) {
    this.each(function() {
      pin = $(this)
      if (pin.find('.UserRecentActivity').length) { return true }

      actualUsername = pin.pinnerLink().username()

      availableUsernames = _.uniq(usernames)
      availableUsernames.splice(availableUsernames.indexOf(actualUsername), 1)

      randomUsernames = _.first(availableUsernames, num)
      pinnerLinks = _.map(randomUsernames, function(username) {
        return pinnersByUsername[username]
      })
      pinnerLinks.push(pinnersByUsername[actualUsername])
      pinnerLinks = _.shuffle(pinnerLinks)

      // Add div with pinnerLinks
      pin.append(
        '<div class="whopinnedit">' +
        '<ul>' +
        '</ul>' +
        '</div>'
      )
      whopinnedit = pin.find('.whopinnedit')
      ul = whopinnedit.find('ul')
      _.each(pinnerLinks, function(pinnerLink) {
        li = '<li>' + pinnerLink.outerHTML + '</li>'
        ul.append(li)
      })
    })
  }

  pins = $('.item')

  pinnerLinks = pins.pinnerLink()

  // Gather usernames into array
  // Group links into Hash
  var usernames = []
  var pinnersByUsername = {}
  _.each(pinnerLinks, function(link) {
    username =$(link).username()
    usernames.push(username)
    pinnersByUsername[username] = link
  })

  pins.hidePinner()
  pins.addRandomPinners(2)

  // Pinner clicked.
  $('.whopinnedit a').on('click', function(event) {
    event.preventDefault()
    pinLink = $(this)
    parentPin = pinLink.parents('.item')

    if (pinLink.username() == parentPin.pinnerLink().username()) {
      color = '#5D9031'
      parentPin.showPinner()
    } else {
      color = '#EE0A17'
    }
    pinLink.css('background-color', color)
    pinLink.css('color', 'white')
  })
})
