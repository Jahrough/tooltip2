(function ($, window, document) {
    'use strict';
    var module = {

        defaults: {
            on: 'hover',
            contentSelector: null,
            show: false,
            hide: false,
            position: 'top',
            timeout: 3000,
            state: false
        },


        init: function (element, options) {
            var $element = $(element),
                $tooltip = $element.next('.ui-tooltip'),
                settings;

            if ($element.length > 0) {
                settings = $.extend({}, this.defaults, options);

                if (settings.disable) {
                    this.disableTooltip($element, $tooltip);
                } else {
                    this.addTooltip($element, $tooltip);
                    this.addEventListener($element, settings);

                }
            }
        },


        disableTooltip: function ($element, $tooltip) {
            $element.off('.tip');
            if ($tooltip.length > 0) {
                $tooltip.hide();
            }
        },

        addTooltip: function ($element, $tooltip) {
            var html = '<div class="ui-tooltip"><div class="inner"></div></div>';

            if ($tooltip.length === 0) {
                $element.after(html);
            }
        },


        addEventListener: function ($element, settings) {
            var eventTypes = 'click.tip mouseenter.tip mouseleave.tip touchleave.tip focusin.tip focusout.tip';

            if (settings.on === 'click') {
                $(document).off('click.tip').on('click.tip', function (e) {

                    var $tooltip = $element.next('.ui-tooltip');
                    if ((e.target !== $element[0]) && (e.target !== $tooltip[0])) {
                        console.log(e.target, $tooltip[0]);
                        settings.state = false;
                        this.hideTooltip($element, $tooltip, settings);
                    }
                }.bind(this));
            }

            $element.off('.tip').on(eventTypes, settings, this.eventHandler.bind(this));

        },


        eventHandler: function (e) {
            var $element = $(e.currentTarget),
                $tooltip = $element.next('.ui-tooltip');

            this[e.data.on]($element, $tooltip, e.data, e.type);
        },


        hover: function ($element, $tooltip, settings, type) {

            // HOVER EVENT HANDLER
            switch (type) {
                case 'mouseenter':
                    this.showTooltip($element, $tooltip, settings);
                    break;
                case 'mouseleave':
                    this.hideTooltip($element, $tooltip, settings);
                    break;
                default:
                    window.setTimeout(this.hideTooltip($element, $tooltip, settings), settings.timeout);
                    break;
            }
        },


        click: function ($element, $tooltip, settings, type) {
            // CLICK EVENT HANDLER
            if (type === 'click') {
                if (settings.state) {
                    settings.state = false;
                    this.hideTooltip($element, $tooltip, settings);
                } else {
                    settings.state = true;
                    this.showTooltip($element, $tooltip, settings);
                }
            }
        },


        focus: function ($element, $tooltip, settings, type) {
            // FORM INPUT EVENT HANDLER
            if (type === 'focusin') {
                this.showTooltip($element, $tooltip, settings);
            } else if (type === 'focusout') {
                this.hideTooltip($element, $tooltip, settings);
            }
        },


        showTooltip: function ($element, $tooltip, settings) {
            var $contentSelector = $element.find(settings.contentSelector),
                content = $element.attr('title');

            if ($contentSelector.length > 0) {
                content = $contentSelector.html();
                this.setTooltip($element, $tooltip, settings.position, content);

            } else if (typeof content !== 'undefined') {
                $element.data('title', content).removeAttr('title');
                this.setTooltip($element, $tooltip, settings.position, content);
            }
        },


        setTooltip: function ($element, $tooltip, position, content) {
            $tooltip.find('.inner').html(content);
            this.positionTooltip($element, $tooltip, position);
            $tooltip.finish().fadeIn('fast');
        },


        hideTooltip: function ($element, $tooltip, settings) {
            var title = $element.data('title');

            if (typeof title !== 'undefined') {
                $element.attr('title', title).removeData('title');
            }

            $tooltip.stop().fadeOut('fast');
        },


        positionTooltip: function ($element, $tooltip, position) {
            var top, left,
                adjust = 12,
                offset = $element.offset(),
                zIndex = this.getMaxIndex($('*').not('.ui-tooltip, .ui-tooltip > .tip'));

            switch (position) {
                case ('right'):
                    top = (offset.top + ($element.outerHeight() / 2) - ($tooltip.outerHeight() / 2));
                    left = (offset.left + $element.outerWidth() + adjust);
                    break;
                case ('left'):
                    top = (offset.top + ($element.outerHeight() / 2) - ($tooltip.outerHeight() / 2));
                    left = (offset.left - $tooltip.outerWidth() - adjust);
                    break;
                case ('bottom'):
                    top = (offset.top + $element.outerHeight() + adjust);
                    left = (offset.left + ($element.outerWidth() / 2) - ($tooltip.outerWidth() / 2));
                    break;
                default:
                    top = (offset.top - $tooltip.outerHeight() - adjust);
                    left = (offset.left + ($element.outerWidth() / 2) - ($tooltip.outerWidth() / 2));
                    break;
            }

            $tooltip.css({
                top: top + 'px',
                left: left + 'px',
                zIndex: zIndex + 1
            }).removeClass('top bottom left right').addClass(position);

        },


        getMaxIndex: function ($elements) {
            var indexes = $.map($elements, function (element) {
                var zIndex = $(element).css('zIndex');
                return (typeof zIndex === 'number') ? zIndex : 1;
            });

            return Math.max.apply(null, indexes);
        }

    };

    $.fn.tooltip = function (options) {
        module.init(this, options);
        return this;
    };

}(jQuery, window, document));
