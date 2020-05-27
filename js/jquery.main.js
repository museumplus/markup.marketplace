(function (document, window) {
  //selectors
  var popupElement = document.querySelector(".magnet-popup");
  var closeButton = document.querySelector(".magnet-popup__close-button");

  if (popupElement) {
    window.popup = {
      open: function open() {
        popupElement.classList.remove("magnet-popup--hidden");
      },
      close: function close() {
        popupElement.classList.add("magnet-popup--hidden");
      },
    };
    setTimeout(function () {
      popup.open();
    }, 5000);
  }

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      popup.close();
    });
  }
})(document, window);

jQuery(function () {
  initLazyHover();
  initDropDownClasses();
  initCustomHover();
  initSlickGallery();
  initPopups();
  initSameHeight();
  initCustomForms();
  initChoosePrice();
  initOpenClose();
  initFancybox();

  if ($(".fancybox-img").length > 0) {
    $(".product-card__img-link").on("click", function (e) {
      e.preventDefault();
      $(".fancybox-img:eq(0)").click();
    });

    initFancyboxImg();
  }

  $(".main-nav__item-link--catalog").hover(function () {
    $(".main-nav__drop--catalog .main-nav__drop-list")
      .find(".item-hover")
      .removeClass("item-hover");
    $(".main-nav__drop--catalog .main-nav__drop-list")
      .find(":first-child")
      .addClass("item-hover");
    /*
            if($('.main-nav__sub-item--first li:first-child').hasClass('has-drop-down')) {
                $('.main-nav__sub-item--first li:first-child').find('.item-hover-2').removeClass('item-hover-2');
                $('.main-nav__sub-item--first li:first-child').addClass('item-hover-2');
            } */
  });

  if ($(window).width() < 1024) {
    initCatalogMenu();
    initMultilevelMenu();
    initTabletMenu();
    initSameHeightMainSlider();
  }

  $(".showFull").on("click", function (e) {
    e.preventDefault();

    if ($(this).parents(".order__item").hasClass("active")) {
      e.stopPropagation();
      $(this).parents(".order__item").removeClass("active");
    } else {
      e.stopPropagation();
      $(this)
        .parents(".order__item")
        .addClass("load")
        .siblings()
        .removeClass("active load");

      $(this)
        .parents(".order__item")
        .delay(1000)
        .queue(function (next) {
          $(this).addClass("active").removeClass("load");
          next();
        });
    }
  });

  $.widget("custom.combobox", {
    _create: function () {
      this.wrapper = $("<span>")
        .addClass("custom-combobox")
        .insertAfter(this.element);

      this.element.hide();
      this._createAutocomplete();
      this._createShowAllButton();
    },

    _createAutocomplete: function () {
      var selected = this.element.children(":selected"),
        value = selected.val() ? selected.text() : "";

      this.input = $("<input>")
        .appendTo(this.wrapper)
        .val(value)
        .attr("title", "")
        .addClass(
          "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left"
        )
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: $.proxy(this, "_source"),
        })
        .tooltip({
          classes: {
            "ui-tooltip": "ui-state-highlight",
          },
        });

      this._on(this.input, {
        autocompleteselect: function (event, ui) {
          ui.item.option.selected = true;
          this._trigger("select", event, {
            item: ui.item.option,
          });
        },

        autocompletechange: "_removeIfInvalid",
      });
    },

    _createShowAllButton: function () {
      var input = this.input,
        wasOpen = false;

      $("<a>")
        .attr("tabIndex", -1)
        .tooltip()
        .appendTo(this.wrapper)
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s",
          },
          text: false,
        })
        .removeClass("ui-corner-all")
        .addClass("custom-combobox-toggle ui-corner-right")
        .on("mousedown", function () {
          wasOpen = input.autocomplete("widget").is(":visible");
        })
        .on("click", function () {
          input.trigger("focus");

          // Close if already visible
          if (wasOpen) {
            return;
          }

          // Pass empty string as value to search for, displaying all results
          input.autocomplete("search", "");
        });
    },

    _source: function (request, response) {
      var matcher = new RegExp(
        $.ui.autocomplete.escapeRegex(request.term),
        "i"
      );
      response(
        this.element.children("option").map(function () {
          var text = $(this).text();
          if (this.value && (!request.term || matcher.test(text)))
            return {
              label: text,
              value: text,
              option: this,
            };
        })
      );
    },

    _removeIfInvalid: function (event, ui) {
      // Selected an item, nothing to do
      if (ui.item) {
        return;
      }

      // Search for a match (case-insensitive)
      var value = this.input.val(),
        valueLowerCase = value.toLowerCase(),
        valid = false;
      this.element.children("option").each(function () {
        if ($(this).text().toLowerCase() === valueLowerCase) {
          this.selected = valid = true;
          return false;
        }
      });

      // Found a match, nothing to do
      if (valid) {
        return;
      }

      // Remove invalid value
      this.input
        .val("")
        .attr("title", value + " didn't match any item")
        .tooltip("open");
      this.element.val("");
      this._delay(function () {
        this.input.tooltip("close").attr("title", "");
      }, 2500);
      this.input.autocomplete("instance").term = "";
    },

    _destroy: function () {
      this.wrapper.remove();
      this.element.show();
    },
  });

  $("#museum-name").combobox();
});

$(window).resize(function () {
  if ($(window).width() < 1024) {
    initCatalogMenu();
    initMultilevelMenu();
    initTabletMenu();
  }
});

// initialize fancybox
function initFancybox() {
  jQuery(".fancybox").fancybox({
    padding: 0,
    margin: 0,
    helpers: {
      overlay: {
        css: {
          background: "rgba(29,29,29,0.7)",
        },
      },
    },
  });
}

function initFancyboxImg() {
  jQuery(".fancybox-img").fancybox({
    helpers: {
      overlay: {
        css: {
          background: "rgba(29,29,29,0.9)",
        },
      },
      title: {
        type: "float",
      },
    },

    afterLoad: function () {
      var list = $("#links");

      if (!list.length && $(".fancybox-img").length > 1) {
        list = $('<ul id="links">');

        for (var i = 0; i < this.group.length; i++) {
          $('<li data-index="' + i + '"><label>' + (i + 1) + "</label></li>")
            .click(function () {
              $.fancybox.jumpto($(this).data("index"));
            })
            .appendTo(list);
        }

        list.appendTo(".fancybox-overlay");
        list.fadeIn("fast");
      }

      list.find("li").removeClass("active").eq(this.index).addClass("active");

      $(".fancybox-wrap").addClass("fancybox-img-galery");
    },
    beforeClose: function () {
      $("#links").remove();
    },
    mouseWheel: false,
  });
}

// open-close init
function initOpenClose() {
  jQuery("div.toggle-block").openClose({
    activeClass: "expanded",
    opener: ".opener-row",
    slider: "div.slide",
    animSpeed: 200,
    effect: "slide",
  });
}

/*
 * jQuery Open/Close plugin
 */
(function ($) {
  function OpenClose(options) {
    this.options = $.extend(
      {
        addClassBeforeAnimation: true,
        hideOnClickOutside: false,
        activeClass: "active",
        opener: ".opener",
        slider: ".slide",
        animSpeed: 400,
        effect: "fade",
        event: "click",
      },
      options
    );
    this.init();
  }
  OpenClose.prototype = {
    init: function () {
      if (this.options.holder) {
        this.findElements();
        this.attachEvents();
        this.makeCallback("onInit", this);
      }
    },
    findElements: function () {
      this.holder = $(this.options.holder);
      this.opener = this.holder.find(this.options.opener);
      this.slider = this.holder.find(this.options.slider);
    },
    attachEvents: function () {
      // add handler
      var self = this;
      this.eventHandler = function (e) {
        e.preventDefault();
        if (self.slider.hasClass(slideHiddenClass)) {
          self.showSlide();
        } else {
          self.hideSlide();
        }
      };
      self.opener.bind(self.options.event, this.eventHandler);

      // hover mode handler
      if (self.options.event === "over") {
        self.opener.bind("mouseenter", function () {
          self.showSlide();
        });
        self.holder.bind("mouseleave", function () {
          self.hideSlide();
        });
      }

      // outside click handler
      self.outsideClickHandler = function (e) {
        if (self.options.hideOnClickOutside) {
          var target = $(e.target);
          if (!target.is(self.holder) && !target.closest(self.holder).length) {
            self.hideSlide();
          }
        }
      };

      // set initial styles
      if (this.holder.hasClass(this.options.activeClass)) {
        $(document).bind("click touchstart", self.outsideClickHandler);
      } else {
        this.slider.addClass(slideHiddenClass);
      }
    },
    showSlide: function () {
      var self = this;
      if (self.options.addClassBeforeAnimation) {
        self.holder.addClass(self.options.activeClass);
      }
      self.slider.removeClass(slideHiddenClass);
      $(document).bind("click touchstart", self.outsideClickHandler);

      self.makeCallback("animStart", true);
      toggleEffects[self.options.effect].show({
        box: self.slider,
        speed: self.options.animSpeed,
        complete: function () {
          if (!self.options.addClassBeforeAnimation) {
            self.holder.addClass(self.options.activeClass);
          }
          self.makeCallback("animEnd", true);
        },
      });
    },
    hideSlide: function () {
      var self = this;
      if (self.options.addClassBeforeAnimation) {
        self.holder.removeClass(self.options.activeClass);
      }
      $(document).unbind("click touchstart", self.outsideClickHandler);

      self.makeCallback("animStart", false);
      toggleEffects[self.options.effect].hide({
        box: self.slider,
        speed: self.options.animSpeed,
        complete: function () {
          if (!self.options.addClassBeforeAnimation) {
            self.holder.removeClass(self.options.activeClass);
          }
          self.slider.addClass(slideHiddenClass);
          self.makeCallback("animEnd", false);
        },
      });
    },
    destroy: function () {
      this.slider.removeClass(slideHiddenClass).css({ display: "" });
      this.opener.unbind(this.options.event, this.eventHandler);
      this.holder.removeClass(this.options.activeClass).removeData("OpenClose");
      $(document).unbind("click touchstart", this.outsideClickHandler);
    },
    makeCallback: function (name) {
      if (typeof this.options[name] === "function") {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },
  };

  // add stylesheet for slide on DOMReady
  var slideHiddenClass = "js-slide-hidden";
  (function () {
    var tabStyleSheet = $('<style type="text/css">')[0];
    var tabStyleRule = "." + slideHiddenClass;
    tabStyleRule +=
      "{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}";
    if (tabStyleSheet.styleSheet) {
      tabStyleSheet.styleSheet.cssText = tabStyleRule;
    } else {
      tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
    }
    $("head").append(tabStyleSheet);
  })();

  // animation effects
  var toggleEffects = {
    slide: {
      show: function (o) {
        o.box.stop(true).hide().slideDown(o.speed, o.complete);
      },
      hide: function (o) {
        o.box.stop(true).slideUp(o.speed, o.complete);
      },
    },
    fade: {
      show: function (o) {
        o.box.stop(true).hide().fadeIn(o.speed, o.complete);
      },
      hide: function (o) {
        o.box.stop(true).fadeOut(o.speed, o.complete);
      },
    },
    none: {
      show: function (o) {
        o.box.hide().show(0, o.complete);
      },
      hide: function (o) {
        o.box.hide(0, o.complete);
      },
    },
  };

  // jQuery plugin interface
  $.fn.openClose = function (opt) {
    return this.each(function () {
      jQuery(this).data(
        "OpenClose",
        new OpenClose($.extend(opt, { holder: this }))
      );
    });
  };
})(jQuery);

// choose price slider
function initChoosePrice() {
  $(".choose-price").each(function () {
    var holder = $(this),
      sliderBar = holder.find(".slider-bar"),
      fieldMin = holder.find("input.min"),
      fieldMax = holder.find("input.max"),
      labelMin = holder.find(".price-range .min"),
      labelMax = holder.find(".price-range .max");

    if (holder.hasClass("double"))
      sliderBar.slider({
        range: true,
        min: parseInt(fieldMin.attr("minValue")),
        max: parseInt(fieldMax.attr("maxValue")),
        step: 5,
        values: [parseInt(fieldMin.val()), parseInt(fieldMax.val())],
        slide: function (event, ui) {
          var minVal = ui.values[0];
          var maxVal = ui.values[1];

          //if (minVal > 1000)
          //	minVal = (parseInt(minVal/1000) != 0 ? parseInt(minVal/1000) : '') + ' ' + ((minVal%1000) !== 0 ? (minVal%1000) : '000');
          //if (maxVal > 1000)
          //	maxVal = (parseInt(maxVal/1000) != 0 ? parseInt(maxVal/1000) : '') + ' ' + ((maxVal%1000) !== 0 ? (maxVal%1000) : '000');

          fieldMin.val(minVal);
          fieldMax.val(maxVal);
          fieldMin.keyup();
          fieldMax.keyup();
          labelMin.text(minVal);
          labelMax.text(maxVal);
        },
      });

    if (holder.hasClass("single"))
      sliderBar.slider({
        value: parseInt(fieldMax.val()),
        step: 100,
        min: 0,
        max: parseInt(fieldMax.attr("maxValue")),
        range: "min",
        slide: function (event, ui) {
          var val = ui.value;

          fieldMax.val(val);
          fieldMax.keyup();
          labelMax.text(val);
        },
      });

    fieldMin.bind("keyup", function () {
      var v = parseInt(fieldMin.val().replace(/\s/g, ""));
      if (!isNaN(v)) {
        var values = sliderBar.slider("option", "values"),
          value = sliderBar.slider("option", "value");

        if (values && values[1] > v) {
          labelMin.text(v);
          sliderBar.slider("option", "values", [v, values[1]]);
        }

        if (value && value > 0) {
          labelMax.text(0);
          $(this).val(0);
        }
      }
    });

    fieldMin.on("change", function () {
      if (parseInt(this.value) < parseInt(fieldMin.attr("minValue"))) {
        this.value = fieldMin.attr("minValue");
      }
    });

    fieldMax.bind("keyup", function () {
      var v = parseInt(fieldMax.val().replace(/\s/g, ""));
      if (!isNaN(v)) {
        var values = sliderBar.slider("option", "values"),
          value = sliderBar.slider("option", "value");

        if (values && values[0] < v) {
          labelMax.text(v);
          sliderBar.slider("option", "values", [values[0], v]);
        }

        if (value && value > 0) {
          labelMax.text(v);
          sliderBar.slider("option", "value", v);
        }
      }
    });

    fieldMax.on("change", function () {
      if (parseInt(this.value) > parseInt(fieldMax.attr("maxValue"))) {
        this.value = fieldMax.attr("maxValue");
      }
      console.log(this.value);
    });
  });
}

// initialize custom form elements
function initCustomForms() {
  jcf.setOptions("Select", {
    wrapNative: false,
    wrapNativeOnMobile: false,
  });
  jcf.replaceAll();
  jcf.destroy(".select-museum-name");
}

// align blocks height
function initSameHeight() {
  jQuery(".products-list").sameHeight({
    elements: ".catalog__item-wrapper",
    flexible: true,
    multiLine: true,
  });

  jQuery(".products-list").sameHeight({
    elements: ".catalog__item-description p",
    flexible: true,
    multiLine: true,
  });

  jQuery(".products-list").sameHeight({
    elements: ".catalog__item",
    flexible: true,
    multiLine: true,
  });

  jQuery(".museums-list").sameHeight({
    elements: ".museum__item-wrapper",
    flexible: true,
    multiLine: true,
  });

  jQuery(".exhibitions-list").sameHeight({
    elements: ".exhibition__item-wrapper",
    flexible: true,
    multiLine: true,
  });
}

function initSameHeightMainSlider() {
  jQuery(".main-slider__slides").sameHeight({
    elements: ".main-slider__description",
    flexible: true,
    multiLine: true,
  });
}

function initSlickGallery() {
  $(".main-slider__slides").slick({
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    dots: false,
    fade: true,
    arrows: true,
    nextArrow:
      '<a class="slider-arrow-btn--next slider-arrow-btn" href="#">Next</a>',
    prevArrow:
      '<a class="slider-arrow-btn--prev slider-arrow-btn" href="#">Previous</a>',
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          dotsClass: "mm-dots",
        },
      },
    ],
  });

  $(".souvenirs-slides").slick({
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    dots: false,
    fade: true,
    arrows: true,
    prevArrow: $(".souvenirs-arrow--prev"),
    nextArrow: $(".souvenirs-arrow--next"),
  });

  $(".products-slider").slick({
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: false,
    infinite: true,
    dots: false,
    arrows: true,
    nextArrow:
      '<a class="slider-arrow-btn--next slider-arrow-btn" href="#">Next</a>',
    prevArrow:
      '<a class="slider-arrow-btn--prev slider-arrow-btn" href="#">Previous</a>',
  });

  jQuery(".product-card__img-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".thumbnails-holder",
  });

  jQuery(".thumbnails-holder").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    nextArrow:
      '<a class="slider-arrow-btn product-info-slider-btn--next product-info-slider-btn" href="#">Next</a>',
    prevArrow:
      '<a class="slider-arrow-btn product-info-slider-btn--prev product-info-slider-btn" href="#">Previous</a>',
    asNavFor: ".product-card__img-slider",
    focusOnSelect: true,
    infinite: true,
    vertical: false,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1090,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          vertical: false,
        },
      },
    ],
  });
}
// popups init
function initPopups() {
  jQuery(".search-form").contentPopup({
    btnOpen: ".search-form-opener",
    popup: ".search-box",
    openClass: "active",
  });

  jQuery("body").contentPopup({
    btnOpen: ".btn-filter-opener",
    popup: ".filter-area-body-popup",
    openClass: "filter-area-body-popup-active",
    btnClose: ".body-popup-close, .filter-area-body-popup .btn-body-popup-back",
    hideOnClickOutside: false,
  });
}

function initCatalogMenu() {
  jQuery("body").contentPopup({
    btnOpen: ".tablets-catalog-opener",
    popup: ".tablets-catalog-body-popup",
    openClass: "tablets-catalog-body-popup-active",
    btnClose: ".body-popup-close",
    hideOnClickOutside: false,
  });
}

function initTabletMenu() {
  jQuery("body").contentPopup({
    btnOpen: ".main-nav__toggle--tablet",
    popup: ".tablets-catalog-body-popup",
    openClass:
      "tablets-catalog-body-popup-active tablets-menu-body-popup-active",
    btnClose: ".body-popup-close",
    hideOnClickOutside: false,
  });
}

(function ($) {
  function ContentPopup(opt) {
    this.options = $.extend(
      {
        holder: null,
        popup: ".popup",
        btnOpen: ".open",
        btnClose: ".close",
        openClass: "popup-active",
        clickEvent: "click",
        mode: "click",
        hideOnClickLink: true,
        hideOnClickOutside: true,
        delay: 50,
      },
      opt
    );
    if (this.options.holder) {
      this.holder = $(this.options.holder);
      this.init();
    }
  }
  ContentPopup.prototype = {
    init: function () {
      this.findElements();
      this.attachEvents();
    },
    findElements: function () {
      this.popup = this.holder.find(this.options.popup);
      this.btnOpen = this.holder.find(this.options.btnOpen);
      this.btnClose = this.holder.find(this.options.btnClose);
    },
    attachEvents: function () {
      // handle popup openers
      var self = this;
      this.clickMode =
        isTouchDevice || self.options.mode === self.options.clickEvent;

      if (this.clickMode) {
        // handle click mode
        this.btnOpen.bind(self.options.clickEvent, function (e) {
          if (self.holder.hasClass(self.options.openClass)) {
            if (self.options.hideOnClickLink) {
              self.hidePopup();
            }
          } else {
            self.showPopup();
          }
          e.preventDefault();
        });

        // prepare outside click handler
        this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
      } else {
        // handle hover mode
        var timer,
          delayedFunc = function (func) {
            clearTimeout(timer);
            timer = setTimeout(function () {
              func.call(self);
            }, self.options.delay);
          };
        this.btnOpen
          .bind("mouseover", function () {
            delayedFunc(self.showPopup);
          })
          .bind("mouseout", function () {
            delayedFunc(self.hidePopup);
          });
        this.popup
          .bind("mouseover", function () {
            delayedFunc(self.showPopup);
          })
          .bind("mouseout", function () {
            delayedFunc(self.hidePopup);
          });
      }

      // handle close buttons
      this.btnClose.bind(self.options.clickEvent, function (e) {
        self.hidePopup();
        e.preventDefault();
      });
    },
    outsideClickHandler: function (e) {
      // hide popup if clicked outside
      var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
      if (
        !targetNode.closest(this.popup).length &&
        !targetNode.closest(this.btnOpen).length
      ) {
        this.hidePopup();
      }
    },
    showPopup: function () {
      // reveal popup
      this.holder.addClass(this.options.openClass);
      this.popup.css({ display: "block" });

      // outside click handler
      if (
        this.clickMode &&
        this.options.hideOnClickOutside &&
        !this.outsideHandlerActive
      ) {
        this.outsideHandlerActive = true;
        $(document).bind("click touchstart", this.outsideClickHandler);
      }
    },
    hidePopup: function () {
      // hide popup
      this.holder.removeClass(this.options.openClass);
      this.popup.css({ display: "none" });

      // outside click handler
      if (
        this.clickMode &&
        this.options.hideOnClickOutside &&
        this.outsideHandlerActive
      ) {
        this.outsideHandlerActive = false;
        $(document).unbind("click touchstart", this.outsideClickHandler);
      }
    },
    bind: function (f, scope, forceArgs) {
      return function () {
        return f.apply(scope, forceArgs ? [forceArgs] : arguments);
      };
    },
  };

  // detect touch devices
  var isTouchDevice =
    /Windows Phone/.test(navigator.userAgent) ||
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch);

  // jQuery plugin interface
  $.fn.contentPopup = function (opt) {
    return this.each(function () {
      new ContentPopup($.extend(opt, { holder: this }));
    });
  };
})(jQuery);

function initMultilevelMenu() {
  jQuery(".tablets-catalog-menu").multilevelMenu({
    back: ".btn-multilevelmenu-back",
  });
}

// multiLevel menu plugin
(function ($) {
  function MultilevelMenu(options) {
    this.options = $.extend(
      {
        items: "li",
        slide: "ul",
        drop: ">ul",
        opener: ".mobile-opener",
        back: ".btn-back",
        animSpeed: 300,
      },
      options
    );
    this.init();
  }

  MultilevelMenu.prototype = {
    init: function () {
      if (this.options.holder) {
        this.findElements();
        this.relatedElements();
        this.attachEvents();
        this.makeCallback("onInit", this);
      }
    },
    findElements: function () {
      this.holder = $(this.options.holder);
      this.slides = this.holder.find(this.options.slide);
      this.items = this.slides.find(this.options.items);
      this.drops = this.items.find(this.options.drop).hide();
      this.openers = this.items.find(this.options.opener);
      this.closes = this.items.find(this.options.back);
      this.keyElements = {};
    },
    relatedElements: function () {
      var self = this;

      $.each(this.openers, function (index) {
        var link = $(this);
        var item = link.parent(self.options.items);
        var dataID = "property" + index;

        self.keyElements[dataID] = {
          drop: item.find(self.options.drop),
          back: item.find(self.options.back),
          slide: item.parent(self.options.slide),
        };
        $.data(this, "relatedElements", dataID);
        if ($(self.options.back).length) {
          $.data(item.find(self.options.back)[0], "relatedElements", dataID);
        }
      });
    },
    attachEvents: function () {
      var self = this;

      this.openHandler = function (e) {
        e.preventDefault();
        self.showSlide(this);
      };

      this.closeHandler = function (e) {
        e.preventDefault();
        self.hideSlide(this);
      };

      this.openers.on("click", this.openHandler);
      this.closes.on("click", this.closeHandler);
    },
    showSlide: function (obj) {
      var self = this;
      var linkedData = $.data(obj, "relatedElements");
      var keyElements = self.keyElements[linkedData];

      if (keyElements.drop.length) {
        keyElements.drop.show();
        keyElements.back.hide();
        keyElements.slide.animate(
          {
            marginLeft: "-100%",
          },
          {
            duration: self.options.animSpeed,
            complete: function () {
              keyElements.back.show();
              self.makeCallback("onChange", self);
            },
          }
        );
        self.holder.animate({
          height: keyElements.drop.outerHeight(),
        });
      }
    },
    hideSlide: function (obj) {
      var self = this;
      var linkedData = $.data(obj, "relatedElements");
      var keyElements = self.keyElements[linkedData];

      if (keyElements.drop.length) {
        keyElements.drop.show();
        keyElements.back.hide();
        keyElements.slide.animate(
          {
            marginLeft: 0,
          },
          {
            duration: self.options.animSpeed,
            complete: function () {
              keyElements.drop.hide();
              keyElements.back.show();
              self.makeCallback("onReturned", self);
            },
          }
        );
        self.holder.animate({
          height: keyElements.slide.outerHeight(),
        });
      }
    },
    makeCallback: function (name) {
      if (typeof this.options[name] === "function") {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },
    destroy: function () {
      this.openers.off("click", this.openHandler);
      this.closes.off("click", this.closeHandler);
      this.holder.css({ height: "" });
      this.slides.css({ marginLeft: "" });
    },
  };

  $.fn.multilevelMenu = function (opt) {
    return this.each(function () {
      $(this).data(
        "MultilevelMenu",
        new MultilevelMenu($.extend(opt, { holder: this }))
      );
    });
  };
})(jQuery);

// lazy Hover
function initLazyHover() {
  jQuery(".main-nav__drop--catalog .main-nav__drop-list").menuAim({
    activate: function (row) {
      var $row = $(row);
      $row.addClass("item-hover");
    },
    deactivate: function (row) {
      var $row = $(row);
      $row.removeClass("item-hover");
    },
    /*,
        exitMenu: function(menu){
            var $menu = $(menu);
            $menu.find('.item-hover').removeClass('item-hover');
        }*/
  });

  jQuery(
    ".main-nav__drop--catalog .main-nav__drop-list .main-nav__sub-item"
  ).menuAim({
    activate: function (row) {
      var $row = $(row);
      $row.addClass("item-hover-2");
    },
    deactivate: function (row) {
      var $row = $(row);
      $row.removeClass("item-hover-2");
    },
    /*,
        exitMenu: function(menu){
            var $menu = $(menu);
            $menu.find('.item-hover').removeClass('item-hover');
        }*/
  });

  jQuery(".main-nav__item--user-block .main-nav__drop-list").menuAim({
    activate: function (row) {
      var $row = $(row);
      $row.addClass("item-hover");
    },
    deactivate: function (row) {
      var $row = $(row);
      $row.removeClass("item-hover");
    },
    exitMenu: function (menu) {
      var $menu = $(menu);
      $menu.find(".item-hover").removeClass("item-hover");
    },
  });
}

// add classes if item has dropdown
function initDropDownClasses() {
  jQuery(".main-nav__drop.main-nav__drop--catalog li").each(function () {
    var item = jQuery(this);
    var drop = item.find("ul");
    var link = item.find("a").eq(0);
    if (drop.length) {
      item.addClass("has-drop-down");
      if (link.length) link.addClass("has-drop-down-a");
    }
  });
}

// jQuery aim
(function (e) {
  function t(t) {
    var n = e(this),
      r = null,
      i = [],
      s = null,
      o = null,
      u = e.extend(
        {
          rowSelector: "> li",
          submenuSelector: "*",
          submenuDirection: "right",
          tolerance: 75,
          enter: e.noop,
          exit: e.noop,
          activate: e.noop,
          deactivate: e.noop,
          exitMenu: e.noop,
        },
        t
      );
    var a = 3,
      f = 200;
    var l = function (e) {
      i.push({ x: e.pageX, y: e.pageY });
      if (i.length > a) {
        i.shift();
      }
    };
    var c = function () {
      if (o) {
        clearTimeout(o);
      }
      if (u.exitMenu(this)) {
        if (r) {
          u.deactivate(r);
        }
        r = null;
      }
    };
    var h = function () {
        if (o) {
          clearTimeout(o);
        }
        u.enter(this);
        m(this);
      },
      p = function () {
        u.exit(this);
      };
    var d = function () {
      v(this);
    };
    var v = function (e) {
      if (r) {
        u.deactivate(r);
      }
      u.activate(e);
      r = e;
    };
    var m = function (e) {
      var t = g();
      if (t) {
        o = setTimeout(function () {
          m(e);
        }, t);
      } else {
        v(e);
      }
    };
    var g = function () {
      function t(e, t) {
        return (t.y - e.y) / (t.x - e.x);
      }
      if (!r || !e(r).is(u.submenuSelector)) {
        return 0;
      }
      var o = n.offset(),
        a = { x: o.left, y: o.top - u.tolerance },
        l = { x: o.left + n.outerWidth(), y: a.y },
        c = { x: o.left, y: o.top + n.outerHeight() + u.tolerance },
        h = { x: o.left + n.outerWidth(), y: c.y },
        p = i[i.length - 1],
        d = i[0];
      if (!p) {
        return 0;
      }
      if (!d) {
        d = p;
      }
      if (d.x < o.left || d.x > h.x || d.y < o.top || d.y > h.y) {
        return 0;
      }
      if (s && p.x == s.x && p.y == s.y) {
        return 0;
      }
      var v = l,
        m = h;
      if (u.submenuDirection == "left") {
        v = c;
        m = a;
      } else if (u.submenuDirection == "below") {
        v = h;
        m = c;
      } else if (u.submenuDirection == "above") {
        v = a;
        m = l;
      }
      var g = t(p, v),
        y = t(p, m),
        b = t(d, v),
        w = t(d, m);
      if (g < b && y > w) {
        s = p;
        return f;
      }
      s = null;
      return 0;
    };
    n.mouseleave(c).find(u.rowSelector).mouseenter(h).mouseleave(p).click(d);
    e(document).mousemove(l);
  }
  e.fn.menuAim = function (e) {
    this.each(function () {
      t.call(this, e);
    });
    return this;
  };
})(jQuery);

// add classes on hover/touch
function initCustomHover() {
  jQuery(".main-nav__item").touchHover({ hoverClass: "hover" });
}

/*
 * Mobile hover plugin
 */
(function ($) {
  // detect device type
  var isTouchDevice =
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch),
    isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);

  // define events
  var eventOn =
      (isTouchDevice && "touchstart") ||
      (isWinPhoneDevice && navigator.pointerEnabled && "pointerdown") ||
      (isWinPhoneDevice && navigator.msPointerEnabled && "MSPointerDown") ||
      "mouseenter",
    eventOff =
      (isTouchDevice && "touchend") ||
      (isWinPhoneDevice && navigator.pointerEnabled && "pointerup") ||
      (isWinPhoneDevice && navigator.msPointerEnabled && "MSPointerUp") ||
      "mouseleave";

  // event handlers
  var toggleOn, toggleOff, preventHandler;
  if (isTouchDevice || isWinPhoneDevice) {
    // prevent click handler
    preventHandler = function (e) {
      e.preventDefault();
    };

    // touch device handlers
    toggleOn = function (e) {
      var options = e.data,
        element = $(this);

      var toggleOff = function (e) {
        var target = $(e.target);
        if (!target.is(element) && !target.closest(element).length) {
          element.removeClass(options.hoverClass);
          element.off("click", preventHandler);
          if (options.onLeave) options.onLeave(element);
          $(document).off(eventOn, toggleOff);
        }
      };

      if (!element.hasClass(options.hoverClass)) {
        element.addClass(options.hoverClass);
        element.one("click", preventHandler);
        $(document).on(eventOn, toggleOff);
        if (options.onHover) options.onHover(element);
      }
    };
  } else {
    // desktop browser handlers
    toggleOn = function (e) {
      var options = e.data,
        element = $(this);
      element.addClass(options.hoverClass);
      $(options.context).on(eventOff, options.selector, options, toggleOff);
      if (options.onHover) options.onHover(element);
    };
    toggleOff = function (e) {
      var options = e.data,
        element = $(this);
      element.removeClass(options.hoverClass);
      $(options.context).off(eventOff, options.selector, toggleOff);
      if (options.onLeave) options.onLeave(element);
    };
  }

  // jQuery plugin
  $.fn.touchHover = function (opt) {
    var options = $.extend(
      {
        context: this.context,
        selector: this.selector,
        hoverClass: "hover",
      },
      opt
    );

    $(this.context).on(eventOn, this.selector, options, toggleOn);
    return this;
  };
})(jQuery);

