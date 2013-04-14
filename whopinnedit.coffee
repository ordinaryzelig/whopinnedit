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
    $(this).find('.pinUserAttribution').slideDown()

  $.fn.addRandomPinners = (num) ->
    @each ->
      pin = $(this)
      pinnerLink = pin.pinnerLink()
      hasPinnerLink = pinnerLink.length
      unless hasPinnerLink then return true # skip.

      actualUsername = pin.pinnerLink().username()

      availableUsernames = _.chain(usernames)
        .uniq()
        .without(actualUsername, playerUsername)
        .value()

      randomUsernames = _.chain(availableUsernames)
        .shuffle()
        .first(num)
        .value()
      pinnerLinks = _.map randomUsernames, (username) ->
        pinnersByUsername[username]
      pinnerLinks.push(pinnersByUsername[actualUsername])
      pinnerLinks = _.shuffle(pinnerLinks)

      # Add div with pinnerLinks
      pin.find('.pinWrapper').append '<div class="whopinnedit pinUserAttribution"></div>'
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

  playerUsername = $('.UserMenu a:first').username()
  pins.hidePinner()
  pins.addRandomPinners(2)

  # Change z-index when hovering so it doesn't get covered up
  menuZIndex = parseInt($('.headerBackground').css('z-index'))
  pins.on 'mouseover', -> ( $(this).zIndex(menuZIndex - 1) )
  pins.on 'mouseout',  -> ( $(this).zIndex('auto') )

  # Pinner clicked
  $('.whopinnedit a').on 'click', (event) ->
    event.preventDefault()
    event.stopPropagation()
    pinLink = $(this)
    parentPin = pinLink.parents('.item')

    # don't do anything if this link was already chosen or pin already finished.
    return if pinLink.data('chosen') or parentPin.data('finished')
    pinLink.data('chosen', true)

    correct = pinLink.username() == parentPin.pinnerLink().username()
    if correct
      choseWisely(true)
      parentPin.data('finished', true)
      color = 'rgba(93, 144, 49, 0.2)'
      parentPin.showPinner()
      # parentPin.find('.whopinnedit').delay(1000).slideUp()
    else
      choseWisely(false)
      color = 'rgba(238, 10, 10, 0.2)'
    pinLink.css('background-color', color)

  # Scoreboard
  correct = 0
  incorrect = 0

  ############
  # Scoreboard

  scoreboardHTML = '''
    <style>
      #scoreboard {
        float: right;
        margin-right: 10px;
      }
      #scoreboard li {
        display: inline-block;
        width: 15px;
        line-height: 15px;
        font-size: 15pt;
        text-align: center;
        font-weight: bold;
        padding: 10px;
      }
      #num-correct, #num-incorrect {
        color: white;
      }
      #num-correct {
        background-color: green;
      }
      #num-incorrect {
        background-color: red;
      }
      li#whopinnedit-logo {
        width: 30;
        height: 30;
        padding: 0;
      }
      #whopinnedit-logo a {
        color: red;
      }
    </style>
    <ul id="scoreboard">
      <li id="whopinnedit-logo" title="WhoPinnedIt?">
        <a href="http://ordinaryzelig.github.com/whopinnedit" target="_blank">
          <img src="https://raw.github.com/ordinaryzelig/whopinnedit/gh-pages/logo-small.png"/>
        </a>
      </li>
      <li id="num-correct">0</li>
      <li id="num-incorrect">0</li>
    </ul>
  '''

  $('.rightHeaderContent').after scoreboardHTML
  scoreboard = $('#scoreboard')
  choseWisely = (bool) ->
    if bool
      correct++
      $('#num-correct').html(correct)
    else
      incorrect++
      $('#num-incorrect').html(incorrect)

  # Welcome.
  alert """
Ready to play?
For each pin, I've randomly added some pinners.
Click on the one you think who actually pinned it.
Your score is at the top.
Happy guessing!
"""
