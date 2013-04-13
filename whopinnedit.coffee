$ ->
  # Username from pinnerLink
  $.fn.username = ->
    href = $(this).attr('href')
    href.substr(1,href.length - 2)

  $.fn.pinnerLink = ->
    $(this).find('.pinUserAttribution a.firstAttribution')

  $.fn.hidePinner = ->
    $(this).find('.pinUserAttribution').hide()

  $.fn.showPinner = ->
    $(this).find('.pinUserAttribution').slideDown().delay(200)

  $.fn.addRandomPinners = (num) ->
    @each ->
      pin = $(this)
      pinnerLink = pin.pinnerLink()
      hasPinnerLink = pinnerLink.length
      unless hasPinnerLink then return true # skip.

      actualUsername = pin.pinnerLink().username()

      availableUsernames = _.uniq(usernames)
      availableUsernames.splice(availableUsernames.indexOf(actualUsername), 1)

      randomUsernames = _.first(availableUsernames, num)
      pinnerLinks = _.map randomUsernames, (username) ->
        pinnersByUsername[username]
      pinnerLinks.push(pinnersByUsername[actualUsername])
      pinnerLinks = _.shuffle(pinnerLinks)

      # Add div with pinnerLinks
      pin.find('.pinWrapper').append '<div class="whopinnedit"</div>'
      whopinnedit = pin.find('.whopinnedit')
      _.each pinnerLinks, (pinnerLink) ->
        whopinnedit.append(pinnerLink.outerHTML)

  # Change z-index of item and whopinnedit section
  $.fn.zIndex = (z) ->
    things = [$(this), $(this).find('.whopinnedit')]
    _.each things, (ele) ->
      ele.css('z-index', z)

  # Reset in case they want to play again on same page.
  $('.whopinnedit').remove()

  pins = $('.item')
  pinnerLinks = pins.pinnerLink()

  # Gather usernames into array
  # Group links into Hash
  usernames = []
  pinnersByUsername = {}
  _.each(pinnerLinks, (link) ->
    username =$(link).username()
    usernames.push(username)
    pinnersByUsername[username] = link
  )

  pins.hidePinner()
  pins.addRandomPinners(2)

  # Change z-index when hovering so it doesn't get covered up
  pins.on 'mouseover', -> ( $(this).zIndex(999) )
  pins.on 'mouseout',  -> ( $(this).zIndex('auto') )

  # Pinner clicked
  $('.whopinnedit a').on 'click', (event) ->
    event.preventDefault()
    event.stopPropagation()
    pinLink = $(this)
    parentPin = pinLink.parents('.item')

    correct = pinLink.username() == parentPin.pinnerLink().username()
    if correct
      color = 'rgba(93, 144, 49, 0.2)'
      parentPin.showPinner()
    else
      color = 'rgba(238, 10, 10, 0.2)'
    pinLink.css('background-color', color)

  # Welcome.
  alert "Ready to play? For each pin, I've randomly added some pinners. Click on the one you think who actually pinned it."