(function ($) {
  $.fn.sameHeight = function (opt) {
    var options = $.extend(
      {
        skipClass: "same-height-ignore",
        leftEdgeClass: "same-height-left",
        rightEdgeClass: "same-height-right",
        elements: ">*",
        flexible: false,
        multiLine: false,
        useMinHeight: false,
        biggestHeight: false,
      },
      opt
    );
    return this.each(function () {
      var holder = $(this),
        postResizeTimer,
        ignoreResize;
      var elements = holder.find(options.elements).not("." + options.skipClass);
      if (!elements.length) return;

      // resize handler
      function doResize() {
        elements.css(
          options.useMinHeight && supportMinHeight ? "minHeight" : "height",
          ""
        );
        if (options.multiLine) {
          // resize elements row by row
          resizeElementsByRows(elements, options);
        } else {
          // resize elements by holder
          resizeElements(elements, holder, options);
        }
      }
      doResize();

      // handle flexible layout / font resize
      var delayedResizeHandler = function () {
        if (!ignoreResize) {
          ignoreResize = true;
          doResize();
          clearTimeout(postResizeTimer);
          postResizeTimer = setTimeout(function () {
            doResize();
            setTimeout(function () {
              ignoreResize = false;
            }, 10);
          }, 100);
        }
      };

      // handle flexible/responsive layout
      if (options.flexible) {
        $(window).bind(
          "resize orientationchange fontresize",
          delayedResizeHandler
        );
      }

      // handle complete page load including images and fonts
      $(window).bind("load", delayedResizeHandler);
    });
  };

  // detect css min-height support
  var supportMinHeight =
    typeof document.documentElement.style.maxHeight !== "undefined";

  // get elements by rows
  function resizeElementsByRows(boxes, options) {
    var currentRow = $(),
      maxHeight,
      maxCalcHeight = 0,
      firstOffset = boxes.eq(0).offset().top;
    boxes.each(function (ind) {
      var curItem = $(this);
      if (curItem.offset().top === firstOffset) {
        currentRow = currentRow.add(this);
      } else {
        maxHeight = getMaxHeight(currentRow);
        maxCalcHeight = Math.max(
          maxCalcHeight,
          resizeElements(currentRow, maxHeight, options)
        );
        currentRow = curItem;
        firstOffset = curItem.offset().top;
      }
    });
    if (currentRow.length) {
      maxHeight = getMaxHeight(currentRow);
      maxCalcHeight = Math.max(
        maxCalcHeight,
        resizeElements(currentRow, maxHeight, options)
      );
    }
    if (options.biggestHeight) {
      boxes.css(
        options.useMinHeight && supportMinHeight ? "minHeight" : "height",
        maxCalcHeight
      );
    }
  }

  // calculate max element height
  function getMaxHeight(boxes) {
    var maxHeight = 0;
    boxes.each(function () {
      maxHeight = Math.max(maxHeight, $(this).outerHeight());
    });
    return maxHeight;
  }

  // resize helper function
  function resizeElements(boxes, parent, options) {
    var calcHeight;
    var parentHeight = typeof parent === "number" ? parent : parent.height();
    boxes
      .removeClass(options.leftEdgeClass)
      .removeClass(options.rightEdgeClass)
      .each(function (i) {
        var element = $(this);
        var depthDiffHeight = 0;
        var isBorderBox =
          element.css("boxSizing") === "border-box" ||
          element.css("-moz-box-sizing") === "border-box" ||
          element.css("-webkit-box-sizing") === "border-box";

        if (typeof parent !== "number") {
          element.parents().each(function () {
            var tmpParent = $(this);
            if (parent.is(this)) {
              return false;
            } else {
              depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
            }
          });
        }
        calcHeight = parentHeight - depthDiffHeight;
        calcHeight -= isBorderBox
          ? 0
          : element.outerHeight() - element.height();

        if (calcHeight > 0) {
          element.css(
            options.useMinHeight && supportMinHeight ? "minHeight" : "height",
            calcHeight
          );
        }
      });
    boxes.filter(":first").addClass(options.leftEdgeClass);
    boxes.filter(":last").addClass(options.rightEdgeClass);
    return calcHeight;
  }
})(jQuery);

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.2
 */
(function (root, factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    root.jcf = factory(jQuery);
  }
})(this, function ($) {
  "use strict";

  // define version
  var version = "1.1.2";

  // private variables
  var customInstances = [];

  // default global options
  var commonOptions = {
    optionsKey: "jcf",
    dataKey: "jcf-instance",
    rtlClass: "jcf-rtl",
    focusClass: "jcf-focus",
    pressedClass: "jcf-pressed",
    disabledClass: "jcf-disabled",
    hiddenClass: "jcf-hidden",
    resetAppearanceClass: "jcf-reset-appearance",
    unselectableClass: "jcf-unselectable",
  };

  // detect device type
  var isTouchDevice =
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch),
    isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
  commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

  // create global stylesheet if custom forms are used
  var createStyleSheet = function () {
    var styleTag = $("<style>").appendTo("head"),
      styleSheet = styleTag.prop("sheet") || styleTag.prop("styleSheet");

    // crossbrowser style handling
    var addCSSRule = function (selector, rules, index) {
      if (styleSheet.insertRule) {
        styleSheet.insertRule(selector + "{" + rules + "}", index);
      } else {
        styleSheet.addRule(selector, rules, index);
      }
    };

    // add special rules
    addCSSRule(
      "." + commonOptions.hiddenClass,
      "position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none"
    );
    addCSSRule(
      "." + commonOptions.rtlClass + " ." + commonOptions.hiddenClass,
      "right:-9999px !important; left: auto !important"
    );
    addCSSRule(
      "." + commonOptions.unselectableClass,
      "-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);"
    );
    addCSSRule(
      "." + commonOptions.resetAppearanceClass,
      "background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);"
    );

    // detect rtl pages
    var html = $("html"),
      body = $("body");
    if (html.css("direction") === "rtl" || body.css("direction") === "rtl") {
      html.addClass(commonOptions.rtlClass);
    }

    // handle form reset event
    html.on("reset", function () {
      setTimeout(function () {
        api.refreshAll();
      }, 0);
    });

    // mark stylesheet as created
    commonOptions.styleSheetCreated = true;
  };

  // simplified pointer events handler
  (function () {
    var pointerEventsSupported =
        navigator.pointerEnabled || navigator.msPointerEnabled,
      touchEventsSupported =
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch),
      eventList,
      eventMap = {},
      eventPrefix = "jcf-";

    // detect events to attach
    if (pointerEventsSupported) {
      eventList = {
        pointerover: navigator.pointerEnabled ? "pointerover" : "MSPointerOver",
        pointerdown: navigator.pointerEnabled ? "pointerdown" : "MSPointerDown",
        pointermove: navigator.pointerEnabled ? "pointermove" : "MSPointerMove",
        pointerup: navigator.pointerEnabled ? "pointerup" : "MSPointerUp",
      };
    } else {
      eventList = {
        pointerover: "mouseover",
        pointerdown: "mousedown" + (touchEventsSupported ? " touchstart" : ""),
        pointermove: "mousemove" + (touchEventsSupported ? " touchmove" : ""),
        pointerup: "mouseup" + (touchEventsSupported ? " touchend" : ""),
      };
    }

    // create event map
    $.each(eventList, function (targetEventName, fakeEventList) {
      $.each(fakeEventList.split(" "), function (index, fakeEventName) {
        eventMap[fakeEventName] = targetEventName;
      });
    });

    // jQuery event hooks
    $.each(eventList, function (eventName, eventHandlers) {
      eventHandlers = eventHandlers.split(" ");
      $.event.special[eventPrefix + eventName] = {
        setup: function () {
          var self = this;
          $.each(eventHandlers, function (index, fallbackEvent) {
            if (self.addEventListener)
              self.addEventListener(fallbackEvent, fixEvent, false);
            else self["on" + fallbackEvent] = fixEvent;
          });
        },
        teardown: function () {
          var self = this;
          $.each(eventHandlers, function (index, fallbackEvent) {
            if (self.addEventListener)
              self.removeEventListener(fallbackEvent, fixEvent, false);
            else self["on" + fallbackEvent] = null;
          });
        },
      };
    });

    // check that mouse event are not simulated by mobile browsers
    var lastTouch = null;
    var mouseEventSimulated = function (e) {
      var dx = Math.abs(e.pageX - lastTouch.x),
        dy = Math.abs(e.pageY - lastTouch.y),
        rangeDistance = 25;

      if (dx <= rangeDistance && dy <= rangeDistance) {
        return true;
      }
    };

    // normalize event
    var fixEvent = function (e) {
      var origEvent = e || window.event,
        touchEventData = null,
        targetEventName = eventMap[origEvent.type];

      e = $.event.fix(origEvent);
      e.type = eventPrefix + targetEventName;

      if (origEvent.pointerType) {
        switch (origEvent.pointerType) {
          case 2:
            e.pointerType = "touch";
            break;
          case 3:
            e.pointerType = "pen";
            break;
          case 4:
            e.pointerType = "mouse";
            break;
          default:
            e.pointerType = origEvent.pointerType;
        }
      } else {
        e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
      }

      if (!e.pageX && !e.pageY) {
        touchEventData = origEvent.changedTouches
          ? origEvent.changedTouches[0]
          : origEvent;
        e.pageX = touchEventData.pageX;
        e.pageY = touchEventData.pageY;
      }

      if (origEvent.type === "touchend") {
        lastTouch = { x: e.pageX, y: e.pageY };
      }
      if (e.pointerType === "mouse" && lastTouch && mouseEventSimulated(e)) {
        return;
      } else {
        return ($.event.dispatch || $.event.handle).call(this, e);
      }
    };
  })();

  // custom mousewheel/trackpad handler
  (function () {
    var wheelEvents = ("onwheel" in document || document.documentMode >= 9
        ? "wheel"
        : "mousewheel DOMMouseScroll"
      ).split(" "),
      shimEventName = "jcf-mousewheel";

    $.event.special[shimEventName] = {
      setup: function () {
        var self = this;
        $.each(wheelEvents, function (index, fallbackEvent) {
          if (self.addEventListener)
            self.addEventListener(fallbackEvent, fixEvent, false);
          else self["on" + fallbackEvent] = fixEvent;
        });
      },
      teardown: function () {
        var self = this;
        $.each(wheelEvents, function (index, fallbackEvent) {
          if (self.addEventListener)
            self.removeEventListener(fallbackEvent, fixEvent, false);
          else self["on" + fallbackEvent] = null;
        });
      },
    };

    var fixEvent = function (e) {
      var origEvent = e || window.event;
      e = $.event.fix(origEvent);
      e.type = shimEventName;

      // old wheel events handler
      if ("detail" in origEvent) {
        e.deltaY = -origEvent.detail;
      }
      if ("wheelDelta" in origEvent) {
        e.deltaY = -origEvent.wheelDelta;
      }
      if ("wheelDeltaY" in origEvent) {
        e.deltaY = -origEvent.wheelDeltaY;
      }
      if ("wheelDeltaX" in origEvent) {
        e.deltaX = -origEvent.wheelDeltaX;
      }

      // modern wheel event handler
      if ("deltaY" in origEvent) {
        e.deltaY = origEvent.deltaY;
      }
      if ("deltaX" in origEvent) {
        e.deltaX = origEvent.deltaX;
      }

      // handle deltaMode for mouse wheel
      e.delta = e.deltaY || e.deltaX;
      if (origEvent.deltaMode === 1) {
        var lineHeight = 16;
        e.delta *= lineHeight;
        e.deltaY *= lineHeight;
        e.deltaX *= lineHeight;
      }

      return ($.event.dispatch || $.event.handle).call(this, e);
    };
  })();

  // extra module methods
  var moduleMixin = {
    // provide function for firing native events
    fireNativeEvent: function (elements, eventName) {
      $(elements).each(function () {
        var element = this,
          eventObject;
        if (element.dispatchEvent) {
          eventObject = document.createEvent("HTMLEvents");
          eventObject.initEvent(eventName, true, true);
          element.dispatchEvent(eventObject);
        } else if (document.createEventObject) {
          eventObject = document.createEventObject();
          eventObject.target = element;
          element.fireEvent("on" + eventName, eventObject);
        }
      });
    },
    // bind event handlers for module instance (functions beggining with "on")
    bindHandlers: function () {
      var self = this;
      $.each(self, function (propName, propValue) {
        if (propName.indexOf("on") === 0 && $.isFunction(propValue)) {
          // dont use $.proxy here because it doesn't create unique handler
          self[propName] = function () {
            return propValue.apply(self, arguments);
          };
        }
      });
    },
  };

  // public API
  var api = {
    version: version,
    modules: {},
    getOptions: function () {
      return $.extend({}, commonOptions);
    },
    setOptions: function (moduleName, moduleOptions) {
      if (arguments.length > 1) {
        // set module options
        if (this.modules[moduleName]) {
          $.extend(this.modules[moduleName].prototype.options, moduleOptions);
        }
      } else {
        // set common options
        $.extend(commonOptions, moduleName);
      }
    },
    addModule: function (proto) {
      // add module to list
      var Module = function (options) {
        // save instance to collection
        if (!options.element.data(commonOptions.dataKey)) {
          options.element.data(commonOptions.dataKey, this);
        }
        customInstances.push(this);

        // save options
        this.options = $.extend(
          {},
          commonOptions,
          this.options,
          getInlineOptions(options.element),
          options
        );

        // bind event handlers to instance
        this.bindHandlers();

        // call constructor
        this.init.apply(this, arguments);
      };

      // parse options from HTML attribute
      var getInlineOptions = function (element) {
        var dataOptions = element.data(commonOptions.optionsKey),
          attrOptions = element.attr(commonOptions.optionsKey);

        if (dataOptions) {
          return dataOptions;
        } else if (attrOptions) {
          try {
            return $.parseJSON(attrOptions);
          } catch (e) {
            // ignore invalid attributes
          }
        }
      };

      // set proto as prototype for new module
      Module.prototype = proto;

      // add mixin methods to module proto
      $.extend(proto, moduleMixin);
      if (proto.plugins) {
        $.each(proto.plugins, function (pluginName, plugin) {
          $.extend(plugin.prototype, moduleMixin);
        });
      }

      // override destroy method
      var originalDestroy = Module.prototype.destroy;
      Module.prototype.destroy = function () {
        this.options.element.removeData(this.options.dataKey);

        for (var i = customInstances.length - 1; i >= 0; i--) {
          if (customInstances[i] === this) {
            customInstances.splice(i, 1);
            break;
          }
        }

        if (originalDestroy) {
          originalDestroy.apply(this, arguments);
        }
      };

      // save module to list
      this.modules[proto.name] = Module;
    },
    getInstance: function (element) {
      return $(element).data(commonOptions.dataKey);
    },
    replace: function (elements, moduleName, customOptions) {
      var self = this,
        instance;

      if (!commonOptions.styleSheetCreated) {
        createStyleSheet();
      }

      $(elements).each(function () {
        var moduleOptions,
          element = $(this);

        instance = element.data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        } else {
          if (!moduleName) {
            $.each(self.modules, function (currentModuleName, module) {
              if (
                module.prototype.matchElement.call(module.prototype, element)
              ) {
                moduleName = currentModuleName;
                return false;
              }
            });
          }
          if (moduleName) {
            moduleOptions = $.extend({ element: element }, customOptions);
            instance = new self.modules[moduleName](moduleOptions);
          }
        }
      });
      return instance;
    },
    refresh: function (elements) {
      $(elements).each(function () {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        }
      });
    },
    destroy: function (elements) {
      $(elements).each(function () {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.destroy();
        }
      });
    },
    replaceAll: function (context) {
      var self = this;
      $.each(this.modules, function (moduleName, module) {
        $(module.prototype.selector, context).each(function () {
          if (this.className.indexOf("jcf-ignore") < 0) {
            self.replace(this, moduleName);
          }
        });
      });
    },
    refreshAll: function (context) {
      if (context) {
        $.each(this.modules, function (moduleName, module) {
          $(module.prototype.selector, context).each(function () {
            var instance = $(this).data(commonOptions.dataKey);
            if (instance) {
              instance.refresh();
            }
          });
        });
      } else {
        for (var i = customInstances.length - 1; i >= 0; i--) {
          customInstances[i].refresh();
        }
      }
    },
    destroyAll: function (context) {
      if (context) {
        $.each(this.modules, function (moduleName, module) {
          $(module.prototype.selector, context).each(function (index, element) {
            var instance = $(element).data(commonOptions.dataKey);
            if (instance) {
              instance.destroy();
            }
          });
        });
      } else {
        while (customInstances.length) {
          customInstances[0].destroy();
        }
      }
    },
  };

  return api;
});

/*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.2
 */
