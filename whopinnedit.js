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
      pinnerLink = pin.pinnerLink()
      hasPinnerLink = pinnerLink.length
      if (!hasPinnerLink) { return true }

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
      pin.find('.pinWrapper').append(
        '<div class="whopinnedit"' +
        '</div>'
      )
      whopinnedit = pin.find('.whopinnedit')
      _.each(pinnerLinks, function(pinnerLink) {
        whopinnedit.append(pinnerLink.outerHTML)
      })
    })
  }

  // Reset in case they want to play again on same page.
  $('.whopinnedit').remove()

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

  // Pinner clicked
  $('.whopinnedit a').on('click', function(event) {
    event.preventDefault()
    event.stopPropagation()
    pinLink = $(this)
    parentPin = pinLink.parents('.item')

    correct = pinLink.username() == parentPin.pinnerLink().username()
    if (correct) {
      color = 'rgba(93, 144, 49, 0.2)'
      parentPin.showPinner()
    } else {
      color = 'rgba(238, 10, 10, 0.2)'
    }
    pinLink.css('background-color', color)
  })

  // Welcome.
  alert("Ready to play? For each pin, I've randomly added some pinners. Click on the one you think who actually pinned it.")
})
