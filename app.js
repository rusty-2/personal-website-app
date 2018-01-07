$(function () {
  $(window).scroll(handleScroll);

  $('#navigate-top-icon').on('click', function (e) {
    e.preventDefault();

    $(document.body).delay(100).animate({
      scrollTop: 0
    }, 1000);
  });

  $('#menu-icon').on('click', function (e) {
    e.preventDefault();
    if ($("#myTopnav").hasClass('responsive')) {
      $("#myTopnav").removeClass('responsive');
    } else {
      $("#myTopnav").addClass('responsive');
    }
  });

  $('nav a:not(:first-child)').on('click', function (e) {
    e.preventDefault();

    var href = $(e.target).attr('href');
    $(document.body).animate({
      scrollTop: $(href).offset().top
    }, 1000);
  });

  var images = {};
  var slideShowImgs = {};
  (function init() {
    $('.lazy-img').each(function (indx, el) {
      images[indx] = el;
      slideShowImgs[indx] = el;
      el.onload = function () {
        delete images[indx];
        $(el).removeClass('loading');
        $('.slideshow-arrow').each(function (indx, el) {
          el.style.display = 'inline';
        });
        el.onload = null;
      }
    });
    handleScroll();
  })();

  function handleScroll() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.body.scrollHeight - document.body.clientHeight;
    var scrolled = (winScroll / height) * 100;
    if (scrolled > 11) {
      $(".topnav").addClass("up");
      $('#navigate-top-icon').show();
    }
    if (scrolled < 9) {
      $(".topnav").removeClass("up");
      $("#navigate-top-icon").hide();
    }

    document.getElementById("myBar").style.width = scrolled + "%";

    $('nav a').slice(1, 6).each(function (indx, el) {
      var targetHref = $(el).attr('href').substr(1);
      var targetEl = document.getElementById(targetHref);
      var offset = $('nav').height();
      if (isOnTopAndStillVisible(targetEl, offset)) {
        $(el).addClass('active');
      } else {
        $(el).removeClass('active');
      }
    });

    for (var imIndx in images) {
      if (images.hasOwnProperty(imIndx)) {
        var image = images[imIndx];
        if (isInViewPort(image)) {
          loadImage($(image));
        }
      }
    }

    if(isInViewPort($("#skills")[0])) {
      animateSkills();
    }
  }

  function isOnTopAndStillVisible(el, offset) {
    var rect = el.getBoundingClientRect();
    return rect.top <= offset && rect.top + rect.height > offset;
  }

  function isInViewPort(el) {
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.top < window.innerHeight;
  }

  function loadImage(el) {
    setTimeout(function () {
      el.attr('src', el.data('real-src'));
    }, 1000);
  }

  (function handleSlidesChange() {
    $("#slideshow-dots-container span.dot").on('click', function (e) {
      var $el = $(e.target);
      if (!$el.hasClass('active')) {
        var $prevEl = $("#slideshow-dots-container span.dot.active");
        $prevEl.removeClass('active');
        var prevImg = $(".lazy-img")[$prevEl.index()];
        $(prevImg).addClass('hidden');
        var currImg = $(".lazy-img")[$el.index()];
        $(currImg).removeClass('hidden');
        $el.addClass('active');
        var nextSlideIndx = $el.index() + 1;
        if (nextSlideIndx > 3) {
          nextSlideIndx = 0;
        }
        triggerSlideChange(nextSlideIndx);
      }
    });

    var timeout;
    function triggerSlideChange(indx) {
      clearTimeout(timeout);
      timeout = setTimeout(function (indx) {
        var currentDot = $("#slideshow-dots-container span.dot")[indx];
        $(currentDot).trigger('click');
      }.bind(this, indx), 5000);
    }
    triggerSlideChange(1);
  })();

  function animateSkills() {
    $('.skill').each(function (indx, el) {
      $(el).animate({
        width: $(el).data('skill-lvl') * 100 + '%'
      }, 2000);
    });
  }
});