(function ($, window) {
  "use strict";

  jcf.addModule({
    name: "Select",
    selector: "select",
    options: {
      element: null,
      multipleCompactStyle: false,
    },
    plugins: {
      ListBox: ListBox,
      ComboBox: ComboBox,
      SelectList: SelectList,
    },
    matchElement: function (element) {
      return element.is("select");
    },
    init: function () {
      this.element = $(this.options.element);
      this.createInstance();
    },
    isListBox: function () {
      return this.element.is("[size]:not([jcf-size]), [multiple]");
    },
    createInstance: function () {
      if (this.instance) {
        this.instance.destroy();
      }
      if (this.isListBox() && !this.options.multipleCompactStyle) {
        this.instance = new ListBox(this.options);
      } else {
        this.instance = new ComboBox(this.options);
      }
    },
    refresh: function () {
      var typeMismatch =
        (this.isListBox() && this.instance instanceof ComboBox) ||
        (!this.isListBox() && this.instance instanceof ListBox);

      if (typeMismatch) {
        this.createInstance();
      } else {
        this.instance.refresh();
      }
    },
    destroy: function () {
      this.instance.destroy();
    },
  });

  // combobox module
  function ComboBox(options) {
    this.options = $.extend(
      {
        wrapNative: true,
        wrapNativeOnMobile: true,
        fakeDropInBody: true,
        useCustomScroll: true,
        flipDropToFit: true,
        maxVisibleItems: 10,
        fakeAreaStructure:
          '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
        fakeDropStructure:
          '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
        optionClassPrefix: "jcf-option-",
        selectClassPrefix: "jcf-select-",
        dropContentSelector: ".jcf-select-drop-content",
        selectTextSelector: ".jcf-select-text",
        dropActiveClass: "jcf-drop-active",
        flipDropClass: "jcf-drop-flipped",
      },
      options
    );
    this.init();
  }
  $.extend(ComboBox.prototype, {
    init: function () {
      this.initStructure();
      this.bindHandlers();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function () {
      // prepare structure
      this.win = $(window);
      this.doc = $(document);
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(
        this.realElement
      );
      this.selectTextContainer = this.fakeElement.find(
        this.options.selectTextSelector
      );
      this.selectText = $("<span></span>").appendTo(this.selectTextContainer);
      makeUnselectable(this.fakeElement);

      // copy classes from original select
      this.fakeElement.addClass(
        getPrefixedClasses(
          this.realElement.prop("className"),
          this.options.selectClassPrefix
        )
      );

      // handle compact multiple style
      if (this.realElement.prop("multiple")) {
        this.fakeElement.addClass("jcf-compact-multiple");
      }

      // detect device type and dropdown behavior
      if (
        this.options.isMobileDevice &&
        this.options.wrapNativeOnMobile &&
        !this.options.wrapNative
      ) {
        this.options.wrapNative = true;
      }

      if (this.options.wrapNative) {
        // wrap native select inside fake block
        this.realElement
          .prependTo(this.fakeElement)
          .css({
            position: "absolute",
            height: "100%",
            width: "100%",
          })
          .addClass(this.options.resetAppearanceClass);
      } else {
        // just hide native select
        this.realElement.addClass(this.options.hiddenClass);
        this.fakeElement.attr("title", this.realElement.attr("title"));
        this.fakeDropTarget = this.options.fakeDropInBody
          ? $("body")
          : this.fakeElement;
      }
    },
    attachEvents: function () {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function () {
        setTimeout(function () {
          self.refresh();
          if (self.list) {
            self.list.refresh();
          }
        }, 1);
      };

      // native dropdown event handlers
      if (this.options.wrapNative) {
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          click: this.onChange,
          keydown: this.onChange,
        });
      } else {
        // custom dropdown event handlers
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          keydown: this.onKeyDown,
        });
        this.fakeElement.on({
          "jcf-pointerdown": this.onSelectAreaPress,
        });
      }
    },
    onKeyDown: function (e) {
      if (e.which === 13) {
        this.toggleDropdown();
      } else if (this.dropActive) {
        this.delayedRefresh();
      }
    },
    onChange: function () {
      this.refresh();
    },
    onFocus: function () {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on("blur", this.onBlur);
        this.toggleListMode(true);
        this.focusedFlag = true;
      }
    },
    onBlur: function () {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off("blur", this.onBlur);
        this.toggleListMode(false);
        this.focusedFlag = false;
      }
    },
    onResize: function () {
      if (this.dropActive) {
        this.hideDropdown();
      }
    },
    onSelectDropPress: function () {
      this.pressedFlag = true;
    },
    onSelectDropRelease: function (e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === "mouse") {
        this.realElement.focus();
      }
    },
    onSelectAreaPress: function (e) {
      // skip click if drop inside fake element or real select is disabled
      var dropClickedInsideFakeElement =
        !this.options.fakeDropInBody &&
        $(e.target).closest(this.dropdown).length;
      if (
        dropClickedInsideFakeElement ||
        e.button > 1 ||
        this.realElement.is(":disabled")
      ) {
        return;
      }

      // toggle dropdown visibility
      this.selectOpenedByEvent = e.pointerType;
      this.toggleDropdown();

      // misc handlers
      if (!this.focusedFlag) {
        if (e.pointerType === "mouse") {
          this.realElement.focus();
        } else {
          this.onFocus(e);
        }
      }
      this.pressedFlag = true;
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on("jcf-pointerup", this.onSelectAreaRelease);
    },
    onSelectAreaRelease: function (e) {
      if (this.focusedFlag && e.pointerType === "mouse") {
        this.realElement.focus();
      }
      this.pressedFlag = false;
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off("jcf-pointerup", this.onSelectAreaRelease);
    },
    onOutsideClick: function (e) {
      var target = $(e.target),
        clickedInsideSelect =
          target.closest(this.fakeElement).length ||
          target.closest(this.dropdown).length;

      if (!clickedInsideSelect) {
        this.hideDropdown();
      }
    },
    onSelect: function () {
      this.refresh();

      if (this.realElement.prop("multiple")) {
        this.repositionDropdown();
      } else {
        this.hideDropdown();
      }

      this.fireNativeEvent(this.realElement, "change");
    },
    toggleListMode: function (state) {
      if (!this.options.wrapNative) {
        if (state) {
          // temporary change select to list to avoid appearing of native dropdown
          this.realElement.attr({
            size: 4,
            "jcf-size": "",
          });
        } else {
          // restore select from list mode to dropdown select
          if (!this.options.wrapNative) {
            this.realElement.removeAttr("size jcf-size");
          }
        }
      }
    },
    createDropdown: function () {
      // destroy previous dropdown if needed
      if (this.dropdown) {
        this.list.destroy();
        this.dropdown.remove();
      }

      // create new drop container
      this.dropdown = $(this.options.fakeDropStructure).appendTo(
        this.fakeDropTarget
      );
      this.dropdown.addClass(
        getPrefixedClasses(
          this.realElement.prop("className"),
          this.options.selectClassPrefix
        )
      );
      makeUnselectable(this.dropdown);

      // handle compact multiple style
      if (this.realElement.prop("multiple")) {
        this.dropdown.addClass("jcf-compact-multiple");
      }

      // set initial styles for dropdown in body
      if (this.options.fakeDropInBody) {
        this.dropdown.css({
          position: "absolute",
          top: -9999,
        });
      }

      // create new select list instance
      this.list = new SelectList({
        useHoverClass: true,
        handleResize: false,
        alwaysPreventMouseWheel: true,
        maxVisibleItems: this.options.maxVisibleItems,
        useCustomScroll: this.options.useCustomScroll,
        holder: this.dropdown.find(this.options.dropContentSelector),
        multipleSelectWithoutKey: this.realElement.prop("multiple"),
        element: this.realElement,
      });
      $(this.list).on({
        select: this.onSelect,
        press: this.onSelectDropPress,
        release: this.onSelectDropRelease,
      });
    },
    repositionDropdown: function () {
      var selectOffset = this.fakeElement.offset(),
        selectWidth = this.fakeElement.outerWidth(),
        selectHeight = this.fakeElement.outerHeight(),
        dropHeight = this.dropdown.css("width", selectWidth).outerHeight(),
        winScrollTop = this.win.scrollTop(),
        winHeight = this.win.height(),
        calcTop,
        calcLeft,
        bodyOffset,
        needFlipDrop = false;

      // check flip drop position
      if (
        selectOffset.top + selectHeight + dropHeight >
          winScrollTop + winHeight &&
        selectOffset.top - dropHeight > winScrollTop
      ) {
        needFlipDrop = true;
      }

      if (this.options.fakeDropInBody) {
        bodyOffset =
          this.fakeDropTarget.css("position") !== "static"
            ? this.fakeDropTarget.offset().top
            : 0;
        if (this.options.flipDropToFit && needFlipDrop) {
          // calculate flipped dropdown position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top - dropHeight - bodyOffset;
        } else {
          // calculate default drop position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top + selectHeight - bodyOffset;
        }

        // update drop styles
        this.dropdown.css({
          width: selectWidth,
          left: calcLeft,
          top: calcTop,
        });
      }

      // refresh flipped class
      this.dropdown
        .add(this.fakeElement)
        .toggleClass(
          this.options.flipDropClass,
          this.options.flipDropToFit && needFlipDrop
        );
    },
    showDropdown: function () {
      // do not show empty custom dropdown
      if (!this.realElement.prop("options").length) {
        return;
      }

      // create options list if not created
      if (!this.dropdown) {
        this.createDropdown();
      }

      // show dropdown
      this.dropActive = true;
      this.dropdown.appendTo(this.fakeDropTarget);
      this.fakeElement.addClass(this.options.dropActiveClass);
      this.refreshSelectedText();
      this.repositionDropdown();
      this.list.setScrollTop(this.savedScrollTop);
      this.list.refresh();

      // add temporary event handlers
      this.win.on("resize", this.onResize);
      this.doc.on("jcf-pointerdown", this.onOutsideClick);
    },
    hideDropdown: function () {
      if (this.dropdown) {
        this.savedScrollTop = this.list.getScrollTop();
        this.fakeElement.removeClass(
          this.options.dropActiveClass + " " + this.options.flipDropClass
        );
        this.dropdown.removeClass(this.options.flipDropClass).detach();
        this.doc.off("jcf-pointerdown", this.onOutsideClick);
        this.win.off("resize", this.onResize);
        this.dropActive = false;
        if (this.selectOpenedByEvent === "touch") {
          this.onBlur();
        }
      }
    },
    toggleDropdown: function () {
      if (this.dropActive) {
        this.hideDropdown();
      } else {
        this.showDropdown();
      }
    },
    refreshSelectedText: function () {
      // redraw selected area
      var selectedIndex = this.realElement.prop("selectedIndex"),
        selectedOption = this.realElement.prop("options")[selectedIndex],
        selectedOptionImage = selectedOption
          ? selectedOption.getAttribute("data-image")
          : null,
        selectedOptionText = "",
        selectedOptionClasses;

      if (this.realElement.prop("multiple")) {
        $.each(this.realElement.prop("options"), function (index, option) {
          if (option.selected) {
            selectedOptionText +=
              (selectedOptionText ? ", " : "") + option.innerHTML;
          }
        });
        this.selectText.removeAttr("class").html(selectedOptionText);
      } else if (!selectedOption) {
        if (this.selectImage) {
          this.selectImage.hide();
        }
        this.selectText.removeAttr("class").empty();
      } else if (
        this.currentSelectedText !== selectedOption.innerHTML ||
        this.currentSelectedImage !== selectedOptionImage
      ) {
        selectedOptionClasses = getPrefixedClasses(
          selectedOption.className,
          this.options.optionClassPrefix
        );
        this.selectText
          .attr("class", selectedOptionClasses)
          .html(selectedOption.innerHTML);

        if (selectedOptionImage) {
          if (!this.selectImage) {
            this.selectImage = $("<img>")
              .prependTo(this.selectTextContainer)
              .hide();
          }
          this.selectImage.attr("src", selectedOptionImage).show();
        } else if (this.selectImage) {
          this.selectImage.hide();
        }

        this.currentSelectedText = selectedOption.innerHTML;
        this.currentSelectedImage = selectedOptionImage;
      }
    },
    refresh: function () {
      // refresh fake select visibility
      if (this.realElement.prop("style").display === "none") {
        this.fakeElement.hide();
      } else {
        this.fakeElement.show();
      }

      // refresh selected text
      this.refreshSelectedText();

      // handle disabled state
      this.fakeElement.toggleClass(
        this.options.disabledClass,
        this.realElement.is(":disabled")
      );
    },
    destroy: function () {
      // restore structure
      if (this.options.wrapNative) {
        this.realElement
          .insertBefore(this.fakeElement)
          .css({
            position: "",
            height: "",
            width: "",
          })
          .removeClass(this.options.resetAppearanceClass);
      } else {
        this.realElement.removeClass(this.options.hiddenClass);
        if (this.realElement.is("[jcf-size]")) {
          this.realElement.removeAttr("size jcf-size");
        }
      }

      // removing element will also remove its event handlers
      this.fakeElement.remove();

      // remove other event handlers
      this.doc.off("jcf-pointerup", this.onSelectAreaRelease);
      this.realElement.off({
        focus: this.onFocus,
      });
    },
  });

  // listbox module
  function ListBox(options) {
    this.options = $.extend(
      {
        wrapNative: true,
        useCustomScroll: true,
        fakeStructure:
          '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
        selectClassPrefix: "jcf-select-",
        listHolder: ".jcf-list-wrapper",
      },
      options
    );
    this.init();
  }
  $.extend(ListBox.prototype, {
    init: function () {
      this.bindHandlers();
      this.initStructure();
      this.attachEvents();
    },
    initStructure: function () {
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeStructure).insertAfter(
        this.realElement
      );
      this.listHolder = this.fakeElement.find(this.options.listHolder);
      makeUnselectable(this.fakeElement);

      // copy classes from original select
      this.fakeElement.addClass(
        getPrefixedClasses(
          this.realElement.prop("className"),
          this.options.selectClassPrefix
        )
      );
      this.realElement.addClass(this.options.hiddenClass);

      this.list = new SelectList({
        useCustomScroll: this.options.useCustomScroll,
        holder: this.listHolder,
        selectOnClick: false,
        element: this.realElement,
      });
    },
    attachEvents: function () {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function (e) {
        if (e && e.which === 16) {
          // ignore SHIFT key
          return;
        } else {
          clearTimeout(self.refreshTimer);
          self.refreshTimer = setTimeout(function () {
            self.refresh();
          }, 1);
        }
      };

      // other event handlers
      this.realElement.on({
        focus: this.onFocus,
        click: this.delayedRefresh,
        keydown: this.delayedRefresh,
      });

      // select list event handlers
      $(this.list).on({
        select: this.onSelect,
        press: this.onFakeOptionsPress,
        release: this.onFakeOptionsRelease,
      });
    },
    onFakeOptionsPress: function (e, pointerEvent) {
      this.pressedFlag = true;
      if (pointerEvent.pointerType === "mouse") {
        this.realElement.focus();
      }
    },
    onFakeOptionsRelease: function (e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === "mouse") {
        this.realElement.focus();
      }
    },
    onSelect: function () {
      this.fireNativeEvent(this.realElement, "change");
      this.fireNativeEvent(this.realElement, "click");
    },
    onFocus: function () {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on("blur", this.onBlur);
        this.focusedFlag = true;
      }
    },
    onBlur: function () {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off("blur", this.onBlur);
        this.focusedFlag = false;
      }
    },
    refresh: function () {
      this.fakeElement.toggleClass(
        this.options.disabledClass,
        this.realElement.is(":disabled")
      );
      this.list.refresh();
    },
    destroy: function () {
      this.list.destroy();
      this.realElement
        .insertBefore(this.fakeElement)
        .removeClass(this.options.hiddenClass);
      this.fakeElement.remove();
    },
  });

  // options list module
  function SelectList(options) {
    this.options = $.extend(
      {
        holder: null,
        maxVisibleItems: 10,
        selectOnClick: true,
        useHoverClass: false,
        useCustomScroll: false,
        handleResize: true,
        multipleSelectWithoutKey: false,
        alwaysPreventMouseWheel: false,
        indexAttribute: "data-index",
        cloneClassPrefix: "jcf-option-",
        containerStructure:
          '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
        containerSelector: ".jcf-list-content",
        captionClass: "jcf-optgroup-caption",
        disabledClass: "jcf-disabled",
        optionClass: "jcf-option",
        groupClass: "jcf-optgroup",
        hoverClass: "jcf-hover",
        selectedClass: "jcf-selected",
        scrollClass: "jcf-scroll-active",
      },
      options
    );
    this.init();
  }
  $.extend(SelectList.prototype, {
    init: function () {
      this.initStructure();
      this.refreshSelectedClass();
      this.attachEvents();
    },
    initStructure: function () {
      this.element = $(this.options.element);
      this.indexSelector = "[" + this.options.indexAttribute + "]";
      this.container = $(this.options.containerStructure).appendTo(
        this.options.holder
      );
      this.listHolder = this.container.find(this.options.containerSelector);
      this.lastClickedIndex = this.element.prop("selectedIndex");
      this.rebuildList();
    },
    attachEvents: function () {
      this.bindHandlers();
      this.listHolder.on(
        "jcf-pointerdown",
        this.indexSelector,
        this.onItemPress
      );
      this.listHolder.on("jcf-pointerdown", this.onPress);

      if (this.options.useHoverClass) {
        this.listHolder.on(
          "jcf-pointerover",
          this.indexSelector,
          this.onHoverItem
        );
      }
    },
    onPress: function (e) {
      $(this).trigger("press", e);
      this.listHolder.on("jcf-pointerup", this.onRelease);
    },
    onRelease: function (e) {
      $(this).trigger("release", e);
      this.listHolder.off("jcf-pointerup", this.onRelease);
    },
    onHoverItem: function (e) {
      var hoverIndex = parseFloat(
        e.currentTarget.getAttribute(this.options.indexAttribute)
      );
      this.fakeOptions
        .removeClass(this.options.hoverClass)
        .eq(hoverIndex)
        .addClass(this.options.hoverClass);
    },
    onItemPress: function (e) {
      if (e.pointerType === "touch" || this.options.selectOnClick) {
        // select option after "click"
        this.tmpListOffsetTop = this.list.offset().top;
        this.listHolder.on(
          "jcf-pointerup",
          this.indexSelector,
          this.onItemRelease
        );
      } else {
        // select option immediately
        this.onSelectItem(e);
      }
    },
    onItemRelease: function (e) {
      // remove event handlers and temporary data
      this.listHolder.off(
        "jcf-pointerup",
        this.indexSelector,
        this.onItemRelease
      );

      // simulate item selection
      if (this.tmpListOffsetTop === this.list.offset().top) {
        this.listHolder.on(
          "click",
          this.indexSelector,
          { savedPointerType: e.pointerType },
          this.onSelectItem
        );
      }
      delete this.tmpListOffsetTop;
    },
    onSelectItem: function (e) {
      var clickedIndex = parseFloat(
          e.currentTarget.getAttribute(this.options.indexAttribute)
        ),
        pointerType =
          (e.data && e.data.savedPointerType) || e.pointerType || "mouse",
        range;

      // remove click event handler
      this.listHolder.off("click", this.indexSelector, this.onSelectItem);

      // ignore clicks on disabled options
      if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
        return;
      }

      if (this.element.prop("multiple")) {
        if (
          e.metaKey ||
          e.ctrlKey ||
          pointerType === "touch" ||
          this.options.multipleSelectWithoutKey
        ) {
          // if CTRL/CMD pressed or touch devices - toggle selected option
          this.realOptions[clickedIndex].selected = !this.realOptions[
            clickedIndex
          ].selected;
        } else if (e.shiftKey) {
          // if SHIFT pressed - update selection
          range = [this.lastClickedIndex, clickedIndex].sort(function (a, b) {
            return a - b;
          });
          this.realOptions.each(function (index, option) {
            option.selected = index >= range[0] && index <= range[1];
          });
        } else {
          // set single selected index
          this.element.prop("selectedIndex", clickedIndex);
        }
      } else {
        this.element.prop("selectedIndex", clickedIndex);
      }

      // save last clicked option
      if (!e.shiftKey) {
        this.lastClickedIndex = clickedIndex;
      }

      // refresh classes
      this.refreshSelectedClass();

      // scroll to active item in desktop browsers
      if (pointerType === "mouse") {
        this.scrollToActiveOption();
      }

      // make callback when item selected
      $(this).trigger("select");
    },
    rebuildList: function () {
      // rebuild options
      var self = this,
        rootElement = this.element[0];

      // recursively create fake options
      this.storedSelectHTML = rootElement.innerHTML;
      this.optionIndex = 0;
      this.list = $(this.createOptionsList(rootElement));
      this.listHolder.empty().append(this.list);
      this.realOptions = this.element.find("option");
      this.fakeOptions = this.list.find(this.indexSelector);
      this.fakeListItems = this.list.find(
        "." + this.options.captionClass + "," + this.indexSelector
      );
      delete this.optionIndex;

      // detect max visible items
      var maxCount = this.options.maxVisibleItems,
        sizeValue = this.element.prop("size");
      if (sizeValue > 1 && !this.element.is("[jcf-size]")) {
        maxCount = sizeValue;
      }

      // handle scrollbar
      var needScrollBar = this.fakeOptions.length > maxCount;
      this.container.toggleClass(this.options.scrollClass, needScrollBar);
      if (needScrollBar) {
        // change max-height
        this.listHolder.css({
          maxHeight: this.getOverflowHeight(maxCount),
          overflow: "auto",
        });

        if (this.options.useCustomScroll && jcf.modules.Scrollable) {
          // add custom scrollbar if specified in options
          jcf.replace(this.listHolder, "Scrollable", {
            handleResize: this.options.handleResize,
            alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel,
          });
          return;
        }
      }

      // disable edge wheel scrolling
      if (this.options.alwaysPreventMouseWheel) {
        this.preventWheelHandler = function (e) {
          var currentScrollTop = self.listHolder.scrollTop(),
            maxScrollTop =
              self.listHolder.prop("scrollHeight") -
              self.listHolder.innerHeight();

          // check edge cases
          if (
            (currentScrollTop <= 0 && e.deltaY < 0) ||
            (currentScrollTop >= maxScrollTop && e.deltaY > 0)
          ) {
            e.preventDefault();
          }
        };
        this.listHolder.on("jcf-mousewheel", this.preventWheelHandler);
      }
    },
    refreshSelectedClass: function () {
      var self = this,
        selectedItem,
        isMultiple = this.element.prop("multiple"),
        selectedIndex = this.element.prop("selectedIndex");

      if (isMultiple) {
        this.realOptions.each(function (index, option) {
          self.fakeOptions
            .eq(index)
            .toggleClass(self.options.selectedClass, !!option.selected);
        });
      } else {
        this.fakeOptions.removeClass(
          this.options.selectedClass + " " + this.options.hoverClass
        );
        selectedItem = this.fakeOptions
          .eq(selectedIndex)
          .addClass(this.options.selectedClass);
        if (this.options.useHoverClass) {
          selectedItem.addClass(this.options.hoverClass);
        }
      }
    },
    scrollToActiveOption: function () {
      // scroll to target option
      var targetOffset = this.getActiveOptionOffset();
      this.listHolder.prop("scrollTop", targetOffset);
    },
    getSelectedIndexRange: function () {
      var firstSelected = -1,
        lastSelected = -1;
      this.realOptions.each(function (index, option) {
        if (option.selected) {
          if (firstSelected < 0) {
            firstSelected = index;
          }
          lastSelected = index;
        }
      });
      return [firstSelected, lastSelected];
    },
    getChangedSelectedIndex: function () {
      var selectedIndex = this.element.prop("selectedIndex"),
        targetIndex;

      if (this.element.prop("multiple")) {
        // multiple selects handling
        if (!this.previousRange) {
          this.previousRange = [selectedIndex, selectedIndex];
        }
        this.currentRange = this.getSelectedIndexRange();
        targetIndex = this.currentRange[
          this.currentRange[0] !== this.previousRange[0] ? 0 : 1
        ];
        this.previousRange = this.currentRange;
        return targetIndex;
      } else {
        // single choice selects handling
        return selectedIndex;
      }
    },
    getActiveOptionOffset: function () {
      // calc values
      var dropHeight = this.listHolder.height(),
        dropScrollTop = this.listHolder.prop("scrollTop"),
        currentIndex = this.getChangedSelectedIndex(),
        fakeOption = this.fakeOptions.eq(currentIndex),
        fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
        fakeOptionHeight = fakeOption.innerHeight();

      // scroll list
      if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
        // scroll down (always scroll to option)
        return fakeOptionOffset - dropHeight + fakeOptionHeight;
      } else if (fakeOptionOffset < dropScrollTop) {
        // scroll up to option
        return fakeOptionOffset;
      }
    },
    getOverflowHeight: function (sizeValue) {
      var item = this.fakeListItems.eq(sizeValue - 1),
        listOffset = this.list.offset().top,
        itemOffset = item.offset().top,
        itemHeight = item.innerHeight();

      return itemOffset + itemHeight - listOffset;
    },
    getScrollTop: function () {
      return this.listHolder.scrollTop();
    },
    setScrollTop: function (value) {
      this.listHolder.scrollTop(value);
    },
    createOption: function (option) {
      var newOption = document.createElement("span");
      newOption.className = this.options.optionClass;
      newOption.innerHTML = option.innerHTML;
      newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

      var optionImage,
        optionImageSrc = option.getAttribute("data-image");
      if (optionImageSrc) {
        optionImage = document.createElement("img");
        optionImage.src = optionImageSrc;
        newOption.insertBefore(optionImage, newOption.childNodes[0]);
      }
      if (option.disabled) {
        newOption.className += " " + this.options.disabledClass;
      }
      if (option.className) {
        newOption.className +=
          " " +
          getPrefixedClasses(option.className, this.options.cloneClassPrefix);
      }
      return newOption;
    },
    createOptGroup: function (optgroup) {
      var optGroupContainer = document.createElement("span"),
        optGroupName = optgroup.getAttribute("label"),
        optGroupCaption,
        optGroupList;

      // create caption
      optGroupCaption = document.createElement("span");
      optGroupCaption.className = this.options.captionClass;
      optGroupCaption.innerHTML = optGroupName;
      optGroupContainer.appendChild(optGroupCaption);

      // create list of options
      if (optgroup.children.length) {
        optGroupList = this.createOptionsList(optgroup);
        optGroupContainer.appendChild(optGroupList);
      }

      optGroupContainer.className = this.options.groupClass;
      return optGroupContainer;
    },
    createOptionContainer: function () {
      var optionContainer = document.createElement("li");
      return optionContainer;
    },
    createOptionsList: function (container) {
      var self = this,
        list = document.createElement("ul");

      $.each(container.children, function (index, currentNode) {
        var item = self.createOptionContainer(currentNode),
          newNode;

        switch (currentNode.tagName.toLowerCase()) {
          case "option":
            newNode = self.createOption(currentNode);
            break;
          case "optgroup":
            newNode = self.createOptGroup(currentNode);
            break;
        }
        list.appendChild(item).appendChild(newNode);
      });
      return list;
    },
    refresh: function () {
      // check for select innerHTML changes
      if (this.storedSelectHTML !== this.element.prop("innerHTML")) {
        this.rebuildList();
      }

      // refresh custom scrollbar
      var scrollInstance = jcf.getInstance(this.listHolder);
      if (scrollInstance) {
        scrollInstance.refresh();
      }

      // refresh selectes classes
      this.refreshSelectedClass();
    },
    destroy: function () {
      this.listHolder.off("jcf-mousewheel", this.preventWheelHandler);
      this.listHolder.off(
        "jcf-pointerdown",
        this.indexSelector,
        this.onSelectItem
      );
      this.listHolder.off(
        "jcf-pointerover",
        this.indexSelector,
        this.onHoverItem
      );
      this.listHolder.off("jcf-pointerdown", this.onPress);
    },
  });

  // helper functions
  var getPrefixedClasses = function (className, prefixToAdd) {
    return className
      ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + "$1 ")
      : "";
  };
  var makeUnselectable = (function () {
    var unselectableClass = jcf.getOptions().unselectableClass;
    function preventHandler(e) {
      e.preventDefault();
    }
    return function (node) {
      node.addClass(unselectableClass).on("selectstart", preventHandler);
    };
  })();
})(jQuery, this);

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.1
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof exports !== "undefined") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function ($) {
  "use strict";
  var Slick = window.Slick || {};

  Slick = (function () {
    var instanceUid = 0;

    function Slick(element, settings) {
      var _ = this,
        dataSettings;

      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (slider, i) {
          return $('<button type="button" />').text(i + 1);
        },
        dots: false,
        dotsClass: "slick-dots",
        draggable: true,
        easing: "linear",
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: false,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000,
      };

      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false,
      };

      $.extend(_, _.initials);

      _.activeBreakpoint = null;
      _.animType = null;
      _.animProp = null;
      _.breakpoints = [];
      _.breakpointSettings = [];
      _.cssTransitions = false;
      _.focussed = false;
      _.interrupted = false;
      _.hidden = "hidden";
      _.paused = true;
      _.positionProp = null;
      _.respondTo = null;
      _.rowCount = 1;
      _.shouldClick = true;
      _.$slider = $(element);
      _.$slidesCache = null;
      _.transformType = null;
      _.transitionType = null;
      _.visibilityChange = "visibilitychange";
      _.windowWidth = 0;
      _.windowTimer = null;

      dataSettings = $(element).data("slick") || {};

      _.options = $.extend({}, _.defaults, settings, dataSettings);

      _.currentSlide = _.options.initialSlide;

      _.originalSettings = _.options;

      if (typeof document.mozHidden !== "undefined") {
        _.hidden = "mozHidden";
        _.visibilityChange = "mozvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        _.hidden = "webkitHidden";
        _.visibilityChange = "webkitvisibilitychange";
      }

      _.autoPlay = $.proxy(_.autoPlay, _);
      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
      _.changeSlide = $.proxy(_.changeSlide, _);
      _.clickHandler = $.proxy(_.clickHandler, _);
      _.selectHandler = $.proxy(_.selectHandler, _);
      _.setPosition = $.proxy(_.setPosition, _);
      _.swipeHandler = $.proxy(_.swipeHandler, _);
      _.dragHandler = $.proxy(_.dragHandler, _);
      _.keyHandler = $.proxy(_.keyHandler, _);

      _.instanceUid = instanceUid++;

      // A simple way to check for HTML strings
      // Strict HTML recognition (must start with <)
      // Extracted from jQuery v1.11 source
      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

      _.registerBreakpoints();
      _.init(true);
    }

    return Slick;
  })();

  Slick.prototype.activateADA = function () {
    var _ = this;

    _.$slideTrack
      .find(".slick-active")
      .attr({
        "aria-hidden": "false",
      })
      .find("a, input, button, select")
      .attr({
        tabindex: "0",
      });
  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (
    markup,
    index,
    addBefore
  ) {
    var _ = this;

    if (typeof index === "boolean") {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= _.slideCount) {
      return false;
    }

    _.unload();

    if (typeof index === "number") {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index));
      } else {
        $(markup).insertAfter(_.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack);
      } else {
        $(markup).appendTo(_.$slideTrack);
      }
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slides.each(function (index, element) {
      $(element).attr("data-slick-index", index);
    });

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.animateHeight = function () {
    var _ = this;
    if (
      _.options.slidesToShow === 1 &&
      _.options.adaptiveHeight === true &&
      _.options.vertical === false
    ) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
      _.$list.animate(
        {
          height: targetHeight,
        },
        _.options.speed
      );
    }
  };

  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
      _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }
    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate(
          {
            left: targetLeft,
          },
          _.options.speed,
          _.options.easing,
          callback
        );
      } else {
        _.$slideTrack.animate(
          {
            top: targetLeft,
          },
          _.options.speed,
          _.options.easing,
          callback
        );
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft;
        }
        $({
          animStart: _.currentLeft,
        }).animate(
          {
            animStart: targetLeft,
          },
          {
            duration: _.options.speed,
            easing: _.options.easing,
            step: function (now) {
              now = Math.ceil(now);
              if (_.options.vertical === false) {
                animProps[_.animType] = "translate(" + now + "px, 0px)";
                _.$slideTrack.css(animProps);
              } else {
                animProps[_.animType] = "translate(0px," + now + "px)";
                _.$slideTrack.css(animProps);
              }
            },
            complete: function () {
              if (callback) {
                callback.call();
              }
            },
          }
        );
      } else {
        _.applyTransition();
        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)";
        } else {
          animProps[_.animType] = "translate3d(0px," + targetLeft + "px, 0px)";
        }
        _.$slideTrack.css(animProps);

        if (callback) {
          setTimeout(function () {
            _.disableTransition();

            callback.call();
          }, _.options.speed);
        }
      }
    }
  };

  Slick.prototype.getNavTarget = function () {
    var _ = this,
      asNavFor = _.options.asNavFor;

    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider);
    }

    return asNavFor;
  };

  Slick.prototype.asNavFor = function (index) {
    var _ = this,
      asNavFor = _.getNavTarget();

    if (asNavFor !== null && typeof asNavFor === "object") {
      asNavFor.each(function () {
        var target = $(this).slick("getSlick");
        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  };

  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
      transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] =
        _.transformType + " " + _.options.speed + "ms " + _.options.cssEase;
    } else {
      transition[_.transitionType] =
        "opacity " + _.options.speed + "ms " + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.autoPlay = function () {
    var _ = this;

    _.autoPlayClear();

    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(
        _.autoPlayIterator,
        _.options.autoplaySpeed
      );
    }
  };

  Slick.prototype.autoPlayClear = function () {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  };

  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
      slideTo = _.currentSlide + _.options.slidesToScroll;

    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0;
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll;

          if (_.currentSlide - 1 === 0) {
            _.direction = 1;
          }
        }
      }

      _.slideHandler(slideTo);
    }
  };

  Slick.prototype.buildArrows = function () {
    var _ = this;

    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass("slick-arrow");
      _.$nextArrow = $(_.options.nextArrow).addClass("slick-arrow");

      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow
          .removeClass("slick-hidden")
          .removeAttr("aria-hidden tabindex");
        _.$nextArrow
          .removeClass("slick-hidden")
          .removeAttr("aria-hidden tabindex");

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        }
      } else {
        _.$prevArrow
          .add(_.$nextArrow)

          .addClass("slick-hidden")
          .attr({
            "aria-disabled": "true",
            tabindex: "-1",
          });
      }
    }
  };

  Slick.prototype.buildDots = function () {
    var _ = this,
      i,
      dot;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass("slick-dotted");

      dot = $("<ul />").addClass(_.options.dotsClass);

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($("<li />").append(_.options.customPaging.call(this, _, i)));
      }

      _.$dots = dot.appendTo(_.options.appendDots);

      _.$dots.find("li").first().addClass("slick-active");
    }
  };

  Slick.prototype.buildOut = function () {
    var _ = this;

    _.$slides = _.$slider
      .children(_.options.slide + ":not(.slick-cloned)")
      .addClass("slick-slide");

    _.slideCount = _.$slides.length;

    _.$slides.each(function (index, element) {
      $(element)
        .attr("data-slick-index", index)
        .data("originalStyling", $(element).attr("style") || "");
    });

    _.$slider.addClass("slick-slider");

    _.$slideTrack =
      _.slideCount === 0
        ? $('<div class="slick-track"/>').appendTo(_.$slider)
        : _.$slides.wrapAll('<div class="slick-track"/>').parent();

    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();
    _.$slideTrack.css("opacity", 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $("img[data-lazy]", _.$slider).not("[src]").addClass("slick-loading");

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();

    _.setSlideClasses(typeof _.currentSlide === "number" ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass("draggable");
    }
  };

  Slick.prototype.buildRows = function () {
    var _ = this,
      a,
      b,
      c,
      newSlides,
      numOfSlides,
      originalSlides,
      slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement("div");
        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement("div");
          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target =
              a * slidesPerSection + (b * _.options.slidesPerRow + c);
            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }
          slide.appendChild(row);
        }
        newSlides.appendChild(slide);
      }

      _.$slider.empty().append(newSlides);
      _.$slider
        .children()
        .children()
        .children()
        .css({
          width: 100 / _.options.slidesPerRow + "%",
          display: "inline-block",
        });
    }
  };

  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
      breakpoint,
      targetBreakpoint,
      respondToWidth,
      triggerBreakpoint = false;
    var sliderWidth = _.$slider.width();
    var windowWidth = window.innerWidth || $(window).width();

    if (_.respondTo === "window") {
      respondToWidth = windowWidth;
    } else if (_.respondTo === "slider") {
      respondToWidth = sliderWidth;
    } else if (_.respondTo === "min") {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (
      _.options.responsive &&
      _.options.responsive.length &&
      _.options.responsive !== null
    ) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint;
            if (_.breakpointSettings[targetBreakpoint] === "unslick") {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend(
                {},
                _.originalSettings,
                _.breakpointSettings[targetBreakpoint]
              );
              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }
              _.refresh(initial);
            }
            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          _.activeBreakpoint = targetBreakpoint;
          if (_.breakpointSettings[targetBreakpoint] === "unslick") {
            _.unslick(targetBreakpoint);
          } else {
            _.options = $.extend(
              {},
              _.originalSettings,
              _.breakpointSettings[targetBreakpoint]
            );
            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }
            _.refresh(initial);
          }
          triggerBreakpoint = targetBreakpoint;
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          _.options = _.originalSettings;
          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }
          _.refresh(initial);
          triggerBreakpoint = targetBreakpoint;
        }
      }

      // only trigger breakpoints during an actual break. not on initialize.
      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger("breakpoint", [_, triggerBreakpoint]);
      }
    }
  };

  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
      $target = $(event.currentTarget),
      indexOffset,
      slideOffset,
      unevenOffset;

    // If target is a link, prevent default action.
    if ($target.is("a")) {
      event.preventDefault();
    }

    // If target is not the <li> element (ie: a child), find the <li>.
    if (!$target.is("li")) {
      $target = $target.closest("li");
    }

    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
    indexOffset = unevenOffset
      ? 0
      : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

    switch (event.data.message) {
      case "previous":
        slideOffset =
          indexOffset === 0
            ? _.options.slidesToScroll
            : _.options.slidesToShow - indexOffset;
        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
        }
        break;

      case "next":
        slideOffset =
          indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
        }
        break;

      case "index":
        var index =
          event.data.index === 0
            ? 0
            : event.data.index || $target.index() * _.options.slidesToScroll;

        _.slideHandler(_.checkNavigable(index), false, dontAnimate);
        $target.children().trigger("focus");
        break;

      default:
        return;
    }
  };

  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
      navigables,
      prevNavigable;

    navigables = _.getNavigableIndexes();
    prevNavigable = 0;
    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }
        prevNavigable = navigables[n];
      }
    }

    return index;
  };

  Slick.prototype.cleanUpEvents = function () {
    var _ = this;

    if (_.options.dots && _.$dots !== null) {
      $("li", _.$dots)
        .off("click.slick", _.changeSlide)
        .off("mouseenter.slick", $.proxy(_.interrupt, _, true))
        .off("mouseleave.slick", $.proxy(_.interrupt, _, false));

      if (_.options.accessibility === true) {
        _.$dots.off("keydown.slick", _.keyHandler);
      }
    }

    _.$slider.off("focus.slick blur.slick");

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off("click.slick", _.changeSlide);
      _.$nextArrow && _.$nextArrow.off("click.slick", _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off("keydown.slick", _.keyHandler);
        _.$nextArrow && _.$nextArrow.off("keydown.slick", _.keyHandler);
      }
    }

    _.$list.off("touchstart.slick mousedown.slick", _.swipeHandler);
    _.$list.off("touchmove.slick mousemove.slick", _.swipeHandler);
    _.$list.off("touchend.slick mouseup.slick", _.swipeHandler);
    _.$list.off("touchcancel.slick mouseleave.slick", _.swipeHandler);

    _.$list.off("click.slick", _.clickHandler);

    $(document).off(_.visibilityChange, _.visibility);

    _.cleanUpSlideEvents();

    if (_.options.accessibility === true) {
      _.$list.off("keydown.slick", _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off("click.slick", _.selectHandler);
    }

    $(window).off(
      "orientationchange.slick.slick-" + _.instanceUid,
      _.orientationChange
    );

    $(window).off("resize.slick.slick-" + _.instanceUid, _.resize);

    $("[draggable!=true]", _.$slideTrack).off("dragstart", _.preventDefault);

    $(window).off("load.slick.slick-" + _.instanceUid, _.setPosition);
  };

  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this;

    _.$list.off("mouseenter.slick", $.proxy(_.interrupt, _, true));
    _.$list.off("mouseleave.slick", $.proxy(_.interrupt, _, false));
  };

  Slick.prototype.cleanUpRows = function () {
    var _ = this,
      originalSlides;

    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr("style");
      _.$slider.empty().append(originalSlides);
    }
  };

  Slick.prototype.clickHandler = function (event) {
    var _ = this;

    if (_.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  Slick.prototype.destroy = function (refresh) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $(".slick-cloned", _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow
        .removeClass("slick-disabled slick-arrow slick-hidden")
        .removeAttr("aria-hidden aria-disabled tabindex")
        .css("display", "");

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow
        .removeClass("slick-disabled slick-arrow slick-hidden")
        .removeAttr("aria-hidden aria-disabled tabindex")
        .css("display", "");

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }
    }

    if (_.$slides) {
      _.$slides
        .removeClass(
          "slick-slide slick-active slick-center slick-visible slick-current"
        )
        .removeAttr("aria-hidden")
        .removeAttr("data-slick-index")
        .each(function () {
          $(this).attr("style", $(this).data("originalStyling"));
        });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass("slick-slider");
    _.$slider.removeClass("slick-initialized");
    _.$slider.removeClass("slick-dotted");

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger("destroy", [_]);
    }
  };

  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
      transition = {};

    transition[_.transitionType] = "";

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({
        zIndex: _.options.zIndex,
      });

      _.$slides.eq(slideIndex).animate(
        {
          opacity: 1,
        },
        _.options.speed,
        _.options.easing,
        callback
      );
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: _.options.zIndex,
      });

      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex);

          callback.call();
        }, _.options.speed);
      }
    }
  };

  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).animate(
        {
          opacity: 0,
          zIndex: _.options.zIndex - 2,
        },
        _.options.speed,
        _.options.easing
      );
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: _.options.zIndex - 2,
      });
    }
  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (
    filter
  ) {
    var _ = this;

    if (filter !== null) {
      _.$slidesCache = _.$slides;

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.focusHandler = function () {
    var _ = this;

    _.$slider
      .off("focus.slick blur.slick")
      .on("focus.slick blur.slick", "*", function (event) {
        event.stopImmediatePropagation();
        var $sf = $(this);

        setTimeout(function () {
          if (_.options.pauseOnFocus) {
            _.focussed = $sf.is(":focus");
            _.autoPlay();
          }
        }, 0);
      });
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this;
    return _.currentSlide;
  };

  Slick.prototype.getDotCount = function () {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty;
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter +=
            _.options.slidesToScroll <= _.options.slidesToShow
              ? _.options.slidesToScroll
              : _.options.slidesToShow;
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else if (!_.options.asNavFor) {
      pagerQty =
        1 +
        Math.ceil(
          (_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll
        );
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter +=
          _.options.slidesToScroll <= _.options.slidesToShow
            ? _.options.slidesToScroll
            : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  };

  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
      targetLeft,
      verticalHeight,
      verticalOffset = 0,
      targetSlide,
      coef;

    _.slideOffset = 0;
    verticalHeight = _.$slides.first().outerHeight(true);

    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
        coef = -1;

        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5;
          } else if (_.options.slidesToShow === 1) {
            coef = -2;
          }
        }
        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
      }
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (
          slideIndex + _.options.slidesToScroll > _.slideCount &&
          _.slideCount > _.options.slidesToShow
        ) {
          if (slideIndex > _.slideCount) {
            _.slideOffset =
              (_.options.slidesToShow - (slideIndex - _.slideCount)) *
              _.slideWidth *
              -1;
            verticalOffset =
              (_.options.slidesToShow - (slideIndex - _.slideCount)) *
              verticalHeight *
              -1;
          } else {
            _.slideOffset =
              (_.slideCount % _.options.slidesToScroll) * _.slideWidth * -1;
            verticalOffset =
              (_.slideCount % _.options.slidesToScroll) * verticalHeight * -1;
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset =
          (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
        verticalOffset =
          (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
      }
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0;
      verticalOffset = 0;
    }

    if (
      _.options.centerMode === true &&
      _.slideCount <= _.options.slidesToShow
    ) {
      _.slideOffset =
        (_.slideWidth * Math.floor(_.options.slidesToShow)) / 2 -
        (_.slideWidth * _.slideCount) / 2;
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset +=
        _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0;
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (_.options.variableWidth === true) {
      if (
        _.slideCount <= _.options.slidesToShow ||
        _.options.infinite === false
      ) {
        targetSlide = _.$slideTrack.children(".slick-slide").eq(slideIndex);
      } else {
        targetSlide = _.$slideTrack
          .children(".slick-slide")
          .eq(slideIndex + _.options.slidesToShow);
      }

      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft =
            (_.$slideTrack.width() -
              targetSlide[0].offsetLeft -
              targetSlide.width()) *
            -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
      }

      if (_.options.centerMode === true) {
        if (
          _.slideCount <= _.options.slidesToShow ||
          _.options.infinite === false
        ) {
          targetSlide = _.$slideTrack.children(".slick-slide").eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack
            .children(".slick-slide")
            .eq(slideIndex + _.options.slidesToShow + 1);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft =
              (_.$slideTrack.width() -
                targetSlide[0].offsetLeft -
                targetSlide.width()) *
              -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (
    option
  ) {
    var _ = this;

    return _.options[option];
  };

  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
      breakPoint = 0,
      counter = 0,
      indexes = [],
      max;

    if (_.options.infinite === false) {
      max = _.slideCount;
    } else {
      breakPoint = _.options.slidesToScroll * -1;
      counter = _.options.slidesToScroll * -1;
      max = _.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + _.options.slidesToScroll;
      counter +=
        _.options.slidesToScroll <= _.options.slidesToShow
          ? _.options.slidesToScroll
          : _.options.slidesToShow;
    }

    return indexes;
  };

  Slick.prototype.getSlick = function () {
    return this;
  };

  Slick.prototype.getSlideCount = function () {
    var _ = this,
      slidesTraversed,
      swipedSlide,
      centerOffset;

    centerOffset =
      _.options.centerMode === true
        ? _.slideWidth * Math.floor(_.options.slidesToShow / 2)
        : 0;

    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find(".slick-slide").each(function (index, slide) {
        if (
          slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 >
          _.swipeLeft * -1
        ) {
          swipedSlide = slide;
          return false;
        }
      });

      slidesTraversed =
        Math.abs($(swipedSlide).attr("data-slick-index") - _.currentSlide) || 1;

      return slidesTraversed;
    } else {
      return _.options.slidesToScroll;
    }
  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (
    slide,
    dontAnimate
  ) {
    var _ = this;

    _.changeSlide(
      {
        data: {
          message: "index",
          index: parseInt(slide),
        },
      },
      dontAnimate
    );
  };

  Slick.prototype.init = function (creation) {
    var _ = this;

    if (!$(_.$slider).hasClass("slick-initialized")) {
      $(_.$slider).addClass("slick-initialized");

      _.buildRows();
      _.buildOut();
      _.setProps();
      _.startLoad();
      _.loadSlider();
      _.initializeEvents();
      _.updateArrows();
      _.updateDots();
      _.checkResponsive(true);
      _.focusHandler();
    }

    if (creation) {
      _.$slider.trigger("init", [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }

    if (_.options.autoplay) {
      _.paused = false;
      _.autoPlay();
    }
  };

  Slick.prototype.initADA = function () {
    var _ = this,
      numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
      tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
        return val >= 0 && val < _.slideCount;
      });

    _.$slides
      .add(_.$slideTrack.find(".slick-cloned"))
      .attr({
        "aria-hidden": "true",
        tabindex: "-1",
      })
      .find("a, input, button, select")
      .attr({
        tabindex: "-1",
      });

    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i);

        $(this).attr({
          role: "tabpanel",
          id: "slick-slide" + _.instanceUid + i,
          tabindex: -1,
        });

        if (slideControlIndex !== -1) {
          var ariaButtonControl =
            "slick-slide-control" + _.instanceUid + slideControlIndex;
          if ($("#" + ariaButtonControl).length) {
            $(this).attr({
              "aria-describedby": ariaButtonControl,
            });
          }
        }
      });

      _.$dots
        .attr("role", "tablist")
        .find("li")
        .each(function (i) {
          var mappedSlideIndex = tabControlIndexes[i];

          $(this).attr({
            role: "presentation",
          });

          $(this)
            .find("button")
            .first()
            .attr({
              role: "tab",
              id: "slick-slide-control" + _.instanceUid + i,
              "aria-controls": "slick-slide" + _.instanceUid + mappedSlideIndex,
              "aria-label": i + 1 + " of " + numDotGroups,
              "aria-selected": null,
              tabindex: "-1",
            });
        })
        .eq(_.currentSlide)
        .find("button")
        .attr({
          "aria-selected": "true",
          tabindex: "0",
        })
        .end();
    }

    for (
      var i = _.currentSlide, max = i + _.options.slidesToShow;
      i < max;
      i++
    ) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({ tabindex: "0" });
      } else {
        _.$slides.eq(i).removeAttr("tabindex");
      }
    }

    _.activateADA();
  };

  Slick.prototype.initArrowEvents = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off("click.slick").on(
        "click.slick",
        {
          message: "previous",
        },
        _.changeSlide
      );
      _.$nextArrow.off("click.slick").on(
        "click.slick",
        {
          message: "next",
        },
        _.changeSlide
      );

      if (_.options.accessibility === true) {
        _.$prevArrow.on("keydown.slick", _.keyHandler);
        _.$nextArrow.on("keydown.slick", _.keyHandler);
      }
    }
  };

  Slick.prototype.initDotEvents = function () {
    var _ = this;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $("li", _.$dots).on(
        "click.slick",
        {
          message: "index",
        },
        _.changeSlide
      );

      if (_.options.accessibility === true) {
        _.$dots.on("keydown.slick", _.keyHandler);
      }
    }

    if (
      _.options.dots === true &&
      _.options.pauseOnDotsHover === true &&
      _.slideCount > _.options.slidesToShow
    ) {
      $("li", _.$dots)
        .on("mouseenter.slick", $.proxy(_.interrupt, _, true))
        .on("mouseleave.slick", $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initSlideEvents = function () {
    var _ = this;

    if (_.options.pauseOnHover) {
      _.$list.on("mouseenter.slick", $.proxy(_.interrupt, _, true));
      _.$list.on("mouseleave.slick", $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initializeEvents = function () {
    var _ = this;

    _.initArrowEvents();

    _.initDotEvents();
    _.initSlideEvents();

    _.$list.on(
      "touchstart.slick mousedown.slick",
      {
        action: "start",
      },
      _.swipeHandler
    );
    _.$list.on(
      "touchmove.slick mousemove.slick",
      {
        action: "move",
      },
      _.swipeHandler
    );
    _.$list.on(
      "touchend.slick mouseup.slick",
      {
        action: "end",
      },
      _.swipeHandler
    );
    _.$list.on(
      "touchcancel.slick mouseleave.slick",
      {
        action: "end",
      },
      _.swipeHandler
    );

    _.$list.on("click.slick", _.clickHandler);

    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

    if (_.options.accessibility === true) {
      _.$list.on("keydown.slick", _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on("click.slick", _.selectHandler);
    }

    $(window).on(
      "orientationchange.slick.slick-" + _.instanceUid,
      $.proxy(_.orientationChange, _)
    );

    $(window).on("resize.slick.slick-" + _.instanceUid, $.proxy(_.resize, _));

    $("[draggable!=true]", _.$slideTrack).on("dragstart", _.preventDefault);

    $(window).on("load.slick.slick-" + _.instanceUid, _.setPosition);
    $(_.setPosition);
  };

  Slick.prototype.initUI = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show();
      _.$nextArrow.show();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show();
    }
  };

  Slick.prototype.keyHandler = function (event) {
    var _ = this;
    //Dont slide if the cursor is inside the form fields and arrow keys are pressed
    if (!event.target.tagName.match("TEXTAREA|INPUT|SELECT")) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? "next" : "previous",
          },
        });
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? "previous" : "next",
          },
        });
      }
    }
  };

  Slick.prototype.lazyLoad = function () {
    var _ = this,
      loadRange,
      cloneRange,
      rangeStart,
      rangeEnd;

    function loadImages(imagesScope) {
      $("img[data-lazy]", imagesScope).each(function () {
        var image = $(this),
          imageSource = $(this).attr("data-lazy"),
          imageSrcSet = $(this).attr("data-srcset"),
          imageSizes =
            $(this).attr("data-sizes") || _.$slider.attr("data-sizes"),
          imageToLoad = document.createElement("img");

        imageToLoad.onload = function () {
          image.animate({ opacity: 0 }, 100, function () {
            if (imageSrcSet) {
              image.attr("srcset", imageSrcSet);

              if (imageSizes) {
                image.attr("sizes", imageSizes);
              }
            }

            image
              .attr("src", imageSource)
              .animate({ opacity: 1 }, 200, function () {
                image
                  .removeAttr("data-lazy data-srcset data-sizes")
                  .removeClass("slick-loading");
              });
            _.$slider.trigger("lazyLoaded", [_, image, imageSource]);
          });
        };

        imageToLoad.onerror = function () {
          image
            .removeAttr("data-lazy")
            .removeClass("slick-loading")
            .addClass("slick-lazyload-error");

          _.$slider.trigger("lazyLoadError", [_, image, imageSource]);
        };

        imageToLoad.src = imageSource;
      });
    }

    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + _.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(
          0,
          _.currentSlide - (_.options.slidesToShow / 2 + 1)
        );
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
      }
    } else {
      rangeStart = _.options.infinite
        ? _.options.slidesToShow + _.currentSlide
        : _.currentSlide;
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd <= _.slideCount) rangeEnd++;
      }
    }

    loadRange = _.$slider.find(".slick-slide").slice(rangeStart, rangeEnd);

    if (_.options.lazyLoad === "anticipated") {
      var prevSlide = rangeStart - 1,
        nextSlide = rangeEnd,
        $slides = _.$slider.find(".slick-slide");

      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1;
        loadRange = loadRange.add($slides.eq(prevSlide));
        loadRange = loadRange.add($slides.eq(nextSlide));
        prevSlide--;
        nextSlide++;
      }
    }

    loadImages(loadRange);

    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find(".slick-slide");
      loadImages(cloneRange);
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider
        .find(".slick-cloned")
        .slice(0, _.options.slidesToShow);
      loadImages(cloneRange);
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider
        .find(".slick-cloned")
        .slice(_.options.slidesToShow * -1);
      loadImages(cloneRange);
    }
  };

  Slick.prototype.loadSlider = function () {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1,
    });

    _.$slider.removeClass("slick-loading");

    _.initUI();

    if (_.options.lazyLoad === "progressive") {
      _.progressiveLazyLoad();
    }
  };

  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: "next",
      },
    });
  };

  Slick.prototype.orientationChange = function () {
    var _ = this;

    _.checkResponsive();
    _.setPosition();
  };

  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this;

    _.autoPlayClear();
    _.paused = true;
  };

  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this;

    _.autoPlay();
    _.options.autoplay = true;
    _.paused = false;
    _.focussed = false;
    _.interrupted = false;
  };

  Slick.prototype.postSlide = function (index) {
    var _ = this;

    if (!_.unslicked) {
      _.$slider.trigger("afterChange", [_, index]);

      _.animating = false;

      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition();
      }

      _.swipeLeft = null;

      if (_.options.autoplay) {
        _.autoPlay();
      }

      if (_.options.accessibility === true) {
        _.initADA();

        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide));
          $currentSlide.attr("tabindex", 0).focus();
        }
      }
    }
  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: "previous",
      },
    });
  };

  Slick.prototype.preventDefault = function (event) {
    event.preventDefault();
  };

  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1;

    var _ = this,
      $imgsToLoad = $("img[data-lazy]", _.$slider),
      image,
      imageSource,
      imageSrcSet,
      imageSizes,
      imageToLoad;

    if ($imgsToLoad.length) {
      image = $imgsToLoad.first();
      imageSource = image.attr("data-lazy");
      imageSrcSet = image.attr("data-srcset");
      imageSizes = image.attr("data-sizes") || _.$slider.attr("data-sizes");
      imageToLoad = document.createElement("img");

      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr("srcset", imageSrcSet);

          if (imageSizes) {
            image.attr("sizes", imageSizes);
          }
        }

        image
          .attr("src", imageSource)
          .removeAttr("data-lazy data-srcset data-sizes")
          .removeClass("slick-loading");

        if (_.options.adaptiveHeight === true) {
          _.setPosition();
        }

        _.$slider.trigger("lazyLoaded", [_, image, imageSource]);
        _.progressiveLazyLoad();
      };

      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          /**
           * try to load the image 3 times,
           * leave a slight delay so we don't get
           * servers blocking the request.
           */
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          image
            .removeAttr("data-lazy")
            .removeClass("slick-loading")
            .addClass("slick-lazyload-error");

          _.$slider.trigger("lazyLoadError", [_, image, imageSource]);

          _.progressiveLazyLoad();
        }
      };

      imageToLoad.src = imageSource;
    } else {
      _.$slider.trigger("allImagesLoaded", [_]);
    }
  };

  Slick.prototype.refresh = function (initializing) {
    var _ = this,
      currentSlide,
      lastVisibleIndex;

    lastVisibleIndex = _.slideCount - _.options.slidesToShow;

    // in non-infinite sliders, we don't want to go past the
    // last visible index.
    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex;
    }

    // if less slides than to show, go to start.
    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    $.extend(_, _.initials, { currentSlide: currentSlide });

    _.init();

    if (!initializing) {
      _.changeSlide(
        {
          data: {
            message: "index",
            index: currentSlide,
          },
        },
        false
      );
    }
  };

  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
      breakpoint,
      currentBreakpoint,
      l,
      responsiveSettings = _.options.responsive || null;

    if ($.type(responsiveSettings) === "array" && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || "window";

      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

          // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don't want dupes.
          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }
            l--;
          }

          _.breakpoints.push(currentBreakpoint);
          _.breakpointSettings[currentBreakpoint] =
            responsiveSettings[breakpoint].settings;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a;
      });
    }
  };

  Slick.prototype.reinit = function () {
    var _ = this;

    _.$slides = _.$slideTrack.children(_.options.slide).addClass("slick-slide");

    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();
    _.setupInfinite();
    _.buildArrows();
    _.updateArrows();
    _.initArrowEvents();
    _.buildDots();
    _.updateDots();
    _.initDotEvents();
    _.cleanUpSlideEvents();
    _.initSlideEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on("click.slick", _.selectHandler);
    }

    _.setSlideClasses(typeof _.currentSlide === "number" ? _.currentSlide : 0);

    _.setPosition();
    _.focusHandler();

    _.paused = !_.options.autoplay;
    _.autoPlay();

    _.$slider.trigger("reInit", [_]);
  };

  Slick.prototype.resize = function () {
    var _ = this;

    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay);
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width();
        _.checkResponsive();
        if (!_.unslicked) {
          _.setPosition();
        }
      }, 50);
    }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (
    index,
    removeBefore,
    removeAll
  ) {
    var _ = this;

    if (typeof index === "boolean") {
      removeBefore = index;
      index = removeBefore === true ? 0 : _.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false;
    }

    _.unload();

    if (removeAll === true) {
      _.$slideTrack.children().remove();
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.setCSS = function (position) {
    var _ = this,
      positionProps = {},
      x,
      y;

    if (_.options.rtl === true) {
      position = -position;
    }
    x = _.positionProp == "left" ? Math.ceil(position) + "px" : "0px";
    y = _.positionProp == "top" ? Math.ceil(position) + "px" : "0px";

    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};
      if (_.cssTransitions === false) {
        positionProps[_.animType] = "translate(" + x + ", " + y + ")";
        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = "translate3d(" + x + ", " + y + ", 0px)";
        _.$slideTrack.css(positionProps);
      }
    }
  };

  Slick.prototype.setDimensions = function () {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: "0px " + _.options.centerPadding,
        });
      }
    } else {
      _.$list.height(
        _.$slides.first().outerHeight(true) * _.options.slidesToShow
      );
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: _.options.centerPadding + " 0px",
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();

    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
      _.$slideTrack.width(
        Math.ceil(_.slideWidth * _.$slideTrack.children(".slick-slide").length)
      );
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);
      _.$slideTrack.height(
        Math.ceil(
          _.$slides.first().outerHeight(true) *
            _.$slideTrack.children(".slick-slide").length
        )
      );
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
    if (_.options.variableWidth === false)
      _.$slideTrack.children(".slick-slide").width(_.slideWidth - offset);
  };

  Slick.prototype.setFade = function () {
    var _ = this,
      targetLeft;

    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1;
      if (_.options.rtl === true) {
        $(element).css({
          position: "relative",
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0,
        });
      } else {
        $(element).css({
          position: "relative",
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0,
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1,
    });
  };

  Slick.prototype.setHeight = function () {
    var _ = this;

    if (
      _.options.slidesToShow === 1 &&
      _.options.adaptiveHeight === true &&
      _.options.vertical === false
    ) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
      _.$list.css("height", targetHeight);
    }
  };

  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    /**
     * accepts arguments in format of:
     *
     *  - for changing a single option's value:
     *     .slick("setOption", option, value, refresh )
     *
     *  - for changing a set of responsive options:
     *     .slick("setOption", 'responsive', [{}, ...], refresh )
     *
     *  - for updating multiple values at once (not responsive)
     *     .slick("setOption", { 'option': value, ... }, refresh )
     */

    var _ = this,
      l,
      item,
      option,
      value,
      refresh = false,
      type;

    if ($.type(arguments[0]) === "object") {
      option = arguments[0];
      refresh = arguments[1];
      type = "multiple";
    } else if ($.type(arguments[0]) === "string") {
      option = arguments[0];
      value = arguments[1];
      refresh = arguments[2];

      if (arguments[0] === "responsive" && $.type(arguments[1]) === "array") {
        type = "responsive";
      } else if (typeof arguments[1] !== "undefined") {
        type = "single";
      }
    }

    if (type === "single") {
      _.options[option] = value;
    } else if (type === "multiple") {
      $.each(option, function (opt, val) {
        _.options[opt] = val;
      });
    } else if (type === "responsive") {
      for (item in value) {
        if ($.type(_.options.responsive) !== "array") {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1;

          // loop through the responsive object and splice out duplicates.
          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }

            l--;
          }

          _.options.responsive.push(value[item]);
        }
      }
    }

    if (refresh) {
      _.unload();
      _.reinit();
    }
  };

  Slick.prototype.setPosition = function () {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger("setPosition", [_]);
  };

  Slick.prototype.setProps = function () {
    var _ = this,
      bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? "top" : "left";

    if (_.positionProp === "top") {
      _.$slider.addClass("slick-vertical");
    } else {
      _.$slider.removeClass("slick-vertical");
    }

    if (
      bodyStyle.WebkitTransition !== undefined ||
      bodyStyle.MozTransition !== undefined ||
      bodyStyle.msTransition !== undefined
    ) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === "number") {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = "OTransform";
      _.transformType = "-o-transform";
      _.transitionType = "OTransition";
      if (
        bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.webkitPerspective === undefined
      )
        _.animType = false;
    }
    if (bodyStyle.MozTransform !== undefined) {
      _.animType = "MozTransform";
      _.transformType = "-moz-transform";
      _.transitionType = "MozTransition";
      if (
        bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.MozPerspective === undefined
      )
        _.animType = false;
    }
    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = "webkitTransform";
      _.transformType = "-webkit-transform";
      _.transitionType = "webkitTransition";
      if (
        bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.webkitPerspective === undefined
      )
        _.animType = false;
    }
    if (bodyStyle.msTransform !== undefined) {
      _.animType = "msTransform";
      _.transformType = "-ms-transform";
      _.transitionType = "msTransition";
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }
    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = "transform";
      _.transformType = "transform";
      _.transitionType = "transition";
    }
    _.transformsEnabled =
      _.options.useTransform && _.animType !== null && _.animType !== false;
  };

  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
      centerOffset,
      allSlides,
      indexOffset,
      remainder;

    allSlides = _.$slider
      .find(".slick-slide")
      .removeClass("slick-active slick-center slick-current")
      .attr("aria-hidden", "true");

    _.$slides.eq(index).addClass("slick-current");

    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides
            .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
            .addClass("slick-active")
            .attr("aria-hidden", "false");
        } else {
          indexOffset = _.options.slidesToShow + index;
          allSlides
            .slice(
              indexOffset - centerOffset + 1 + evenCoef,
              indexOffset + centerOffset + 2
            )
            .addClass("slick-active")
            .attr("aria-hidden", "false");
        }

        if (index === 0) {
          allSlides
            .eq(allSlides.length - 1 - _.options.slidesToShow)
            .addClass("slick-center");
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass("slick-center");
        }
      }

      _.$slides.eq(index).addClass("slick-center");
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides
          .slice(index, index + _.options.slidesToShow)
          .addClass("slick-active")
          .attr("aria-hidden", "false");
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass("slick-active").attr("aria-hidden", "false");
      } else {
        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset =
          _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (
          _.options.slidesToShow == _.options.slidesToScroll &&
          _.slideCount - index < _.options.slidesToShow
        ) {
          allSlides
            .slice(
              indexOffset - (_.options.slidesToShow - remainder),
              indexOffset + remainder
            )
            .addClass("slick-active")
            .attr("aria-hidden", "false");
        } else {
          allSlides
            .slice(indexOffset, indexOffset + _.options.slidesToShow)
            .addClass("slick-active")
            .attr("aria-hidden", "false");
        }
      }
    }

    if (
      _.options.lazyLoad === "ondemand" ||
      _.options.lazyLoad === "anticipated"
    ) {
      _.lazyLoad();
    }
  };

  Slick.prototype.setupInfinite = function () {
    var _ = this,
      i,
      slideIndex,
      infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex])
            .clone(true)
            .attr("id", "")
            .attr("data-slick-index", slideIndex - _.slideCount)
            .prependTo(_.$slideTrack)
            .addClass("slick-cloned");
        }
        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex])
            .clone(true)
            .attr("id", "")
            .attr("data-slick-index", slideIndex + _.slideCount)
            .appendTo(_.$slideTrack)
            .addClass("slick-cloned");
        }
        _.$slideTrack
          .find(".slick-cloned")
          .find("[id]")
          .each(function () {
            $(this).attr("id", "");
          });
      }
    }
  };

  Slick.prototype.interrupt = function (toggle) {
    var _ = this;

    if (!toggle) {
      _.autoPlay();
    }
    _.interrupted = toggle;
  };

  Slick.prototype.selectHandler = function (event) {
    var _ = this;

    var targetElement = $(event.target).is(".slick-slide")
      ? $(event.target)
      : $(event.target).parents(".slick-slide");

    var index = parseInt(targetElement.attr("data-slick-index"));

    if (!index) index = 0;

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true);
      return;
    }

    _.slideHandler(index);
  };

  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
      animSlide,
      oldSlide,
      slideLeft,
      targetLeft = null,
      _ = this,
      navTarget;

    sync = sync || false;

    if (_.animating === true && _.options.waitForAnimate === true) {
      return;
    }

    if (_.options.fade === true && _.currentSlide === index) {
      return;
    }

    if (sync === false) {
      _.asNavFor(index);
    }

    targetSlide = index;
    targetLeft = _.getLeft(targetSlide);
    slideLeft = _.getLeft(_.currentSlide);

    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

    if (
      _.options.infinite === false &&
      _.options.centerMode === false &&
      (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)
    ) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;
        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }
      return;
    } else if (
      _.options.infinite === false &&
      _.options.centerMode === true &&
      (index < 0 || index > _.slideCount - _.options.slidesToScroll)
    ) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;
        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }
      return;
    }

    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
      } else {
        animSlide = _.slideCount + targetSlide;
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - _.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    _.animating = true;

    _.$slider.trigger("beforeChange", [_, _.currentSlide, animSlide]);

    oldSlide = _.currentSlide;
    _.currentSlide = animSlide;

    _.setSlideClasses(_.currentSlide);

    if (_.options.asNavFor) {
      navTarget = _.getNavTarget();
      navTarget = navTarget.slick("getSlick");

      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide);
      }
    }

    _.updateDots();
    _.updateArrows();

    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide);

        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }
      _.animateHeight();
      return;
    }

    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
  };

  Slick.prototype.startLoad = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide();
      _.$nextArrow.hide();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide();
    }

    _.$slider.addClass("slick-loading");
  };

  Slick.prototype.swipeDirection = function () {
    var xDist,
      yDist,
      r,
      swipeAngle,
      _ = this;

    xDist = _.touchObject.startX - _.touchObject.curX;
    yDist = _.touchObject.startY - _.touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round((r * 180) / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? "left" : "right";
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? "left" : "right";
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? "right" : "left";
    }
    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return "down";
      } else {
        return "up";
      }
    }

    return "vertical";
  };

  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
      slideCount,
      direction;

    _.dragging = false;
    _.swiping = false;

    if (_.scrolling) {
      _.scrolling = false;
      return false;
    }

    _.interrupted = false;
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

    if (_.touchObject.curX === undefined) {
      return false;
    }

    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger("edge", [_, _.swipeDirection()]);
    }

    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection();

      switch (direction) {
        case "left":
        case "down":
          slideCount = _.options.swipeToSlide
            ? _.checkNavigable(_.currentSlide + _.getSlideCount())
            : _.currentSlide + _.getSlideCount();

          _.currentDirection = 0;

          break;

        case "right":
        case "up":
          slideCount = _.options.swipeToSlide
            ? _.checkNavigable(_.currentSlide - _.getSlideCount())
            : _.currentSlide - _.getSlideCount();

          _.currentDirection = 1;

          break;

        default:
      }

      if (direction != "vertical") {
        _.slideHandler(slideCount);
        _.touchObject = {};
        _.$slider.trigger("swipe", [_, direction]);
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide);
        _.touchObject = {};
      }
    }
  };

  Slick.prototype.swipeHandler = function (event) {
    var _ = this;

    if (
      _.options.swipe === false ||
      ("ontouchend" in document && _.options.swipe === false)
    ) {
      return;
    } else if (
      _.options.draggable === false &&
      event.type.indexOf("mouse") !== -1
    ) {
      return;
    }

    _.touchObject.fingerCount =
      event.originalEvent && event.originalEvent.touches !== undefined
        ? event.originalEvent.touches.length
        : 1;

    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
    }

    switch (event.data.action) {
      case "start":
        _.swipeStart(event);
        break;

      case "move":
        _.swipeMove(event);
        break;

      case "end":
        _.swipeEnd(event);
        break;
    }
  };

  Slick.prototype.swipeMove = function (event) {
    var _ = this,
      edgeWasHit = false,
      curLeft,
      swipeDirection,
      swipeLength,
      positionOffset,
      touches,
      verticalSwipeLength;

    touches =
      event.originalEvent !== undefined ? event.originalEvent.touches : null;

    if (!_.dragging || _.scrolling || (touches && touches.length !== 1)) {
      return false;
    }

    curLeft = _.getLeft(_.currentSlide);

    _.touchObject.curX =
      touches !== undefined ? touches[0].pageX : event.clientX;
    _.touchObject.curY =
      touches !== undefined ? touches[0].pageY : event.clientY;

    _.touchObject.swipeLength = Math.round(
      Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))
    );

    verticalSwipeLength = Math.round(
      Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2))
    );

    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true;
      return false;
    }

    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength;
    }

    swipeDirection = _.swipeDirection();

    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true;
      event.preventDefault();
    }

    positionOffset =
      (_.options.rtl === false ? 1 : -1) *
      (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
    }

    swipeLength = _.touchObject.swipeLength;

    _.touchObject.edgeHit = false;

    if (_.options.infinite === false) {
      if (
        (_.currentSlide === 0 && swipeDirection === "right") ||
        (_.currentSlide >= _.getDotCount() && swipeDirection === "left")
      ) {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
        _.touchObject.edgeHit = true;
      }
    }

    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft =
        curLeft +
        swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
    }
    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (_.options.fade === true || _.options.touchMove === false) {
      return false;
    }

    if (_.animating === true) {
      _.swipeLeft = null;
      return false;
    }

    _.setCSS(_.swipeLeft);
  };

  Slick.prototype.swipeStart = function (event) {
    var _ = this,
      touches;

    _.interrupted = true;

    if (
      _.touchObject.fingerCount !== 1 ||
      _.slideCount <= _.options.slidesToShow
    ) {
      _.touchObject = {};
      return false;
    }

    if (
      event.originalEvent !== undefined &&
      event.originalEvent.touches !== undefined
    ) {
      touches = event.originalEvent.touches[0];
    }

    _.touchObject.startX = _.touchObject.curX =
      touches !== undefined ? touches.pageX : event.clientX;
    _.touchObject.startY = _.touchObject.curY =
      touches !== undefined ? touches.pageY : event.clientY;

    _.dragging = true;
  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this;

    if (_.$slidesCache !== null) {
      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.unload = function () {
    var _ = this;

    $(".slick-cloned", _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides
      .removeClass("slick-slide slick-active slick-visible slick-current")
      .attr("aria-hidden", "true")
      .css("width", "");
  };

  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this;
    _.$slider.trigger("unslick", [_, fromBreakpoint]);
    _.destroy();
  };

  Slick.prototype.updateArrows = function () {
    var _ = this,
      centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (
      _.options.arrows === true &&
      _.slideCount > _.options.slidesToShow &&
      !_.options.infinite
    ) {
      _.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      _.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");

      if (_.currentSlide === 0) {
        _.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        _.$nextArrow
          .removeClass("slick-disabled")
          .attr("aria-disabled", "false");
      } else if (
        _.currentSlide >= _.slideCount - _.options.slidesToShow &&
        _.options.centerMode === false
      ) {
        _.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        _.$prevArrow
          .removeClass("slick-disabled")
          .attr("aria-disabled", "false");
      } else if (
        _.currentSlide >= _.slideCount - 1 &&
        _.options.centerMode === true
      ) {
        _.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        _.$prevArrow
          .removeClass("slick-disabled")
          .attr("aria-disabled", "false");
      }
    }
  };

  Slick.prototype.updateDots = function () {
    var _ = this;

    if (_.$dots !== null) {
      _.$dots.find("li").removeClass("slick-active").end();

      _.$dots
        .find("li")
        .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
        .addClass("slick-active");
    }
  };

  Slick.prototype.visibility = function () {
    var _ = this;

    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true;
      } else {
        _.interrupted = false;
      }
    }
  };

  $.fn.slick = function () {
    var _ = this,
      opt = arguments[0],
      args = Array.prototype.slice.call(arguments, 1),
      l = _.length,
      i,
      ret;
    for (i = 0; i < l; i++) {
      if (typeof opt == "object" || typeof opt == "undefined")
        _[i].slick = new Slick(_[i], opt);
      else ret = _[i].slick[opt].apply(_[i].slick, args);
      if (typeof ret != "undefined") return ret;
    }
    return _;
  };
});

/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
(function (r, G, f, v) {
  var J = f("html"),
    n = f(r),
    p = f(G),
    b = (f.fancybox = function () {
      b.open.apply(this, arguments);
    }),
    I = navigator.userAgent.match(/msie/i),
    B = null,
    s = G.createTouch !== v,
    t = function (a) {
      return a && a.hasOwnProperty && a instanceof f;
    },
    q = function (a) {
      return a && "string" === f.type(a);
    },
    E = function (a) {
      return q(a) && 0 < a.indexOf("%");
    },
    l = function (a, d) {
      var e = parseInt(a, 10) || 0;
      d && E(a) && (e *= b.getViewport()[d] / 100);
      return Math.ceil(e);
    },
    w = function (a, b) {
      return l(a, b) + "px";
    };
  f.extend(b, {
    version: "2.1.5",
    defaults: {
      padding: 15,
      margin: 20,
      width: 800,
      height: 600,
      minWidth: 100,
      minHeight: 100,
      maxWidth: 9999,
      maxHeight: 9999,
      pixelRatio: 1,
      autoSize: !0,
      autoHeight: !1,
      autoWidth: !1,
      autoResize: !0,
      autoCenter: !s,
      fitToView: !0,
      aspectRatio: !1,
      topRatio: 0.5,
      leftRatio: 0.5,
      scrolling: "auto",
      wrapCSS: "",
      arrows: !0,
      closeBtn: !0,
      closeClick: !1,
      nextClick: !1,
      mouseWheel: !0,
      autoPlay: !1,
      playSpeed: 3e3,
      preload: 3,
      modal: !1,
      loop: !0,
      ajax: { dataType: "html", headers: { "X-fancyBox": !0 } },
      iframe: { scrolling: "auto", preload: !0 },
      swf: {
        wmode: "transparent",
        allowfullscreen: "true",
        allowscriptaccess: "always",
      },
      keys: {
        next: { 13: "left", 34: "up", 39: "left", 40: "up" },
        prev: { 8: "right", 33: "down", 37: "right", 38: "down" },
        close: [27],
        play: [32],
        toggle: [70],
      },
      direction: { next: "left", prev: "right" },
      scrollOutside: !0,
      index: 0,
      type: null,
      href: null,
      content: null,
      title: null,
      tpl: {
        wrap:
          '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
        image: '<img class="fancybox-image" src="{href}" alt="" />',
        iframe:
          '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' +
          (I ? ' allowtransparency="true"' : "") +
          "></iframe>",
        error:
          '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
        closeBtn:
          '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
        next:
          '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
        prev:
          '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
      },
      openEffect: "fade",
      openSpeed: 250,
      openEasing: "swing",
      openOpacity: !0,
      openMethod: "zoomIn",
      closeEffect: "fade",
      closeSpeed: 250,
      closeEasing: "swing",
      closeOpacity: !0,
      closeMethod: "zoomOut",
      nextEffect: "elastic",
      nextSpeed: 250,
      nextEasing: "swing",
      nextMethod: "changeIn",
      prevEffect: "elastic",
      prevSpeed: 250,
      prevEasing: "swing",
      prevMethod: "changeOut",
      helpers: { overlay: !0, title: !0 },
      onCancel: f.noop,
      beforeLoad: f.noop,
      afterLoad: f.noop,
      beforeShow: f.noop,
      afterShow: f.noop,
      beforeChange: f.noop,
      beforeClose: f.noop,
      afterClose: f.noop,
    },
    group: {},
    opts: {},
    previous: null,
    coming: null,
    current: null,
    isActive: !1,
    isOpen: !1,
    isOpened: !1,
    wrap: null,
    skin: null,
    outer: null,
    inner: null,
    player: { timer: null, isActive: !1 },
    ajaxLoad: null,
    imgPreload: null,
    transitions: {},
    helpers: {},
    open: function (a, d) {
      if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0)))
        return (
          f.isArray(a) || (a = t(a) ? f(a).get() : [a]),
          f.each(a, function (e, c) {
            var k = {},
              g,
              h,
              j,
              m,
              l;
            "object" === f.type(c) &&
              (c.nodeType && (c = f(c)),
              t(c)
                ? ((k = {
                    href: c.data("fancybox-href") || c.attr("href"),
                    title: c.data("fancybox-title") || c.attr("title"),
                    isDom: !0,
                    element: c,
                  }),
                  f.metadata && f.extend(!0, k, c.metadata()))
                : (k = c));
            g = d.href || k.href || (q(c) ? c : null);
            h = d.title !== v ? d.title : k.title || "";
            m = (j = d.content || k.content) ? "html" : d.type || k.type;
            !m &&
              k.isDom &&
              ((m = c.data("fancybox-type")),
              m ||
                (m = (m = c.prop("class").match(/fancybox\.(\w+)/))
                  ? m[1]
                  : null));
            q(g) &&
              (m ||
                (b.isImage(g)
                  ? (m = "image")
                  : b.isSWF(g)
                  ? (m = "swf")
                  : "#" === g.charAt(0)
                  ? (m = "inline")
                  : q(c) && ((m = "html"), (j = c))),
              "ajax" === m &&
                ((l = g.split(/\s+/, 2)), (g = l.shift()), (l = l.shift())));
            j ||
              ("inline" === m
                ? g
                  ? (j = f(q(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g))
                  : k.isDom && (j = c)
                : "html" === m
                ? (j = g)
                : !m && !g && k.isDom && ((m = "inline"), (j = c)));
            f.extend(k, {
              href: g,
              type: m,
              content: j,
              title: h,
              selector: l,
            });
            a[e] = k;
          }),
          (b.opts = f.extend(!0, {}, b.defaults, d)),
          d.keys !== v &&
            (b.opts.keys = d.keys ? f.extend({}, b.defaults.keys, d.keys) : !1),
          (b.group = a),
          b._start(b.opts.index)
        );
    },
    cancel: function () {
      var a = b.coming;
      a &&
        !1 !== b.trigger("onCancel") &&
        (b.hideLoading(),
        b.ajaxLoad && b.ajaxLoad.abort(),
        (b.ajaxLoad = null),
        b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null),
        a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(),
        (b.coming = null),
        b.current || b._afterZoomOut(a));
    },
    close: function (a) {
      b.cancel();
      !1 !== b.trigger("beforeClose") &&
        (b.unbindEvents(),
        b.isActive &&
          (!b.isOpen || !0 === a
            ? (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),
              b._afterZoomOut())
            : ((b.isOpen = b.isOpened = !1),
              (b.isClosing = !0),
              f(".fancybox-item, .fancybox-nav").remove(),
              b.wrap.stop(!0, !0).removeClass("fancybox-opened"),
              b.transitions[b.current.closeMethod]())));
    },
    play: function (a) {
      var d = function () {
          clearTimeout(b.player.timer);
        },
        e = function () {
          d();
          b.current &&
            b.player.isActive &&
            (b.player.timer = setTimeout(b.next, b.current.playSpeed));
        },
        c = function () {
          d();
          p.unbind(".player");
          b.player.isActive = !1;
          b.trigger("onPlayEnd");
        };
      if (!0 === a || (!b.player.isActive && !1 !== a)) {
        if (
          b.current &&
          (b.current.loop || b.current.index < b.group.length - 1)
        )
          (b.player.isActive = !0),
            p.bind({
              "onCancel.player beforeClose.player": c,
              "onUpdate.player": e,
              "beforeLoad.player": d,
            }),
            e(),
            b.trigger("onPlayStart");
      } else c();
    },
    next: function (a) {
      var d = b.current;
      d && (q(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next"));
    },
    prev: function (a) {
      var d = b.current;
      d && (q(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev"));
    },
    jumpto: function (a, d, e) {
      var c = b.current;
      c &&
        ((a = l(a)),
        (b.direction = d || c.direction[a >= c.index ? "next" : "prev"]),
        (b.router = e || "jumpto"),
        c.loop &&
          (0 > a && (a = c.group.length + (a % c.group.length)),
          (a %= c.group.length)),
        c.group[a] !== v && (b.cancel(), b._start(a)));
    },
    reposition: function (a, d) {
      var e = b.current,
        c = e ? e.wrap : null,
        k;
      c &&
        ((k = b._getPosition(d)),
        a && "scroll" === a.type
          ? (delete k.position, c.stop(!0, !0).animate(k, 200))
          : (c.css(k), (e.pos = f.extend({}, e.dim, k))));
    },
    update: function (a) {
      var d = a && a.type,
        e = !d || "orientationchange" === d;
      e && (clearTimeout(B), (B = null));
      b.isOpen &&
        !B &&
        (B = setTimeout(
          function () {
            var c = b.current;
            c &&
              !b.isClosing &&
              (b.wrap.removeClass("fancybox-tmp"),
              (e || "load" === d || ("resize" === d && c.autoResize)) &&
                b._setDimension(),
              ("scroll" === d && c.canShrink) || b.reposition(a),
              b.trigger("onUpdate"),
              (B = null));
          },
          e && !s ? 0 : 300
        ));
    },
    toggle: function (a) {
      b.isOpen &&
        ((b.current.fitToView =
          "boolean" === f.type(a) ? a : !b.current.fitToView),
        s &&
          (b.wrap.removeAttr("style").addClass("fancybox-tmp"),
          b.trigger("onUpdate")),
        b.update());
    },
    hideLoading: function () {
      p.unbind(".loading");
      f("#fancybox-loading").remove();
    },
    showLoading: function () {
      var a, d;
      b.hideLoading();
      a = f('<div id="fancybox-loading"><div></div></div>')
        .click(b.cancel)
        .appendTo("body");
      p.bind("keydown.loading", function (a) {
        if (27 === (a.which || a.keyCode)) a.preventDefault(), b.cancel();
      });
      b.defaults.fixed ||
        ((d = b.getViewport()),
        a.css({
          position: "absolute",
          top: 0.5 * d.h + d.y,
          left: 0.5 * d.w + d.x,
        }));
    },
    getViewport: function () {
      var a = (b.current && b.current.locked) || !1,
        d = { x: n.scrollLeft(), y: n.scrollTop() };
      a
        ? ((d.w = a[0].clientWidth), (d.h = a[0].clientHeight))
        : ((d.w = s && r.innerWidth ? r.innerWidth : n.width()),
          (d.h = s && r.innerHeight ? r.innerHeight : n.height()));
      return d;
    },
    unbindEvents: function () {
      b.wrap && t(b.wrap) && b.wrap.unbind(".fb");
      p.unbind(".fb");
      n.unbind(".fb");
    },
    bindEvents: function () {
      var a = b.current,
        d;
      a &&
        (n.bind(
          "orientationchange.fb" +
            (s ? "" : " resize.fb") +
            (a.autoCenter && !a.locked ? " scroll.fb" : ""),
          b.update
        ),
        (d = a.keys) &&
          p.bind("keydown.fb", function (e) {
            var c = e.which || e.keyCode,
              k = e.target || e.srcElement;
            if (27 === c && b.coming) return !1;
            !e.ctrlKey &&
              !e.altKey &&
              !e.shiftKey &&
              !e.metaKey &&
              (!k || (!k.type && !f(k).is("[contenteditable]"))) &&
              f.each(d, function (d, k) {
                if (1 < a.group.length && k[c] !== v)
                  return b[d](k[c]), e.preventDefault(), !1;
                if (-1 < f.inArray(c, k)) return b[d](), e.preventDefault(), !1;
              });
          }),
        f.fn.mousewheel &&
          a.mouseWheel &&
          b.wrap.bind("mousewheel.fb", function (d, c, k, g) {
            for (
              var h = f(d.target || null), j = !1;
              h.length &&
              !j &&
              !h.is(".fancybox-skin") &&
              !h.is(".fancybox-wrap");

            )
              (j =
                h[0] &&
                !(h[0].style.overflow && "hidden" === h[0].style.overflow) &&
                ((h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth) ||
                  (h[0].clientHeight &&
                    h[0].scrollHeight > h[0].clientHeight))),
                (h = f(h).parent());
            if (0 !== c && !j && 1 < b.group.length && !a.canShrink) {
              if (0 < g || 0 < k) b.prev(0 < g ? "down" : "left");
              else if (0 > g || 0 > k) b.next(0 > g ? "up" : "right");
              d.preventDefault();
            }
          }));
    },
    trigger: function (a, d) {
      var e,
        c = d || b.coming || b.current;
      if (c) {
        f.isFunction(c[a]) &&
          (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1)));
        if (!1 === e) return !1;
        c.helpers &&
          f.each(c.helpers, function (d, e) {
            if (e && b.helpers[d] && f.isFunction(b.helpers[d][a]))
              b.helpers[d][a](f.extend(!0, {}, b.helpers[d].defaults, e), c);
          });
        p.trigger(a);
      }
    },
    isImage: function (a) {
      return (
        q(a) &&
        a.match(
          /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i
        )
      );
    },
    isSWF: function (a) {
      return q(a) && a.match(/\.(swf)((\?|#).*)?$/i);
    },
    _start: function (a) {
      var d = {},
        e,
        c;
      a = l(a);
      e = b.group[a] || null;
      if (!e) return !1;
      d = f.extend(!0, {}, b.opts, e);
      e = d.margin;
      c = d.padding;
      "number" === f.type(e) && (d.margin = [e, e, e, e]);
      "number" === f.type(c) && (d.padding = [c, c, c, c]);
      d.modal &&
        f.extend(!0, d, {
          closeBtn: !1,
          closeClick: !1,
          nextClick: !1,
          arrows: !1,
          mouseWheel: !1,
          keys: null,
          helpers: { overlay: { closeClick: !1 } },
        });
      d.autoSize && (d.autoWidth = d.autoHeight = !0);
      "auto" === d.width && (d.autoWidth = !0);
      "auto" === d.height && (d.autoHeight = !0);
      d.group = b.group;
      d.index = a;
      b.coming = d;
      if (!1 === b.trigger("beforeLoad")) b.coming = null;
      else {
        c = d.type;
        e = d.href;
        if (!c)
          return (
            (b.coming = null),
            b.current && b.router && "jumpto" !== b.router
              ? ((b.current.index = a), b[b.router](b.direction))
              : !1
          );
        b.isActive = !0;
        if ("image" === c || "swf" === c)
          (d.autoHeight = d.autoWidth = !1), (d.scrolling = "visible");
        "image" === c && (d.aspectRatio = !0);
        "iframe" === c && s && (d.scrolling = "scroll");
        d.wrap = f(d.tpl.wrap)
          .addClass(
            "fancybox-" +
              (s ? "mobile" : "desktop") +
              " fancybox-type-" +
              c +
              " fancybox-tmp " +
              d.wrapCSS
          )
          .appendTo(d.parent || "body");
        f.extend(d, {
          skin: f(".fancybox-skin", d.wrap),
          outer: f(".fancybox-outer", d.wrap),
          inner: f(".fancybox-inner", d.wrap),
        });
        f.each(["Top", "Right", "Bottom", "Left"], function (a, b) {
          d.skin.css("padding" + b, w(d.padding[a]));
        });
        b.trigger("onReady");
        if ("inline" === c || "html" === c) {
          if (!d.content || !d.content.length) return b._error("content");
        } else if (!e) return b._error("href");
        "image" === c
          ? b._loadImage()
          : "ajax" === c
          ? b._loadAjax()
          : "iframe" === c
          ? b._loadIframe()
          : b._afterLoad();
      }
    },
    _error: function (a) {
      f.extend(b.coming, {
        type: "html",
        autoWidth: !0,
        autoHeight: !0,
        minWidth: 0,
        minHeight: 0,
        scrolling: "no",
        hasError: a,
        content: b.coming.tpl.error,
      });
      b._afterLoad();
    },
    _loadImage: function () {
      var a = (b.imgPreload = new Image());
      a.onload = function () {
        this.onload = this.onerror = null;
        b.coming.width = this.width / b.opts.pixelRatio;
        b.coming.height = this.height / b.opts.pixelRatio;
        b._afterLoad();
      };
      a.onerror = function () {
        this.onload = this.onerror = null;
        b._error("image");
      };
      a.src = b.coming.href;
      !0 !== a.complete && b.showLoading();
    },
    _loadAjax: function () {
      var a = b.coming;
      b.showLoading();
      b.ajaxLoad = f.ajax(
        f.extend({}, a.ajax, {
          url: a.href,
          error: function (a, e) {
            b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading();
          },
          success: function (d, e) {
            "success" === e && ((a.content = d), b._afterLoad());
          },
        })
      );
    },
    _loadIframe: function () {
      var a = b.coming,
        d = f(a.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
          .attr("scrolling", s ? "auto" : a.iframe.scrolling)
          .attr("src", a.href);
      f(a.wrap).bind("onReset", function () {
        try {
          f(this)
            .find("iframe")
            .hide()
            .attr("src", "//about:blank")
            .end()
            .empty();
        } catch (a) {}
      });
      a.iframe.preload &&
        (b.showLoading(),
        d.one("load", function () {
          f(this).data("ready", 1);
          s || f(this).bind("load.fb", b.update);
          f(this)
            .parents(".fancybox-wrap")
            .width("100%")
            .removeClass("fancybox-tmp")
            .show();
          b._afterLoad();
        }));
      a.content = d.appendTo(a.inner);
      a.iframe.preload || b._afterLoad();
    },
    _preloadImages: function () {
      var a = b.group,
        d = b.current,
        e = a.length,
        c = d.preload ? Math.min(d.preload, e - 1) : 0,
        f,
        g;
      for (g = 1; g <= c; g += 1)
        (f = a[(d.index + g) % e]),
          "image" === f.type && f.href && (new Image().src = f.href);
    },
    _afterLoad: function () {
      var a = b.coming,
        d = b.current,
        e,
        c,
        k,
        g,
        h;
      b.hideLoading();
      if (a && !1 !== b.isActive)
        if (!1 === b.trigger("afterLoad", a, d))
          a.wrap.stop(!0).trigger("onReset").remove(), (b.coming = null);
        else {
          d &&
            (b.trigger("beforeChange", d),
            d.wrap
              .stop(!0)
              .removeClass("fancybox-opened")
              .find(".fancybox-item, .fancybox-nav")
              .remove());
          b.unbindEvents();
          e = a.content;
          c = a.type;
          k = a.scrolling;
          f.extend(b, {
            wrap: a.wrap,
            skin: a.skin,
            outer: a.outer,
            inner: a.inner,
            current: a,
            previous: d,
          });
          g = a.href;
          switch (c) {
            case "inline":
            case "ajax":
            case "html":
              a.selector
                ? (e = f("<div>").html(e).find(a.selector))
                : t(e) &&
                  (e.data("fancybox-placeholder") ||
                    e.data(
                      "fancybox-placeholder",
                      f('<div class="fancybox-placeholder"></div>')
                        .insertAfter(e)
                        .hide()
                    ),
                  (e = e.show().detach()),
                  a.wrap.bind("onReset", function () {
                    f(this).find(e).length &&
                      e
                        .hide()
                        .replaceAll(e.data("fancybox-placeholder"))
                        .data("fancybox-placeholder", !1);
                  }));
              break;
            case "image":
              e = a.tpl.image.replace("{href}", g);
              break;
            case "swf":
              (e =
                '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' +
                g +
                '"></param>'),
                (h = ""),
                f.each(a.swf, function (a, b) {
                  e += '<param name="' + a + '" value="' + b + '"></param>';
                  h += " " + a + '="' + b + '"';
                }),
                (e +=
                  '<embed src="' +
                  g +
                  '" type="application/x-shockwave-flash" width="100%" height="100%"' +
                  h +
                  "></embed></object>");
          }
          (!t(e) || !e.parent().is(a.inner)) && a.inner.append(e);
          b.trigger("beforeShow");
          a.inner.css(
            "overflow",
            "yes" === k ? "scroll" : "no" === k ? "hidden" : k
          );
          b._setDimension();
          b.reposition();
          b.isOpen = !1;
          b.coming = null;
          b.bindEvents();
          if (b.isOpened) {
            if (d.prevMethod) b.transitions[d.prevMethod]();
          } else
            f(".fancybox-wrap")
              .not(a.wrap)
              .stop(!0)
              .trigger("onReset")
              .remove();
          b.transitions[b.isOpened ? a.nextMethod : a.openMethod]();
          b._preloadImages();
        }
    },
    _setDimension: function () {
      var a = b.getViewport(),
        d = 0,
        e = !1,
        c = !1,
        e = b.wrap,
        k = b.skin,
        g = b.inner,
        h = b.current,
        c = h.width,
        j = h.height,
        m = h.minWidth,
        u = h.minHeight,
        n = h.maxWidth,
        p = h.maxHeight,
        s = h.scrolling,
        q = h.scrollOutside ? h.scrollbarWidth : 0,
        x = h.margin,
        y = l(x[1] + x[3]),
        r = l(x[0] + x[2]),
        v,
        z,
        t,
        C,
        A,
        F,
        B,
        D,
        H;
      e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");
      x = l(k.outerWidth(!0) - k.width());
      v = l(k.outerHeight(!0) - k.height());
      z = y + x;
      t = r + v;
      C = E(c) ? ((a.w - z) * l(c)) / 100 : c;
      A = E(j) ? ((a.h - t) * l(j)) / 100 : j;
      if ("iframe" === h.type) {
        if (((H = h.content), h.autoHeight && 1 === H.data("ready")))
          try {
            H[0].contentWindow.document.location &&
              (g.width(C).height(9999),
              (F = H.contents().find("body")),
              q && F.css("overflow-x", "hidden"),
              (A = F.outerHeight(!0)));
          } catch (G) {}
      } else if (h.autoWidth || h.autoHeight)
        g.addClass("fancybox-tmp"),
          h.autoWidth || g.width(C),
          h.autoHeight || g.height(A),
          h.autoWidth && (C = g.width()),
          h.autoHeight && (A = g.height()),
          g.removeClass("fancybox-tmp");
      c = l(C);
      j = l(A);
      D = C / A;
      m = l(E(m) ? l(m, "w") - z : m);
      n = l(E(n) ? l(n, "w") - z : n);
      u = l(E(u) ? l(u, "h") - t : u);
      p = l(E(p) ? l(p, "h") - t : p);
      F = n;
      B = p;
      h.fitToView && ((n = Math.min(a.w - z, n)), (p = Math.min(a.h - t, p)));
      z = a.w - y;
      r = a.h - r;
      h.aspectRatio
        ? (c > n && ((c = n), (j = l(c / D))),
          j > p && ((j = p), (c = l(j * D))),
          c < m && ((c = m), (j = l(c / D))),
          j < u && ((j = u), (c = l(j * D))))
        : ((c = Math.max(m, Math.min(c, n))),
          h.autoHeight && "iframe" !== h.type && (g.width(c), (j = g.height())),
          (j = Math.max(u, Math.min(j, p))));
      if (h.fitToView)
        if (
          (g.width(c).height(j),
          e.width(c + x),
          (a = e.width()),
          (y = e.height()),
          h.aspectRatio)
        )
          for (; (a > z || y > r) && c > m && j > u && !(19 < d++); )
            (j = Math.max(u, Math.min(p, j - 10))),
              (c = l(j * D)),
              c < m && ((c = m), (j = l(c / D))),
              c > n && ((c = n), (j = l(c / D))),
              g.width(c).height(j),
              e.width(c + x),
              (a = e.width()),
              (y = e.height());
        else
          (c = Math.max(m, Math.min(c, c - (a - z)))),
            (j = Math.max(u, Math.min(j, j - (y - r))));
      q && "auto" === s && j < A && c + x + q < z && (c += q);
      g.width(c).height(j);
      e.width(c + x);
      a = e.width();
      y = e.height();
      e = (a > z || y > r) && c > m && j > u;
      c = h.aspectRatio
        ? c < F && j < B && c < C && j < A
        : (c < F || j < B) && (c < C || j < A);
      f.extend(h, {
        dim: { width: w(a), height: w(y) },
        origWidth: C,
        origHeight: A,
        canShrink: e,
        canExpand: c,
        wPadding: x,
        hPadding: v,
        wrapSpace: y - k.outerHeight(!0),
        skinSpace: k.height() - j,
      });
      !H && h.autoHeight && j > u && j < p && !c && g.height("auto");
    },
    _getPosition: function (a) {
      var d = b.current,
        e = b.getViewport(),
        c = d.margin,
        f = b.wrap.width() + c[1] + c[3],
        g = b.wrap.height() + c[0] + c[2],
        c = { position: "absolute", top: c[0], left: c[3] };
      d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w
        ? (c.position = "fixed")
        : d.locked || ((c.top += e.y), (c.left += e.x));
      c.top = w(Math.max(c.top, c.top + (e.h - g) * d.topRatio));
      c.left = w(Math.max(c.left, c.left + (e.w - f) * d.leftRatio));
      return c;
    },
    _afterZoomIn: function () {
      var a = b.current;
      a &&
        ((b.isOpen = b.isOpened = !0),
        b.wrap.css("overflow", "visible").addClass("fancybox-opened"),
        b.update(),
        (a.closeClick || (a.nextClick && 1 < b.group.length)) &&
          b.inner.css("cursor", "pointer").bind("click.fb", function (d) {
            !f(d.target).is("a") &&
              !f(d.target).parent().is("a") &&
              (d.preventDefault(), b[a.closeClick ? "close" : "next"]());
          }),
        a.closeBtn &&
          f(a.tpl.closeBtn)
            .appendTo(b.skin)
            .bind("click.fb", function (a) {
              a.preventDefault();
              b.close();
            }),
        a.arrows &&
          1 < b.group.length &&
          ((a.loop || 0 < a.index) &&
            f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev),
          (a.loop || a.index < b.group.length - 1) &&
            f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)),
        b.trigger("afterShow"),
        !a.loop && a.index === a.group.length - 1
          ? b.play(!1)
          : b.opts.autoPlay &&
            !b.player.isActive &&
            ((b.opts.autoPlay = !1), b.play()));
    },
    _afterZoomOut: function (a) {
      a = a || b.current;
      f(".fancybox-wrap").trigger("onReset").remove();
      f.extend(b, {
        group: {},
        opts: {},
        router: !1,
        current: null,
        isActive: !1,
        isOpened: !1,
        isOpen: !1,
        isClosing: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
      });
      b.trigger("afterClose", a);
    },
  });
  b.transitions = {
    getOrigPosition: function () {
      var a = b.current,
        d = a.element,
        e = a.orig,
        c = {},
        f = 50,
        g = 50,
        h = a.hPadding,
        j = a.wPadding,
        m = b.getViewport();
      !e &&
        a.isDom &&
        d.is(":visible") &&
        ((e = d.find("img:first")), e.length || (e = d));
      t(e)
        ? ((c = e.offset()),
          e.is("img") && ((f = e.outerWidth()), (g = e.outerHeight())))
        : ((c.top = m.y + (m.h - g) * a.topRatio),
          (c.left = m.x + (m.w - f) * a.leftRatio));
      if ("fixed" === b.wrap.css("position") || a.locked)
        (c.top -= m.y), (c.left -= m.x);
      return (c = {
        top: w(c.top - h * a.topRatio),
        left: w(c.left - j * a.leftRatio),
        width: w(f + j),
        height: w(g + h),
      });
    },
    step: function (a, d) {
      var e,
        c,
        f = d.prop;
      c = b.current;
      var g = c.wrapSpace,
        h = c.skinSpace;
      if ("width" === f || "height" === f)
        (e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start)),
          b.isClosing && (e = 1 - e),
          (c = "width" === f ? c.wPadding : c.hPadding),
          (c = a - c),
          b.skin[f](l("width" === f ? c : c - g * e)),
          b.inner[f](l("width" === f ? c : c - g * e - h * e));
    },
    zoomIn: function () {
      var a = b.current,
        d = a.pos,
        e = a.openEffect,
        c = "elastic" === e,
        k = f.extend({ opacity: 1 }, d);
      delete k.position;
      c
        ? ((d = this.getOrigPosition()), a.openOpacity && (d.opacity = 0.1))
        : "fade" === e && (d.opacity = 0.1);
      b.wrap.css(d).animate(k, {
        duration: "none" === e ? 0 : a.openSpeed,
        easing: a.openEasing,
        step: c ? this.step : null,
        complete: b._afterZoomIn,
      });
    },
    zoomOut: function () {
      var a = b.current,
        d = a.closeEffect,
        e = "elastic" === d,
        c = { opacity: 0.1 };
      e && ((c = this.getOrigPosition()), a.closeOpacity && (c.opacity = 0.1));
      b.wrap.animate(c, {
        duration: "none" === d ? 0 : a.closeSpeed,
        easing: a.closeEasing,
        step: e ? this.step : null,
        complete: b._afterZoomOut,
      });
    },
    changeIn: function () {
      var a = b.current,
        d = a.nextEffect,
        e = a.pos,
        c = { opacity: 1 },
        f = b.direction,
        g;
      e.opacity = 0.1;
      "elastic" === d &&
        ((g = "down" === f || "up" === f ? "top" : "left"),
        "down" === f || "right" === f
          ? ((e[g] = w(l(e[g]) - 200)), (c[g] = "+=200px"))
          : ((e[g] = w(l(e[g]) + 200)), (c[g] = "-=200px")));
      "none" === d
        ? b._afterZoomIn()
        : b.wrap.css(e).animate(c, {
            duration: a.nextSpeed,
            easing: a.nextEasing,
            complete: b._afterZoomIn,
          });
    },
    changeOut: function () {
      var a = b.previous,
        d = a.prevEffect,
        e = { opacity: 0.1 },
        c = b.direction;
      "elastic" === d &&
        (e["down" === c || "up" === c ? "top" : "left"] =
          ("up" === c || "left" === c ? "-" : "+") + "=200px");
      a.wrap.animate(e, {
        duration: "none" === d ? 0 : a.prevSpeed,
        easing: a.prevEasing,
        complete: function () {
          f(this).trigger("onReset").remove();
        },
      });
    },
  };
  b.helpers.overlay = {
    defaults: {
      closeClick: !0,
      speedOut: 200,
      showEarly: !0,
      css: {},
      locked: !s,
      fixed: !0,
    },
    overlay: null,
    fixed: !1,
    el: f("html"),
    create: function (a) {
      a = f.extend({}, this.defaults, a);
      this.overlay && this.close();
      this.overlay = f('<div class="fancybox-overlay"></div>').appendTo(
        b.coming ? b.coming.parent : a.parent
      );
      this.fixed = !1;
      a.fixed &&
        b.defaults.fixed &&
        (this.overlay.addClass("fancybox-overlay-fixed"), (this.fixed = !0));
    },
    open: function (a) {
      var d = this;
      a = f.extend({}, this.defaults, a);
      this.overlay
        ? this.overlay.unbind(".overlay").width("auto").height("auto")
        : this.create(a);
      this.fixed ||
        (n.bind("resize.overlay", f.proxy(this.update, this)), this.update());
      a.closeClick &&
        this.overlay.bind("click.overlay", function (a) {
          if (f(a.target).hasClass("fancybox-overlay"))
            return b.isActive ? b.close() : d.close(), !1;
        });
      this.overlay.css(a.css).show();
    },
    close: function () {
      var a, b;
      n.unbind("resize.overlay");
      this.el.hasClass("fancybox-lock") &&
        (f(".fancybox-margin").removeClass("fancybox-margin"),
        (a = n.scrollTop()),
        (b = n.scrollLeft()),
        this.el.removeClass("fancybox-lock"),
        n.scrollTop(a).scrollLeft(b));
      f(".fancybox-overlay").remove().hide();
      f.extend(this, { overlay: null, fixed: !1 });
    },
    update: function () {
      var a = "100%",
        b;
      this.overlay.width(a).height("100%");
      I
        ? ((b = Math.max(G.documentElement.offsetWidth, G.body.offsetWidth)),
          p.width() > b && (a = p.width()))
        : p.width() > n.width() && (a = p.width());
      this.overlay.width(a).height(p.height());
    },
    onReady: function (a, b) {
      var e = this.overlay;
      f(".fancybox-overlay").stop(!0, !0);
      e || this.create(a);
      a.locked &&
        this.fixed &&
        b.fixed &&
        (e ||
          (this.margin =
            p.height() > n.height()
              ? f("html").css("margin-right").replace("px", "")
              : !1),
        (b.locked = this.overlay.append(b.wrap)),
        (b.fixed = !1));
      !0 === a.showEarly && this.beforeShow.apply(this, arguments);
    },
    beforeShow: function (a, b) {
      var e, c;
      b.locked &&
        (!1 !== this.margin &&
          (f("*")
            .filter(function () {
              return (
                "fixed" === f(this).css("position") &&
                !f(this).hasClass("fancybox-overlay") &&
                !f(this).hasClass("fancybox-wrap")
              );
            })
            .addClass("fancybox-margin"),
          this.el.addClass("fancybox-margin")),
        (e = n.scrollTop()),
        (c = n.scrollLeft()),
        this.el.addClass("fancybox-lock"),
        n.scrollTop(e).scrollLeft(c));
      this.open(a);
    },
    onUpdate: function () {
      this.fixed || this.update();
    },
    afterClose: function (a) {
      this.overlay &&
        !b.coming &&
        this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this));
    },
  };
  b.helpers.title = {
    defaults: { type: "float", position: "bottom" },
    beforeShow: function (a) {
      var d = b.current,
        e = d.title,
        c = a.type;
      f.isFunction(e) && (e = e.call(d.element, d));
      if (q(e) && "" !== f.trim(e)) {
        d = f(
          '<div class="fancybox-title fancybox-title-' +
            c +
            '-wrap">' +
            e +
            "</div>"
        );
        switch (c) {
          case "inside":
            c = b.skin;
            break;
          case "outside":
            c = b.wrap;
            break;
          case "over":
            c = b.inner;
            break;
          default:
            (c = b.skin),
              d.appendTo("body"),
              I && d.width(d.width()),
              d.wrapInner('<span class="child"></span>'),
              (b.current.margin[2] += Math.abs(l(d.css("margin-bottom"))));
        }
        d["top" === a.position ? "prependTo" : "appendTo"](c);
      }
    },
  };
  f.fn.fancybox = function (a) {
    var d,
      e = f(this),
      c = this.selector || "",
      k = function (g) {
        var h = f(this).blur(),
          j = d,
          k,
          l;
        !g.ctrlKey &&
          !g.altKey &&
          !g.shiftKey &&
          !g.metaKey &&
          !h.is(".fancybox-wrap") &&
          ((k = a.groupAttr || "data-fancybox-group"),
          (l = h.attr(k)),
          l || ((k = "rel"), (l = h.get(0)[k])),
          l &&
            "" !== l &&
            "nofollow" !== l &&
            ((h = c.length ? f(c) : e),
            (h = h.filter("[" + k + '="' + l + '"]')),
            (j = h.index(this))),
          (a.index = j),
          !1 !== b.open(h, a) && g.preventDefault());
      };
    a = a || {};
    d = a.index || 0;
    !c || !1 === a.live
      ? e.unbind("click.fb-start").bind("click.fb-start", k)
      : p
          .undelegate(c, "click.fb-start")
          .delegate(
            c + ":not('.fancybox-item, .fancybox-nav')",
            "click.fb-start",
            k
          );
    this.filter("[data-fancybox-start=1]").trigger("click");
    return this;
  };
  p.ready(function () {
    var a, d;
    f.scrollbarWidth === v &&
      (f.scrollbarWidth = function () {
        var a = f(
            '<div style="width:50px;height:50px;overflow:auto"><div/></div>'
          ).appendTo("body"),
          b = a.children(),
          b = b.innerWidth() - b.height(99).innerWidth();
        a.remove();
        return b;
      });
    if (f.support.fixedPosition === v) {
      a = f.support;
      d = f('<div style="position:fixed;top:20px;"></div>').appendTo("body");
      var e = 20 === d[0].offsetTop || 15 === d[0].offsetTop;
      d.remove();
      a.fixedPosition = e;
    }
    f.extend(b.defaults, {
      scrollbarWidth: f.scrollbarWidth(),
      fixed: f.support.fixedPosition,
      parent: f("body"),
    });
    a = f(r).width();
    J.addClass("fancybox-lock-test");
    d = f(r).width();
    J.removeClass("fancybox-lock-test");
    f(
      "<style type='text/css'>.fancybox-margin{margin-right:" +
        (d - a) +
        "px;}</style>"
    ).appendTo("head");
  });
})(window, document, jQuery);

/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if ("undefined" == typeof jQuery)
  throw new Error("Bootstrap's JavaScript requires jQuery");
+(function (a) {
  "use strict";
  var b = a.fn.jquery.split(" ")[0].split(".");
  if ((b[0] < 2 && b[1] < 9) || (1 == b[0] && 9 == b[1] && b[2] < 1))
    throw new Error(
      "Bootstrap's JavaScript requires jQuery version 1.9.1 or higher"
    );
})(jQuery),
  +(function (a) {
    "use strict";
    function b() {
      var a = document.createElement("bootstrap"),
        b = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend",
        };
      for (var c in b) if (void 0 !== a.style[c]) return { end: b[c] };
      return !1;
    }
    (a.fn.emulateTransitionEnd = function (b) {
      var c = !1,
        d = this;
      a(this).one("bsTransitionEnd", function () {
        c = !0;
      });
      var e = function () {
        c || a(d).trigger(a.support.transition.end);
      };
      return setTimeout(e, b), this;
    }),
      a(function () {
        (a.support.transition = b()),
          a.support.transition &&
            (a.event.special.bsTransitionEnd = {
              bindType: a.support.transition.end,
              delegateType: a.support.transition.end,
              handle: function (b) {
                return a(b.target).is(this)
                  ? b.handleObj.handler.apply(this, arguments)
                  : void 0;
              },
            });
      });
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var c = a(this),
          e = c.data("bs.alert");
        e || c.data("bs.alert", (e = new d(this))),
          "string" == typeof b && e[b].call(c);
      });
    }
    var c = '[data-dismiss="alert"]',
      d = function (b) {
        a(b).on("click", c, this.close);
      };
    (d.VERSION = "3.3.5"),
      (d.TRANSITION_DURATION = 150),
      (d.prototype.close = function (b) {
        function c() {
          g.detach().trigger("closed.bs.alert").remove();
        }
        var e = a(this),
          f = e.attr("data-target");
        f || ((f = e.attr("href")), (f = f && f.replace(/.*(?=#[^\s]*$)/, "")));
        var g = a(f);
        b && b.preventDefault(),
          g.length || (g = e.closest(".alert")),
          g.trigger((b = a.Event("close.bs.alert"))),
          b.isDefaultPrevented() ||
            (g.removeClass("in"),
            a.support.transition && g.hasClass("fade")
              ? g
                  .one("bsTransitionEnd", c)
                  .emulateTransitionEnd(d.TRANSITION_DURATION)
              : c());
      });
    var e = a.fn.alert;
    (a.fn.alert = b),
      (a.fn.alert.Constructor = d),
      (a.fn.alert.noConflict = function () {
        return (a.fn.alert = e), this;
      }),
      a(document).on("click.bs.alert.data-api", c, d.prototype.close);
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.button"),
          f = "object" == typeof b && b;
        e || d.data("bs.button", (e = new c(this, f))),
          "toggle" == b ? e.toggle() : b && e.setState(b);
      });
    }
    var c = function (b, d) {
      (this.$element = a(b)),
        (this.options = a.extend({}, c.DEFAULTS, d)),
        (this.isLoading = !1);
    };
    (c.VERSION = "3.3.5"),
      (c.DEFAULTS = { loadingText: "loading..." }),
      (c.prototype.setState = function (b) {
        var c = "disabled",
          d = this.$element,
          e = d.is("input") ? "val" : "html",
          f = d.data();
        (b += "Text"),
          null == f.resetText && d.data("resetText", d[e]()),
          setTimeout(
            a.proxy(function () {
              d[e](null == f[b] ? this.options[b] : f[b]),
                "loadingText" == b
                  ? ((this.isLoading = !0), d.addClass(c).attr(c, c))
                  : this.isLoading &&
                    ((this.isLoading = !1), d.removeClass(c).removeAttr(c));
            }, this),
            0
          );
      }),
      (c.prototype.toggle = function () {
        var a = !0,
          b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
          var c = this.$element.find("input");
          "radio" == c.prop("type")
            ? (c.prop("checked") && (a = !1),
              b.find(".active").removeClass("active"),
              this.$element.addClass("active"))
            : "checkbox" == c.prop("type") &&
              (c.prop("checked") !== this.$element.hasClass("active") &&
                (a = !1),
              this.$element.toggleClass("active")),
            c.prop("checked", this.$element.hasClass("active")),
            a && c.trigger("change");
        } else
          this.$element.attr("aria-pressed", !this.$element.hasClass("active")),
            this.$element.toggleClass("active");
      });
    var d = a.fn.button;
    (a.fn.button = b),
      (a.fn.button.Constructor = c),
      (a.fn.button.noConflict = function () {
        return (a.fn.button = d), this;
      }),
      a(document)
        .on("click.bs.button.data-api", '[data-toggle^="button"]', function (
          c
        ) {
          var d = a(c.target);
          d.hasClass("btn") || (d = d.closest(".btn")),
            b.call(d, "toggle"),
            a(c.target).is('input[type="radio"]') ||
              a(c.target).is('input[type="checkbox"]') ||
              c.preventDefault();
        })
        .on(
          "focus.bs.button.data-api blur.bs.button.data-api",
          '[data-toggle^="button"]',
          function (b) {
            a(b.target)
              .closest(".btn")
              .toggleClass("focus", /^focus(in)?$/.test(b.type));
          }
        );
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.carousel"),
          f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
          g = "string" == typeof b ? b : f.slide;
        e || d.data("bs.carousel", (e = new c(this, f))),
          "number" == typeof b
            ? e.to(b)
            : g
            ? e[g]()
            : f.interval && e.pause().cycle();
      });
    }
    var c = function (b, c) {
      (this.$element = a(b)),
        (this.$indicators = this.$element.find(".carousel-indicators")),
        (this.options = c),
        (this.paused = null),
        (this.sliding = null),
        (this.interval = null),
        (this.$active = null),
        (this.$items = null),
        this.options.keyboard &&
          this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)),
        "hover" == this.options.pause &&
          !("ontouchstart" in document.documentElement) &&
          this.$element
            .on("mouseenter.bs.carousel", a.proxy(this.pause, this))
            .on("mouseleave.bs.carousel", a.proxy(this.cycle, this));
    };
    (c.VERSION = "3.3.5"),
      (c.TRANSITION_DURATION = 600),
      (c.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0, keyboard: !0 }),
      (c.prototype.keydown = function (a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
          switch (a.which) {
            case 37:
              this.prev();
              break;
            case 39:
              this.next();
              break;
            default:
              return;
          }
          a.preventDefault();
        }
      }),
      (c.prototype.cycle = function (b) {
        return (
          b || (this.paused = !1),
          this.interval && clearInterval(this.interval),
          this.options.interval &&
            !this.paused &&
            (this.interval = setInterval(
              a.proxy(this.next, this),
              this.options.interval
            )),
          this
        );
      }),
      (c.prototype.getItemIndex = function (a) {
        return (
          (this.$items = a.parent().children(".item")),
          this.$items.index(a || this.$active)
        );
      }),
      (c.prototype.getItemForDirection = function (a, b) {
        var c = this.getItemIndex(b),
          d =
            ("prev" == a && 0 === c) ||
            ("next" == a && c == this.$items.length - 1);
        if (d && !this.options.wrap) return b;
        var e = "prev" == a ? -1 : 1,
          f = (c + e) % this.$items.length;
        return this.$items.eq(f);
      }),
      (c.prototype.to = function (a) {
        var b = this,
          c = this.getItemIndex(
            (this.$active = this.$element.find(".item.active"))
          );
        return a > this.$items.length - 1 || 0 > a
          ? void 0
          : this.sliding
          ? this.$element.one("slid.bs.carousel", function () {
              b.to(a);
            })
          : c == a
          ? this.pause().cycle()
          : this.slide(a > c ? "next" : "prev", this.$items.eq(a));
      }),
      (c.prototype.pause = function (b) {
        return (
          b || (this.paused = !0),
          this.$element.find(".next, .prev").length &&
            a.support.transition &&
            (this.$element.trigger(a.support.transition.end), this.cycle(!0)),
          (this.interval = clearInterval(this.interval)),
          this
        );
      }),
      (c.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next");
      }),
      (c.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev");
      }),
      (c.prototype.slide = function (b, d) {
        var e = this.$element.find(".item.active"),
          f = d || this.getItemForDirection(b, e),
          g = this.interval,
          h = "next" == b ? "left" : "right",
          i = this;
        if (f.hasClass("active")) return (this.sliding = !1);
        var j = f[0],
          k = a.Event("slide.bs.carousel", { relatedTarget: j, direction: h });
        if ((this.$element.trigger(k), !k.isDefaultPrevented())) {
          if (
            ((this.sliding = !0), g && this.pause(), this.$indicators.length)
          ) {
            this.$indicators.find(".active").removeClass("active");
            var l = a(this.$indicators.children()[this.getItemIndex(f)]);
            l && l.addClass("active");
          }
          var m = a.Event("slid.bs.carousel", {
            relatedTarget: j,
            direction: h,
          });
          return (
            a.support.transition && this.$element.hasClass("slide")
              ? (f.addClass(b),
                f[0].offsetWidth,
                e.addClass(h),
                f.addClass(h),
                e
                  .one("bsTransitionEnd", function () {
                    f.removeClass([b, h].join(" ")).addClass("active"),
                      e.removeClass(["active", h].join(" ")),
                      (i.sliding = !1),
                      setTimeout(function () {
                        i.$element.trigger(m);
                      }, 0);
                  })
                  .emulateTransitionEnd(c.TRANSITION_DURATION))
              : (e.removeClass("active"),
                f.addClass("active"),
                (this.sliding = !1),
                this.$element.trigger(m)),
            g && this.cycle(),
            this
          );
        }
      });
    var d = a.fn.carousel;
    (a.fn.carousel = b),
      (a.fn.carousel.Constructor = c),
      (a.fn.carousel.noConflict = function () {
        return (a.fn.carousel = d), this;
      });
    var e = function (c) {
      var d,
        e = a(this),
        f = a(
          e.attr("data-target") ||
            ((d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""))
        );
      if (f.hasClass("carousel")) {
        var g = a.extend({}, f.data(), e.data()),
          h = e.attr("data-slide-to");
        h && (g.interval = !1),
          b.call(f, g),
          h && f.data("bs.carousel").to(h),
          c.preventDefault();
      }
    };
    a(document)
      .on("click.bs.carousel.data-api", "[data-slide]", e)
      .on("click.bs.carousel.data-api", "[data-slide-to]", e),
      a(window).on("load", function () {
        a('[data-ride="carousel"]').each(function () {
          var c = a(this);
          b.call(c, c.data());
        });
      });
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      var c,
        d =
          b.attr("data-target") ||
          ((c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""));
      return a(d);
    }
    function c(b) {
      return this.each(function () {
        var c = a(this),
          e = c.data("bs.collapse"),
          f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
        !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1),
          e || c.data("bs.collapse", (e = new d(this, f))),
          "string" == typeof b && e[b]();
      });
    }
    var d = function (b, c) {
      (this.$element = a(b)),
        (this.options = a.extend({}, d.DEFAULTS, c)),
        (this.$trigger = a(
          '[data-toggle="collapse"][href="#' +
            b.id +
            '"],[data-toggle="collapse"][data-target="#' +
            b.id +
            '"]'
        )),
        (this.transitioning = null),
        this.options.parent
          ? (this.$parent = this.getParent())
          : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
        this.options.toggle && this.toggle();
    };
    (d.VERSION = "3.3.5"),
      (d.TRANSITION_DURATION = 350),
      (d.DEFAULTS = { toggle: !0 }),
      (d.prototype.dimension = function () {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height";
      }),
      (d.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
          var b,
            e =
              this.$parent &&
              this.$parent.children(".panel").children(".in, .collapsing");
          if (
            !(
              e &&
              e.length &&
              ((b = e.data("bs.collapse")), b && b.transitioning)
            )
          ) {
            var f = a.Event("show.bs.collapse");
            if ((this.$element.trigger(f), !f.isDefaultPrevented())) {
              e &&
                e.length &&
                (c.call(e, "hide"), b || e.data("bs.collapse", null));
              var g = this.dimension();
              this.$element
                .removeClass("collapse")
                .addClass("collapsing")
                [g](0)
                .attr("aria-expanded", !0),
                this.$trigger
                  .removeClass("collapsed")
                  .attr("aria-expanded", !0),
                (this.transitioning = 1);
              var h = function () {
                this.$element
                  .removeClass("collapsing")
                  .addClass("collapse in")
                  [g](""),
                  (this.transitioning = 0),
                  this.$element.trigger("shown.bs.collapse");
              };
              if (!a.support.transition) return h.call(this);
              var i = a.camelCase(["scroll", g].join("-"));
              this.$element
                .one("bsTransitionEnd", a.proxy(h, this))
                .emulateTransitionEnd(d.TRANSITION_DURATION)
                [g](this.$element[0][i]);
            }
          }
        }
      }),
      (d.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
          var b = a.Event("hide.bs.collapse");
          if ((this.$element.trigger(b), !b.isDefaultPrevented())) {
            var c = this.dimension();
            this.$element[c](this.$element[c]())[0].offsetHeight,
              this.$element
                .addClass("collapsing")
                .removeClass("collapse in")
                .attr("aria-expanded", !1),
              this.$trigger.addClass("collapsed").attr("aria-expanded", !1),
              (this.transitioning = 1);
            var e = function () {
              (this.transitioning = 0),
                this.$element
                  .removeClass("collapsing")
                  .addClass("collapse")
                  .trigger("hidden.bs.collapse");
            };
            return a.support.transition
              ? void this.$element[c](0)
                  .one("bsTransitionEnd", a.proxy(e, this))
                  .emulateTransitionEnd(d.TRANSITION_DURATION)
              : e.call(this);
          }
        }
      }),
      (d.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
      }),
      (d.prototype.getParent = function () {
        return a(this.options.parent)
          .find(
            '[data-toggle="collapse"][data-parent="' +
              this.options.parent +
              '"]'
          )
          .each(
            a.proxy(function (c, d) {
              var e = a(d);
              this.addAriaAndCollapsedClass(b(e), e);
            }, this)
          )
          .end();
      }),
      (d.prototype.addAriaAndCollapsedClass = function (a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c),
          b.toggleClass("collapsed", !c).attr("aria-expanded", c);
      });
    var e = a.fn.collapse;
    (a.fn.collapse = c),
      (a.fn.collapse.Constructor = d),
      (a.fn.collapse.noConflict = function () {
        return (a.fn.collapse = e), this;
      }),
      a(document).on(
        "click.bs.collapse.data-api",
        '[data-toggle="collapse"]',
        function (d) {
          var e = a(this);
          e.attr("data-target") || d.preventDefault();
          var f = b(e),
            g = f.data("bs.collapse"),
            h = g ? "toggle" : e.data();
          c.call(f, h);
        }
      );
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      var c = b.attr("data-target");
      c ||
        ((c = b.attr("href")),
        (c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, "")));
      var d = c && a(c);
      return d && d.length ? d : b.parent();
    }
    function c(c) {
      (c && 3 === c.which) ||
        (a(e).remove(),
        a(f).each(function () {
          var d = a(this),
            e = b(d),
            f = { relatedTarget: this };
          e.hasClass("open") &&
            ((c &&
              "click" == c.type &&
              /input|textarea/i.test(c.target.tagName) &&
              a.contains(e[0], c.target)) ||
              (e.trigger((c = a.Event("hide.bs.dropdown", f))),
              c.isDefaultPrevented() ||
                (d.attr("aria-expanded", "false"),
                e.removeClass("open").trigger("hidden.bs.dropdown", f))));
        }));
    }
    function d(b) {
      return this.each(function () {
        var c = a(this),
          d = c.data("bs.dropdown");
        d || c.data("bs.dropdown", (d = new g(this))),
          "string" == typeof b && d[b].call(c);
      });
    }
    var e = ".dropdown-backdrop",
      f = '[data-toggle="dropdown"]',
      g = function (b) {
        a(b).on("click.bs.dropdown", this.toggle);
      };
    (g.VERSION = "3.3.5"),
      (g.prototype.toggle = function (d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
          var f = b(e),
            g = f.hasClass("open");
          if ((c(), !g)) {
            "ontouchstart" in document.documentElement &&
              !f.closest(".navbar-nav").length &&
              a(document.createElement("div"))
                .addClass("dropdown-backdrop")
                .insertAfter(a(this))
                .on("click", c);
            var h = { relatedTarget: this };
            if (
              (f.trigger((d = a.Event("show.bs.dropdown", h))),
              d.isDefaultPrevented())
            )
              return;
            e.trigger("focus").attr("aria-expanded", "true"),
              f.toggleClass("open").trigger("shown.bs.dropdown", h);
          }
          return !1;
        }
      }),
      (g.prototype.keydown = function (c) {
        if (
          /(38|40|27|32)/.test(c.which) &&
          !/input|textarea/i.test(c.target.tagName)
        ) {
          var d = a(this);
          if (
            (c.preventDefault(),
            c.stopPropagation(),
            !d.is(".disabled, :disabled"))
          ) {
            var e = b(d),
              g = e.hasClass("open");
            if ((!g && 27 != c.which) || (g && 27 == c.which))
              return (
                27 == c.which && e.find(f).trigger("focus"), d.trigger("click")
              );
            var h = " li:not(.disabled):visible a",
              i = e.find(".dropdown-menu" + h);
            if (i.length) {
              var j = i.index(c.target);
              38 == c.which && j > 0 && j--,
                40 == c.which && j < i.length - 1 && j++,
                ~j || (j = 0),
                i.eq(j).trigger("focus");
            }
          }
        }
      });
    var h = a.fn.dropdown;
    (a.fn.dropdown = d),
      (a.fn.dropdown.Constructor = g),
      (a.fn.dropdown.noConflict = function () {
        return (a.fn.dropdown = h), this;
      }),
      a(document)
        .on("click.bs.dropdown.data-api", c)
        .on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
          a.stopPropagation();
        })
        .on("click.bs.dropdown.data-api", f, g.prototype.toggle)
        .on("keydown.bs.dropdown.data-api", f, g.prototype.keydown)
        .on(
          "keydown.bs.dropdown.data-api",
          ".dropdown-menu",
          g.prototype.keydown
        );
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b, d) {
      return this.each(function () {
        var e = a(this),
          f = e.data("bs.modal"),
          g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
        f || e.data("bs.modal", (f = new c(this, g))),
          "string" == typeof b ? f[b](d) : g.show && f.show(d);
      });
    }
    var c = function (b, c) {
      (this.options = c),
        (this.$body = a(document.body)),
        (this.$element = a(b)),
        (this.$dialog = this.$element.find(".modal-dialog")),
        (this.$backdrop = null),
        (this.isShown = null),
        (this.originalBodyPad = null),
        (this.scrollbarWidth = 0),
        (this.ignoreBackdropClick = !1),
        this.options.remote &&
          this.$element.find(".modal-content").load(
            this.options.remote,
            a.proxy(function () {
              this.$element.trigger("loaded.bs.modal");
            }, this)
          );
    };
    (c.VERSION = "3.3.5"),
      (c.TRANSITION_DURATION = 300),
      (c.BACKDROP_TRANSITION_DURATION = 150),
      (c.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }),
      (c.prototype.toggle = function (a) {
        return this.isShown ? this.hide() : this.show(a);
      }),
      (c.prototype.show = function (b) {
        var d = this,
          e = a.Event("show.bs.modal", { relatedTarget: b });
        this.$element.trigger(e),
          this.isShown ||
            e.isDefaultPrevented() ||
            ((this.isShown = !0),
            this.checkScrollbar(),
            this.setScrollbar(),
            this.$body.addClass("modal-open"),
            this.escape(),
            this.resize(),
            this.$element.on(
              "click.dismiss.bs.modal",
              '[data-dismiss="modal"]',
              a.proxy(this.hide, this)
            ),
            this.$dialog.on("mousedown.dismiss.bs.modal", function () {
              d.$element.one("mouseup.dismiss.bs.modal", function (b) {
                a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0);
              });
            }),
            this.backdrop(function () {
              var e = a.support.transition && d.$element.hasClass("fade");
              d.$element.parent().length || d.$element.appendTo(d.$body),
                d.$element.show().scrollTop(0),
                d.adjustDialog(),
                e && d.$element[0].offsetWidth,
                d.$element.addClass("in"),
                d.enforceFocus();
              var f = a.Event("shown.bs.modal", { relatedTarget: b });
              e
                ? d.$dialog
                    .one("bsTransitionEnd", function () {
                      d.$element.trigger("focus").trigger(f);
                    })
                    .emulateTransitionEnd(c.TRANSITION_DURATION)
                : d.$element.trigger("focus").trigger(f);
            }));
      }),
      (c.prototype.hide = function (b) {
        b && b.preventDefault(),
          (b = a.Event("hide.bs.modal")),
          this.$element.trigger(b),
          this.isShown &&
            !b.isDefaultPrevented() &&
            ((this.isShown = !1),
            this.escape(),
            this.resize(),
            a(document).off("focusin.bs.modal"),
            this.$element
              .removeClass("in")
              .off("click.dismiss.bs.modal")
              .off("mouseup.dismiss.bs.modal"),
            this.$dialog.off("mousedown.dismiss.bs.modal"),
            a.support.transition && this.$element.hasClass("fade")
              ? this.$element
                  .one("bsTransitionEnd", a.proxy(this.hideModal, this))
                  .emulateTransitionEnd(c.TRANSITION_DURATION)
              : this.hideModal());
      }),
      (c.prototype.enforceFocus = function () {
        a(document)
          .off("focusin.bs.modal")
          .on(
            "focusin.bs.modal",
            a.proxy(function (a) {
              this.$element[0] === a.target ||
                this.$element.has(a.target).length ||
                this.$element.trigger("focus");
            }, this)
          );
      }),
      (c.prototype.escape = function () {
        this.isShown && this.options.keyboard
          ? this.$element.on(
              "keydown.dismiss.bs.modal",
              a.proxy(function (a) {
                27 == a.which && this.hide();
              }, this)
            )
          : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
      }),
      (c.prototype.resize = function () {
        this.isShown
          ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this))
          : a(window).off("resize.bs.modal");
      }),
      (c.prototype.hideModal = function () {
        var a = this;
        this.$element.hide(),
          this.backdrop(function () {
            a.$body.removeClass("modal-open"),
              a.resetAdjustments(),
              a.resetScrollbar(),
              a.$element.trigger("hidden.bs.modal");
          });
      }),
      (c.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), (this.$backdrop = null);
      }),
      (c.prototype.backdrop = function (b) {
        var d = this,
          e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
          var f = a.support.transition && e;
          if (
            ((this.$backdrop = a(document.createElement("div"))
              .addClass("modal-backdrop " + e)
              .appendTo(this.$body)),
            this.$element.on(
              "click.dismiss.bs.modal",
              a.proxy(function (a) {
                return this.ignoreBackdropClick
                  ? void (this.ignoreBackdropClick = !1)
                  : void (
                      a.target === a.currentTarget &&
                      ("static" == this.options.backdrop
                        ? this.$element[0].focus()
                        : this.hide())
                    );
              }, this)
            ),
            f && this.$backdrop[0].offsetWidth,
            this.$backdrop.addClass("in"),
            !b)
          )
            return;
          f
            ? this.$backdrop
                .one("bsTransitionEnd", b)
                .emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION)
            : b();
        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass("in");
          var g = function () {
            d.removeBackdrop(), b && b();
          };
          a.support.transition && this.$element.hasClass("fade")
            ? this.$backdrop
                .one("bsTransitionEnd", g)
                .emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION)
            : g();
        } else b && b();
      }),
      (c.prototype.handleUpdate = function () {
        this.adjustDialog();
      }),
      (c.prototype.adjustDialog = function () {
        var a =
          this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
          paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
          paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : "",
        });
      }),
      (c.prototype.resetAdjustments = function () {
        this.$element.css({ paddingLeft: "", paddingRight: "" });
      }),
      (c.prototype.checkScrollbar = function () {
        var a = window.innerWidth;
        if (!a) {
          var b = document.documentElement.getBoundingClientRect();
          a = b.right - Math.abs(b.left);
        }
        (this.bodyIsOverflowing = document.body.clientWidth < a),
          (this.scrollbarWidth = this.measureScrollbar());
      }),
      (c.prototype.setScrollbar = function () {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        (this.originalBodyPad = document.body.style.paddingRight || ""),
          this.bodyIsOverflowing &&
            this.$body.css("padding-right", a + this.scrollbarWidth);
      }),
      (c.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", this.originalBodyPad);
      }),
      (c.prototype.measureScrollbar = function () {
        var a = document.createElement("div");
        (a.className = "modal-scrollbar-measure"), this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b;
      });
    var d = a.fn.modal;
    (a.fn.modal = b),
      (a.fn.modal.Constructor = c),
      (a.fn.modal.noConflict = function () {
        return (a.fn.modal = d), this;
      }),
      a(document).on(
        "click.bs.modal.data-api",
        '[data-toggle="modal"]',
        function (c) {
          var d = a(this),
            e = d.attr("href"),
            f = a(
              d.attr("data-target") || (e && e.replace(/.*(?=#[^\s]+$)/, ""))
            ),
            g = f.data("bs.modal")
              ? "toggle"
              : a.extend({ remote: !/#/.test(e) && e }, f.data(), d.data());
          d.is("a") && c.preventDefault(),
            f.one("show.bs.modal", function (a) {
              a.isDefaultPrevented() ||
                f.one("hidden.bs.modal", function () {
                  d.is(":visible") && d.trigger("focus");
                });
            }),
            b.call(f, g, this);
        }
      );
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.tooltip"),
          f = "object" == typeof b && b;
        (e || !/destroy|hide/.test(b)) &&
          (e || d.data("bs.tooltip", (e = new c(this, f))),
          "string" == typeof b && e[b]());
      });
    }
    var c = function (a, b) {
      (this.type = null),
        (this.options = null),
        (this.enabled = null),
        (this.timeout = null),
        (this.hoverState = null),
        (this.$element = null),
        (this.inState = null),
        this.init("tooltip", a, b);
    };
    (c.VERSION = "3.3.5"),
      (c.TRANSITION_DURATION = 150),
      (c.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template:
          '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: { selector: "body", padding: 0 },
      }),
      (c.prototype.init = function (b, c, d) {
        if (
          ((this.enabled = !0),
          (this.type = b),
          (this.$element = a(c)),
          (this.options = this.getOptions(d)),
          (this.$viewport =
            this.options.viewport &&
            a(
              a.isFunction(this.options.viewport)
                ? this.options.viewport.call(this, this.$element)
                : this.options.viewport.selector || this.options.viewport
            )),
          (this.inState = { click: !1, hover: !1, focus: !1 }),
          this.$element[0] instanceof document.constructor &&
            !this.options.selector)
        )
          throw new Error(
            "`selector` option must be specified when initializing " +
              this.type +
              " on the window.document object!"
          );
        for (var e = this.options.trigger.split(" "), f = e.length; f--; ) {
          var g = e[f];
          if ("click" == g)
            this.$element.on(
              "click." + this.type,
              this.options.selector,
              a.proxy(this.toggle, this)
            );
          else if ("manual" != g) {
            var h = "hover" == g ? "mouseenter" : "focusin",
              i = "hover" == g ? "mouseleave" : "focusout";
            this.$element.on(
              h + "." + this.type,
              this.options.selector,
              a.proxy(this.enter, this)
            ),
              this.$element.on(
                i + "." + this.type,
                this.options.selector,
                a.proxy(this.leave, this)
              );
          }
        }
        this.options.selector
          ? (this._options = a.extend({}, this.options, {
              trigger: "manual",
              selector: "",
            }))
          : this.fixTitle();
      }),
      (c.prototype.getDefaults = function () {
        return c.DEFAULTS;
      }),
      (c.prototype.getOptions = function (b) {
        return (
          (b = a.extend({}, this.getDefaults(), this.$element.data(), b)),
          b.delay &&
            "number" == typeof b.delay &&
            (b.delay = { show: b.delay, hide: b.delay }),
          b
        );
      }),
      (c.prototype.getDelegateOptions = function () {
        var b = {},
          c = this.getDefaults();
        return (
          this._options &&
            a.each(this._options, function (a, d) {
              c[a] != d && (b[a] = d);
            }),
          b
        );
      }),
      (c.prototype.enter = function (b) {
        var c =
          b instanceof this.constructor
            ? b
            : a(b.currentTarget).data("bs." + this.type);
        return (
          c ||
            ((c = new this.constructor(
              b.currentTarget,
              this.getDelegateOptions()
            )),
            a(b.currentTarget).data("bs." + this.type, c)),
          b instanceof a.Event &&
            (c.inState["focusin" == b.type ? "focus" : "hover"] = !0),
          c.tip().hasClass("in") || "in" == c.hoverState
            ? void (c.hoverState = "in")
            : (clearTimeout(c.timeout),
              (c.hoverState = "in"),
              c.options.delay && c.options.delay.show
                ? void (c.timeout = setTimeout(function () {
                    "in" == c.hoverState && c.show();
                  }, c.options.delay.show))
                : c.show())
        );
      }),
      (c.prototype.isInStateTrue = function () {
        for (var a in this.inState) if (this.inState[a]) return !0;
        return !1;
      }),
      (c.prototype.leave = function (b) {
        var c =
          b instanceof this.constructor
            ? b
            : a(b.currentTarget).data("bs." + this.type);
        return (
          c ||
            ((c = new this.constructor(
              b.currentTarget,
              this.getDelegateOptions()
            )),
            a(b.currentTarget).data("bs." + this.type, c)),
          b instanceof a.Event &&
            (c.inState["focusout" == b.type ? "focus" : "hover"] = !1),
          c.isInStateTrue()
            ? void 0
            : (clearTimeout(c.timeout),
              (c.hoverState = "out"),
              c.options.delay && c.options.delay.hide
                ? void (c.timeout = setTimeout(function () {
                    "out" == c.hoverState && c.hide();
                  }, c.options.delay.hide))
                : c.hide())
        );
      }),
      (c.prototype.show = function () {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
          this.$element.trigger(b);
          var d = a.contains(
            this.$element[0].ownerDocument.documentElement,
            this.$element[0]
          );
          if (b.isDefaultPrevented() || !d) return;
          var e = this,
            f = this.tip(),
            g = this.getUID(this.type);
          this.setContent(),
            f.attr("id", g),
            this.$element.attr("aria-describedby", g),
            this.options.animation && f.addClass("fade");
          var h =
              "function" == typeof this.options.placement
                ? this.options.placement.call(this, f[0], this.$element[0])
                : this.options.placement,
            i = /\s?auto?\s?/i,
            j = i.test(h);
          j && (h = h.replace(i, "") || "top"),
            f
              .detach()
              .css({ top: 0, left: 0, display: "block" })
              .addClass(h)
              .data("bs." + this.type, this),
            this.options.container
              ? f.appendTo(this.options.container)
              : f.insertAfter(this.$element),
            this.$element.trigger("inserted.bs." + this.type);
          var k = this.getPosition(),
            l = f[0].offsetWidth,
            m = f[0].offsetHeight;
          if (j) {
            var n = h,
              o = this.getPosition(this.$viewport);
            (h =
              "bottom" == h && k.bottom + m > o.bottom
                ? "top"
                : "top" == h && k.top - m < o.top
                ? "bottom"
                : "right" == h && k.right + l > o.width
                ? "left"
                : "left" == h && k.left - l < o.left
                ? "right"
                : h),
              f.removeClass(n).addClass(h);
          }
          var p = this.getCalculatedOffset(h, k, l, m);
          this.applyPlacement(p, h);
          var q = function () {
            var a = e.hoverState;
            e.$element.trigger("shown.bs." + e.type),
              (e.hoverState = null),
              "out" == a && e.leave(e);
          };
          a.support.transition && this.$tip.hasClass("fade")
            ? f
                .one("bsTransitionEnd", q)
                .emulateTransitionEnd(c.TRANSITION_DURATION)
            : q();
        }
      }),
      (c.prototype.applyPlacement = function (b, c) {
        var d = this.tip(),
          e = d[0].offsetWidth,
          f = d[0].offsetHeight,
          g = parseInt(d.css("margin-top"), 10),
          h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0),
          isNaN(h) && (h = 0),
          (b.top += g),
          (b.left += h),
          a.offset.setOffset(
            d[0],
            a.extend(
              {
                using: function (a) {
                  d.css({ top: Math.round(a.top), left: Math.round(a.left) });
                },
              },
              b
            ),
            0
          ),
          d.addClass("in");
        var i = d[0].offsetWidth,
          j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? (b.left += k.left) : (b.top += k.top);
        var l = /top|bottom/.test(c),
          m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
          n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l);
      }),
      (c.prototype.replaceArrow = function (a, b, c) {
        this.arrow()
          .css(c ? "left" : "top", 50 * (1 - a / b) + "%")
          .css(c ? "top" : "left", "");
      }),
      (c.prototype.setContent = function () {
        var a = this.tip(),
          b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b),
          a.removeClass("fade in top bottom left right");
      }),
      (c.prototype.hide = function (b) {
        function d() {
          "in" != e.hoverState && f.detach(),
            e.$element
              .removeAttr("aria-describedby")
              .trigger("hidden.bs." + e.type),
            b && b();
        }
        var e = this,
          f = a(this.$tip),
          g = a.Event("hide.bs." + this.type);
        return (
          this.$element.trigger(g),
          g.isDefaultPrevented()
            ? void 0
            : (f.removeClass("in"),
              a.support.transition && f.hasClass("fade")
                ? f
                    .one("bsTransitionEnd", d)
                    .emulateTransitionEnd(c.TRANSITION_DURATION)
                : d(),
              (this.hoverState = null),
              this)
        );
      }),
      (c.prototype.fixTitle = function () {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) &&
          a
            .attr("data-original-title", a.attr("title") || "")
            .attr("title", "");
      }),
      (c.prototype.hasContent = function () {
        return this.getTitle();
      }),
      (c.prototype.getPosition = function (b) {
        b = b || this.$element;
        var c = b[0],
          d = "BODY" == c.tagName,
          e = c.getBoundingClientRect();
        null == e.width &&
          (e = a.extend({}, e, {
            width: e.right - e.left,
            height: e.bottom - e.top,
          }));
        var f = d ? { top: 0, left: 0 } : b.offset(),
          g = {
            scroll: d
              ? document.documentElement.scrollTop || document.body.scrollTop
              : b.scrollTop(),
          },
          h = d
            ? { width: a(window).width(), height: a(window).height() }
            : null;
        return a.extend({}, e, g, h, f);
      }),
      (c.prototype.getCalculatedOffset = function (a, b, c, d) {
        return "bottom" == a
          ? { top: b.top + b.height, left: b.left + b.width / 2 - c / 2 }
          : "top" == a
          ? { top: b.top - d, left: b.left + b.width / 2 - c / 2 }
          : "left" == a
          ? { top: b.top + b.height / 2 - d / 2, left: b.left - c }
          : { top: b.top + b.height / 2 - d / 2, left: b.left + b.width };
      }),
      (c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
        var e = { top: 0, left: 0 };
        if (!this.$viewport) return e;
        var f = (this.options.viewport && this.options.viewport.padding) || 0,
          g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
          var h = b.top - f - g.scroll,
            i = b.top + f - g.scroll + d;
          h < g.top
            ? (e.top = g.top - h)
            : i > g.top + g.height && (e.top = g.top + g.height - i);
        } else {
          var j = b.left - f,
            k = b.left + f + c;
          j < g.left
            ? (e.left = g.left - j)
            : k > g.right && (e.left = g.left + g.width - k);
        }
        return e;
      }),
      (c.prototype.getTitle = function () {
        var a,
          b = this.$element,
          c = this.options;
        return (a =
          b.attr("data-original-title") ||
          ("function" == typeof c.title ? c.title.call(b[0]) : c.title));
      }),
      (c.prototype.getUID = function (a) {
        do a += ~~(1e6 * Math.random());
        while (document.getElementById(a));
        return a;
      }),
      (c.prototype.tip = function () {
        if (
          !this.$tip &&
          ((this.$tip = a(this.options.template)), 1 != this.$tip.length)
        )
          throw new Error(
            this.type +
              " `template` option must consist of exactly 1 top-level element!"
          );
        return this.$tip;
      }),
      (c.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
      }),
      (c.prototype.enable = function () {
        this.enabled = !0;
      }),
      (c.prototype.disable = function () {
        this.enabled = !1;
      }),
      (c.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled;
      }),
      (c.prototype.toggle = function (b) {
        var c = this;
        b &&
          ((c = a(b.currentTarget).data("bs." + this.type)),
          c ||
            ((c = new this.constructor(
              b.currentTarget,
              this.getDelegateOptions()
            )),
            a(b.currentTarget).data("bs." + this.type, c))),
          b
            ? ((c.inState.click = !c.inState.click),
              c.isInStateTrue() ? c.enter(c) : c.leave(c))
            : c.tip().hasClass("in")
            ? c.leave(c)
            : c.enter(c);
      }),
      (c.prototype.destroy = function () {
        var a = this;
        clearTimeout(this.timeout),
          this.hide(function () {
            a.$element.off("." + a.type).removeData("bs." + a.type),
              a.$tip && a.$tip.detach(),
              (a.$tip = null),
              (a.$arrow = null),
              (a.$viewport = null);
          });
      });
    var d = a.fn.tooltip;
    (a.fn.tooltip = b),
      (a.fn.tooltip.Constructor = c),
      (a.fn.tooltip.noConflict = function () {
        return (a.fn.tooltip = d), this;
      });
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.popover"),
          f = "object" == typeof b && b;
        (e || !/destroy|hide/.test(b)) &&
          (e || d.data("bs.popover", (e = new c(this, f))),
          "string" == typeof b && e[b]());
      });
    }
    var c = function (a, b) {
      this.init("popover", a, b);
    };
    if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
    (c.VERSION = "3.3.5"),
      (c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template:
          '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
      })),
      (c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype)),
      (c.prototype.constructor = c),
      (c.prototype.getDefaults = function () {
        return c.DEFAULTS;
      }),
      (c.prototype.setContent = function () {
        var a = this.tip(),
          b = this.getTitle(),
          c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b),
          a
            .find(".popover-content")
            .children()
            .detach()
            .end()
            [
              this.options.html
                ? "string" == typeof c
                  ? "html"
                  : "append"
                : "text"
            ](c),
          a.removeClass("fade top bottom left right in"),
          a.find(".popover-title").html() || a.find(".popover-title").hide();
      }),
      (c.prototype.hasContent = function () {
        return this.getTitle() || this.getContent();
      }),
      (c.prototype.getContent = function () {
        var a = this.$element,
          b = this.options;
        return (
          a.attr("data-content") ||
          ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
        );
      }),
      (c.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
      });
    var d = a.fn.popover;
    (a.fn.popover = b),
      (a.fn.popover.Constructor = c),
      (a.fn.popover.noConflict = function () {
        return (a.fn.popover = d), this;
      });
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(c, d) {
      (this.$body = a(document.body)),
        (this.$scrollElement = a(a(c).is(document.body) ? window : c)),
        (this.options = a.extend({}, b.DEFAULTS, d)),
        (this.selector = (this.options.target || "") + " .nav li > a"),
        (this.offsets = []),
        (this.targets = []),
        (this.activeTarget = null),
        (this.scrollHeight = 0),
        this.$scrollElement.on(
          "scroll.bs.scrollspy",
          a.proxy(this.process, this)
        ),
        this.refresh(),
        this.process();
    }
    function c(c) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.scrollspy"),
          f = "object" == typeof c && c;
        e || d.data("bs.scrollspy", (e = new b(this, f))),
          "string" == typeof c && e[c]();
      });
    }
    (b.VERSION = "3.3.5"),
      (b.DEFAULTS = { offset: 10 }),
      (b.prototype.getScrollHeight = function () {
        return (
          this.$scrollElement[0].scrollHeight ||
          Math.max(
            this.$body[0].scrollHeight,
            document.documentElement.scrollHeight
          )
        );
      }),
      (b.prototype.refresh = function () {
        var b = this,
          c = "offset",
          d = 0;
        (this.offsets = []),
          (this.targets = []),
          (this.scrollHeight = this.getScrollHeight()),
          a.isWindow(this.$scrollElement[0]) ||
            ((c = "position"), (d = this.$scrollElement.scrollTop())),
          this.$body
            .find(this.selector)
            .map(function () {
              var b = a(this),
                e = b.data("target") || b.attr("href"),
                f = /^#./.test(e) && a(e);
              return (
                (f && f.length && f.is(":visible") && [[f[c]().top + d, e]]) ||
                null
              );
            })
            .sort(function (a, b) {
              return a[0] - b[0];
            })
            .each(function () {
              b.offsets.push(this[0]), b.targets.push(this[1]);
            });
      }),
      (b.prototype.process = function () {
        var a,
          b = this.$scrollElement.scrollTop() + this.options.offset,
          c = this.getScrollHeight(),
          d = this.options.offset + c - this.$scrollElement.height(),
          e = this.offsets,
          f = this.targets,
          g = this.activeTarget;
        if ((this.scrollHeight != c && this.refresh(), b >= d))
          return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0]) return (this.activeTarget = null), this.clear();
        for (a = e.length; a--; )
          g != f[a] &&
            b >= e[a] &&
            (void 0 === e[a + 1] || b < e[a + 1]) &&
            this.activate(f[a]);
      }),
      (b.prototype.activate = function (b) {
        (this.activeTarget = b), this.clear();
        var c =
            this.selector +
            '[data-target="' +
            b +
            '"],' +
            this.selector +
            '[href="' +
            b +
            '"]',
          d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length &&
          (d = d.closest("li.dropdown").addClass("active")),
          d.trigger("activate.bs.scrollspy");
      }),
      (b.prototype.clear = function () {
        a(this.selector)
          .parentsUntil(this.options.target, ".active")
          .removeClass("active");
      });
    var d = a.fn.scrollspy;
    (a.fn.scrollspy = c),
      (a.fn.scrollspy.Constructor = b),
      (a.fn.scrollspy.noConflict = function () {
        return (a.fn.scrollspy = d), this;
      }),
      a(window).on("load.bs.scrollspy.data-api", function () {
        a('[data-spy="scroll"]').each(function () {
          var b = a(this);
          c.call(b, b.data());
        });
      });
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.tab");
        e || d.data("bs.tab", (e = new c(this))),
          "string" == typeof b && e[b]();
      });
    }
    var c = function (b) {
      this.element = a(b);
    };
    (c.VERSION = "3.3.5"),
      (c.TRANSITION_DURATION = 150),
      (c.prototype.show = function () {
        var b = this.element,
          c = b.closest("ul:not(.dropdown-menu)"),
          d = b.data("target");
        if (
          (d ||
            ((d = b.attr("href")), (d = d && d.replace(/.*(?=#[^\s]*$)/, ""))),
          !b.parent("li").hasClass("active"))
        ) {
          var e = c.find(".active:last a"),
            f = a.Event("hide.bs.tab", { relatedTarget: b[0] }),
            g = a.Event("show.bs.tab", { relatedTarget: e[0] });
          if (
            (e.trigger(f),
            b.trigger(g),
            !g.isDefaultPrevented() && !f.isDefaultPrevented())
          ) {
            var h = a(d);
            this.activate(b.closest("li"), c),
              this.activate(h, h.parent(), function () {
                e.trigger({ type: "hidden.bs.tab", relatedTarget: b[0] }),
                  b.trigger({ type: "shown.bs.tab", relatedTarget: e[0] });
              });
          }
        }
      }),
      (c.prototype.activate = function (b, d, e) {
        function f() {
          g
            .removeClass("active")
            .find("> .dropdown-menu > .active")
            .removeClass("active")
            .end()
            .find('[data-toggle="tab"]')
            .attr("aria-expanded", !1),
            b
              .addClass("active")
              .find('[data-toggle="tab"]')
              .attr("aria-expanded", !0),
            h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"),
            b.parent(".dropdown-menu").length &&
              b
                .closest("li.dropdown")
                .addClass("active")
                .end()
                .find('[data-toggle="tab"]')
                .attr("aria-expanded", !0),
            e && e();
        }
        var g = d.find("> .active"),
          h =
            e &&
            a.support.transition &&
            ((g.length && g.hasClass("fade")) || !!d.find("> .fade").length);
        g.length && h
          ? g
              .one("bsTransitionEnd", f)
              .emulateTransitionEnd(c.TRANSITION_DURATION)
          : f(),
          g.removeClass("in");
      });
    var d = a.fn.tab;
    (a.fn.tab = b),
      (a.fn.tab.Constructor = c),
      (a.fn.tab.noConflict = function () {
        return (a.fn.tab = d), this;
      });
    var e = function (c) {
      c.preventDefault(), b.call(a(this), "show");
    };
    a(document)
      .on("click.bs.tab.data-api", '[data-toggle="tab"]', e)
      .on("click.bs.tab.data-api", '[data-toggle="pill"]', e);
  })(jQuery),
  +(function (a) {
    "use strict";
    function b(b) {
      return this.each(function () {
        var d = a(this),
          e = d.data("bs.affix"),
          f = "object" == typeof b && b;
        e || d.data("bs.affix", (e = new c(this, f))),
          "string" == typeof b && e[b]();
      });
    }
    var c = function (b, d) {
      (this.options = a.extend({}, c.DEFAULTS, d)),
        (this.$target = a(this.options.target)
          .on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this))
          .on(
            "click.bs.affix.data-api",
            a.proxy(this.checkPositionWithEventLoop, this)
          )),
        (this.$element = a(b)),
        (this.affixed = null),
        (this.unpin = null),
        (this.pinnedOffset = null),
        this.checkPosition();
    };
    (c.VERSION = "3.3.5"),
      (c.RESET = "affix affix-top affix-bottom"),
      (c.DEFAULTS = { offset: 0, target: window }),
      (c.prototype.getState = function (a, b, c, d) {
        var e = this.$target.scrollTop(),
          f = this.$element.offset(),
          g = this.$target.height();
        if (null != c && "top" == this.affixed) return c > e ? "top" : !1;
        if ("bottom" == this.affixed)
          return null != c
            ? e + this.unpin <= f.top
              ? !1
              : "bottom"
            : a - d >= e + g
            ? !1
            : "bottom";
        var h = null == this.affixed,
          i = h ? e : f.top,
          j = h ? g : b;
        return null != c && c >= e
          ? "top"
          : null != d && i + j >= a - d
          ? "bottom"
          : !1;
      }),
      (c.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(),
          b = this.$element.offset();
        return (this.pinnedOffset = b.top - a);
      }),
      (c.prototype.checkPositionWithEventLoop = function () {
        setTimeout(a.proxy(this.checkPosition, this), 1);
      }),
      (c.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
          var b = this.$element.height(),
            d = this.options.offset,
            e = d.top,
            f = d.bottom,
            g = Math.max(a(document).height(), a(document.body).height());
          "object" != typeof d && (f = e = d),
            "function" == typeof e && (e = d.top(this.$element)),
            "function" == typeof f && (f = d.bottom(this.$element));
          var h = this.getState(g, b, e, f);
          if (this.affixed != h) {
            null != this.unpin && this.$element.css("top", "");
            var i = "affix" + (h ? "-" + h : ""),
              j = a.Event(i + ".bs.affix");
            if ((this.$element.trigger(j), j.isDefaultPrevented())) return;
            (this.affixed = h),
              (this.unpin = "bottom" == h ? this.getPinnedOffset() : null),
              this.$element
                .removeClass(c.RESET)
                .addClass(i)
                .trigger(i.replace("affix", "affixed") + ".bs.affix");
          }
          "bottom" == h && this.$element.offset({ top: g - b - f });
        }
      });
    var d = a.fn.affix;
    (a.fn.affix = b),
      (a.fn.affix.Constructor = c),
      (a.fn.affix.noConflict = function () {
        return (a.fn.affix = d), this;
      }),
      a(window).on("load", function () {
        a('[data-spy="affix"]').each(function () {
          var c = a(this),
            d = c.data();
          (d.offset = d.offset || {}),
            null != d.offsetBottom && (d.offset.bottom = d.offsetBottom),
            null != d.offsetTop && (d.offset.top = d.offsetTop),
            b.call(c, d);
        });
      });
  })(jQuery);

/*! lazysizes - v5.2.0-beta1 */
!(function (a, b) {
  var c = b(a, a.document);
  (a.lazySizes = c),
    "object" == typeof module && module.exports && (module.exports = c);
})("undefined" != typeof window ? window : {}, function (a, b) {
  "use strict";
  var c, d;
  if (
    ((function () {
      var b,
        c = {
          lazyClass: "lazyload",
          loadedClass: "lazyloaded",
          loadingClass: "lazyloading",
          preloadClass: "lazypreload",
          errorClass: "lazyerror",
          autosizesClass: "lazyautosizes",
          srcAttr: "data-src",
          srcsetAttr: "data-srcset",
          sizesAttr: "data-sizes",
          minSize: 40,
          customMedia: {},
          init: !0,
          expFactor: 1.5,
          hFac: 0.8,
          loadMode: 2,
          loadHidden: !0,
          ricTimeout: 0,
          throttleDelay: 125,
        };
      d = a.lazySizesConfig || a.lazysizesConfig || {};
      for (b in c) b in d || (d[b] = c[b]);
    })(),
    !b || !b.getElementsByClassName)
  )
    return { init: function () {}, cfg: d, noSupport: !0 };
  var e = b.documentElement,
    f = a.Date,
    g = a.HTMLPictureElement,
    h = "addEventListener",
    i = "getAttribute",
    j = a[h],
    k = a.setTimeout,
    l = a.requestAnimationFrame || k,
    m = a.requestIdleCallback,
    n = /^picture$/i,
    o = ["load", "error", "lazyincluded", "_lazyloaded"],
    p = {},
    q = Array.prototype.forEach,
    r = function (a, b) {
      return (
        p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")),
        p[b].test(a[i]("class") || "") && p[b]
      );
    },
    s = function (a, b) {
      r(a, b) ||
        a.setAttribute("class", (a[i]("class") || "").trim() + " " + b);
    },
    t = function (a, b) {
      var c;
      (c = r(a, b)) &&
        a.setAttribute("class", (a[i]("class") || "").replace(c, " "));
    },
    u = function (a, b, c) {
      var d = c ? h : "removeEventListener";
      c && u(a, b),
        o.forEach(function (c) {
          a[d](c, b);
        });
    },
    v = function (a, d, e, f, g) {
      var h = b.createEvent("Event");
      return (
        e || (e = {}),
        (e.instance = c),
        h.initEvent(d, !f, !g),
        (h.detail = e),
        a.dispatchEvent(h),
        h
      );
    },
    w = function (b, c) {
      var e;
      !g && (e = a.picturefill || d.pf)
        ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src),
          e({ reevaluate: !0, elements: [b] }))
        : c && c.src && (b.src = c.src);
    },
    x = function (a, b) {
      return (getComputedStyle(a, null) || {})[b];
    },
    y = function (a, b, c) {
      for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth; )
        (c = b.offsetWidth), (b = b.parentNode);
      return c;
    },
    z = (function () {
      var a,
        c,
        d = [],
        e = [],
        f = d,
        g = function () {
          var b = f;
          for (f = d.length ? e : d, a = !0, c = !1; b.length; ) b.shift()();
          a = !1;
        },
        h = function (d, e) {
          a && !e
            ? d.apply(this, arguments)
            : (f.push(d), c || ((c = !0), (b.hidden ? k : l)(g)));
        };
      return (h._lsFlush = g), h;
    })(),
    A = function (a, b) {
      return b
        ? function () {
            z(a);
          }
        : function () {
            var b = this,
              c = arguments;
            z(function () {
              a.apply(b, c);
            });
          };
    },
    B = function (a) {
      var b,
        c = 0,
        e = d.throttleDelay,
        g = d.ricTimeout,
        h = function () {
          (b = !1), (c = f.now()), a();
        },
        i =
          m && g > 49
            ? function () {
                m(h, { timeout: g }), g !== d.ricTimeout && (g = d.ricTimeout);
              }
            : A(function () {
                k(h);
              }, !0);
      return function (a) {
        var d;
        (a = !0 === a) && (g = 33),
          b ||
            ((b = !0),
            (d = e - (f.now() - c)),
            d < 0 && (d = 0),
            a || d < 9 ? i() : k(i, d));
      };
    },
    C = function (a) {
      var b,
        c,
        d = 99,
        e = function () {
          (b = null), a();
        },
        g = function () {
          var a = f.now() - c;
          a < d ? k(g, d - a) : (m || e)(e);
        };
      return function () {
        (c = f.now()), b || (b = k(g, d));
      };
    },
    D = (function () {
      var g,
        m,
        o,
        p,
        y,
        D,
        F,
        G,
        H,
        I,
        J,
        K,
        L = /^img$/i,
        M = /^iframe$/i,
        N = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
        O = 0,
        P = 0,
        Q = 0,
        R = -1,
        S = function (a) {
          Q--, (!a || Q < 0 || !a.target) && (Q = 0);
        },
        T = function (a) {
          return (
            null == K && (K = "hidden" == x(b.body, "visibility")),
            K ||
              !(
                "hidden" == x(a.parentNode, "visibility") &&
                "hidden" == x(a, "visibility")
              )
          );
        },
        U = function (a, c) {
          var d,
            f = a,
            g = T(a);
          for (
            G -= c, J += c, H -= c, I += c;
            g && (f = f.offsetParent) && f != b.body && f != e;

          )
            (g = (x(f, "opacity") || 1) > 0) &&
              "visible" != x(f, "overflow") &&
              ((d = f.getBoundingClientRect()),
              (g =
                I > d.left &&
                H < d.right &&
                J > d.top - 1 &&
                G < d.bottom + 1));
          return g;
        },
        V = function () {
          var a,
            f,
            h,
            j,
            k,
            l,
            n,
            o,
            q,
            r,
            s,
            t,
            u = c.elements;
          if ((p = d.loadMode) && Q < 8 && (a = u.length)) {
            for (f = 0, R++; f < a; f++)
              if (u[f] && !u[f]._lazyRace)
                if (!N || (c.prematureUnveil && c.prematureUnveil(u[f])))
                  ba(u[f]);
                else if (
                  (((o = u[f][i]("data-expand")) && (l = 1 * o)) || (l = P),
                  r ||
                    ((r =
                      !d.expand || d.expand < 1
                        ? e.clientHeight > 500 && e.clientWidth > 500
                          ? 500
                          : 370
                        : d.expand),
                    (c._defEx = r),
                    (s = r * d.expFactor),
                    (t = d.hFac),
                    (K = null),
                    P < s && Q < 1 && R > 2 && p > 2 && !b.hidden
                      ? ((P = s), (R = 0))
                      : (P = p > 1 && R > 1 && Q < 6 ? r : O)),
                  q !== l &&
                    ((D = innerWidth + l * t),
                    (F = innerHeight + l),
                    (n = -1 * l),
                    (q = l)),
                  (h = u[f].getBoundingClientRect()),
                  (J = h.bottom) >= n &&
                    (G = h.top) <= F &&
                    (I = h.right) >= n * t &&
                    (H = h.left) <= D &&
                    (J || I || H || G) &&
                    (d.loadHidden || T(u[f])) &&
                    ((m && Q < 3 && !o && (p < 3 || R < 4)) || U(u[f], l)))
                ) {
                  if ((ba(u[f]), (k = !0), Q > 9)) break;
                } else
                  !k &&
                    m &&
                    !j &&
                    Q < 4 &&
                    R < 4 &&
                    p > 2 &&
                    (g[0] || d.preloadAfterLoad) &&
                    (g[0] ||
                      (!o &&
                        (J ||
                          I ||
                          H ||
                          G ||
                          "auto" != u[f][i](d.sizesAttr)))) &&
                    (j = g[0] || u[f]);
            j && !k && ba(j);
          }
        },
        W = B(V),
        X = function (a) {
          var b = a.target;
          if (b._lazyCache) return void delete b._lazyCache;
          S(a),
            s(b, d.loadedClass),
            t(b, d.loadingClass),
            u(b, Z),
            v(b, "lazyloaded");
        },
        Y = A(X),
        Z = function (a) {
          Y({ target: a.target });
        },
        $ = function (a, b) {
          try {
            a.contentWindow.location.replace(b);
          } catch (c) {
            a.src = b;
          }
        },
        _ = function (a) {
          var b,
            c = a[i](d.srcsetAttr);
          (b = d.customMedia[a[i]("data-media") || a[i]("media")]) &&
            a.setAttribute("media", b),
            c && a.setAttribute("srcset", c);
        },
        aa = A(function (a, b, c, e, f) {
          var g, h, j, l, m, p;
          (m = v(a, "lazybeforeunveil", b)).defaultPrevented ||
            (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)),
            (h = a[i](d.srcsetAttr)),
            (g = a[i](d.srcAttr)),
            f && ((j = a.parentNode), (l = j && n.test(j.nodeName || ""))),
            (p = b.firesLoad || ("src" in a && (h || g || l))),
            (m = { target: a }),
            s(a, d.loadingClass),
            p && (clearTimeout(o), (o = k(S, 2500)), u(a, Z, !0)),
            l && q.call(j.getElementsByTagName("source"), _),
            h
              ? a.setAttribute("srcset", h)
              : g && !l && (M.test(a.nodeName) ? $(a, g) : (a.src = g)),
            f && (h || l) && w(a, { src: g })),
            a._lazyRace && delete a._lazyRace,
            t(a, d.lazyClass),
            z(function () {
              var b = a.complete && a.naturalWidth > 1;
              (p && !b) ||
                (b && s(a, "ls-is-cached"),
                X(m),
                (a._lazyCache = !0),
                k(function () {
                  "_lazyCache" in a && delete a._lazyCache;
                }, 9)),
                "lazy" == a.loading && Q--;
            }, !0);
        }),
        ba = function (a) {
          if (!a._lazyRace) {
            var b,
              c = L.test(a.nodeName),
              e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
              f = "auto" == e;
            ((!f && m) ||
              !c ||
              (!a[i]("src") && !a.srcset) ||
              a.complete ||
              r(a, d.errorClass) ||
              !r(a, d.lazyClass)) &&
              ((b = v(a, "lazyunveilread").detail),
              f && E.updateElem(a, !0, a.offsetWidth),
              (a._lazyRace = !0),
              Q++,
              aa(a, b, f, e, c));
          }
        },
        ca = C(function () {
          (d.loadMode = 3), W();
        }),
        da = function () {
          3 == d.loadMode && (d.loadMode = 2), ca();
        },
        ea = function () {
          if (!m) {
            if (f.now() - y < 999) return void k(ea, 999);
            (m = !0), (d.loadMode = 3), W(), j("scroll", da, !0);
          }
        };
      return {
        _: function () {
          (y = f.now()),
            (c.elements = b.getElementsByClassName(d.lazyClass)),
            (g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass)),
            j("scroll", W, !0),
            j("resize", W, !0),
            j("pageshow", function (a) {
              if (a.persisted) {
                var c = b.querySelectorAll("." + d.loadingClass);
                c.length &&
                  c.forEach &&
                  l(function () {
                    c.forEach(function (a) {
                      a.complete && ba(a);
                    });
                  });
              }
            }),
            a.MutationObserver
              ? new MutationObserver(W).observe(e, {
                  childList: !0,
                  subtree: !0,
                  attributes: !0,
                })
              : (e[h]("DOMNodeInserted", W, !0),
                e[h]("DOMAttrModified", W, !0),
                setInterval(W, 999)),
            j("hashchange", W, !0),
            [
              "focus",
              "mouseover",
              "click",
              "load",
              "transitionend",
              "animationend",
            ].forEach(function (a) {
              b[h](a, W, !0);
            }),
            /d$|^c/.test(b.readyState)
              ? ea()
              : (j("load", ea), b[h]("DOMContentLoaded", W), k(ea, 2e4)),
            c.elements.length ? (V(), z._lsFlush()) : W();
        },
        checkElems: W,
        unveil: ba,
        _aLSL: da,
      };
    })(),
    E = (function () {
      var a,
        c = A(function (a, b, c, d) {
          var e, f, g;
          if (
            ((a._lazysizesWidth = d),
            (d += "px"),
            a.setAttribute("sizes", d),
            n.test(b.nodeName || ""))
          )
            for (
              e = b.getElementsByTagName("source"), f = 0, g = e.length;
              f < g;
              f++
            )
              e[f].setAttribute("sizes", d);
          c.detail.dataAttr || w(a, c.detail);
        }),
        e = function (a, b, d) {
          var e,
            f = a.parentNode;
          f &&
            ((d = y(a, f, d)),
            (e = v(a, "lazybeforesizes", { width: d, dataAttr: !!b })),
            e.defaultPrevented ||
              ((d = e.detail.width) &&
                d !== a._lazysizesWidth &&
                c(a, f, e, d)));
        },
        f = function () {
          var b,
            c = a.length;
          if (c) for (b = 0; b < c; b++) e(a[b]);
        },
        g = C(f);
      return {
        _: function () {
          (a = b.getElementsByClassName(d.autosizesClass)), j("resize", g);
        },
        checkElems: g,
        updateElem: e,
      };
    })(),
    F = function () {
      !F.i && b.getElementsByClassName && ((F.i = !0), E._(), D._());
    };
  return (
    k(function () {
      d.init && F();
    }),
    (c = {
      cfg: d,
      autoSizer: E,
      loader: D,
      init: F,
      uP: w,
      aC: s,
      rC: t,
      hC: r,
      fire: v,
      gW: y,
      rAF: z,
    })
  );
});
