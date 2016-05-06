;(function ($) {

    /**
     *  export point
     */
    $.fn.inquirer = function (tag, questions) {
        new Inquirer(tag, questions);
        return this;
    };

    /**
     * Inquirer constructor
     */
    function Inquirer(tag, question) {
        this.tag = tag;
        this.question = question;
        this.init();
    }

    Inquirer.prototype.init = function () {
        generateByQuestionType.call(this, JSON.parse(this.question));
    };

    /**
     * Creator constructor
     */
    function Creator() {
    }

    Creator.prototype.createMainLine = function (tag, id, styleClass) {
        return $('<li/>', {
            id: id,
            class: styleClass
        }).appendTo(tag);
    };

    Creator.prototype.createQuestion = function (tag, id, text, styleClass) {
        return $('<h1/>', {
            id: id,
            text: text,
            class: styleClass
        }).appendTo(tag);
    };

    Creator.prototype.createInput = function (tag, id, type, name) {
        return $('<input/>', {
            id: id,
            type: type,
            name: name
        }).appendTo(tag);
    };

    Creator.prototype.createLabel = function (tag, text, what) {
        return $('<label/>', {
            text: text,
            for: what
        }).appendTo(tag);
    };

    Creator.prototype.createButton = function (tag, id, text, styleClass, eventListener) {
        var button;
        if (eventListener) {
            button = $('<button/>', {
                id: id,
                text: text,
                class: styleClass
            }).appendTo(tag).click(eventListener);
        } else {
            button = $('<button/>', {
                id: id,
                text: text,
                class: styleClass
            }).appendTo(tag);
        }
        return button;
    };

    Creator.prototype.createFooter = function (tag, id) {
        return $('<div/>', {
            id: id
        }).appendTo(tag);
    };

    function generateByQuestionType(questionsObj) {
        var creator = new Creator();
        var mainList = $('<ul/>').appendTo(this.tag);

        questionsObj.fields.forEach(function (item) {
            switch (item.type) {
                case 'short_text':
                    short_text(item, mainList, creator);
                    break;
                case 'multiple_choice':
                    multiple_choice(item, mainList, creator);
                    break;
                case 'rating':
                    rating(item, mainList, creator);
                    break;
                default:
                    break;
            }
        });

        initOpacity(questionsObj);
        submitButton(questionsObj, mainList, creator);
        choice(questionsObj);
        animateTransition(questionsObj);
        createFooter(questionsObj, creator);
        setInterval(function () {
            listenProgress(questionsObj)
        }, 250);
    }

    function short_text(obj, tag, creator) {
        var form = creator.createMainLine(tag, 'short_text_form', 'wrapper');
        (function createContent() {
            creator.createQuestion(form, 'short_text_question', obj.question, 'question');
            creator.createInput(form, 'short_text_input', 'text');
        })();
    }

    function multiple_choice(obj, tag, creator) {
        var form = creator.createMainLine(tag, 'multiple_choice_form', 'wrapper');
        (function createContent() {
            creator.createQuestion(form, 'multiple_choice_question', obj.question, 'question');
            var list = $('<dl/>').appendTo(form);
            obj.choices.forEach(function (item) {
                var line = $('<dt/>').appendTo(list);
                var id = 'multiple_choice_' + item.label;
                creator.createInput(line, id, 'checkbox');
                creator.createLabel(line, item.label, id);
            });
        })();
    }

    function rating(obj, tag, creator) {
        var form = creator.createMainLine(tag, 'rating_form', 'wrapper');
        (function createContent() {
            creator.createQuestion(form, 'rating_question', obj.question, 'question');
            var list = $('<dl/>').appendTo(form);
            for (var i = obj.range.start; i <= obj.range.end; i++) {
                var line = $('<dt/>').appendTo(list);
                var id = 'rating_' + i;
                creator.createInput(line, id, 'radio', 'rating');
                creator.createLabel(line, i, id);
            }
        })();
    }

    function initOpacity(obj) {
        var speed = 25;
        obj.fields.forEach(function (item, index) {
            var current = $('#' + item.type + '_form');
            if (index != 0) {
                current.animate({
                    opacity: '0.4'
                }, speed).addClass('disabled');
            } else {
                $('body').animate({
                    scrollTop: current.position().top
                })
            }
        });
    }

    function submitButton(obj, tag, creator) {
        creator.createButton(tag, 'submit_button', 'Submit', 'button', function () {
            validAllForm(obj, function (badItem) {
                if (badItem == undefined) {
                    alert('Success!');
                } else {
                    setOpacityForAllForm(obj);
                    activateBadForm(badItem);
                    bodyScroll(badItem);
                }
            });

            function setOpacityForAllForm() {
                var speed = 25;
                obj.fields.forEach(function (item) {
                    $('#' + item.type + '_form').animate({
                        opacity: '0.4'
                    }, speed).addClass('disabled');
                });
            }

            function activateBadForm(badItem) {
                $('#' + badItem.type + '_form')
                    .removeClass('disabled')
                    .animate({
                        opacity: '1'
                    });
            }

            function bodyScroll(badItem) {
                $('body').animate({
                    scrollTop: $('#' + badItem.type + '_form').position().top
                });
            }

        });
    }

    function choice() {
        $('label').click(function () {
            var current = $(this);
            if (current.attr('for').includes('rating')) {
                radio(current);
            } else {
                checkbox(current);
            }
        });

        function radio(current) {
            var localCurrent = $('[for ^= rating]');
            if (localCurrent.hasClass('checked')) {
                localCurrent.removeClass('checked');
            } else {
                localCurrent.removeClass('unchecked');
            }
            current.addClass('checked');
        }

        function checkbox(current) {
            if (current.hasClass('checked')) {
                current.addClass('unchecked');
                current.removeClass('checked');
            } else {
                current.addClass('checked');
                current.removeClass('unchecked');
            }
        }

    }

    function validAllForm(obj, callFunction) {
        /**
         * Validator constructor
         */
        function Validator() {
        }

        Validator.prototype.validShortText = function (obj) {
            return $('#' + obj.type + '_input').val() != '';
        };

        Validator.prototype.validMultipleChoice = function (obj) {
            for (var i = 0; i < obj.choices.length; i++) {
                if ($('#multiple_choice_' + obj.choices[i].label).is(':checked')) {
                    return true;
                }
            }
            return false;
        };
        
        Validator.prototype.validRating = function (obj) {
            for (var i = obj.range.start; i <= obj.range.end; i++) {
                if ($('#rating_' + i).is(':checked')) {
                    return true;
                }
            }
            return false;
        };

        (function () {
            var validator = new Validator();
            var badItem = getBadItem(obj, validator);
            callFunction.call(validator, badItem);
        })();

        function getBadItem(obj, validator) {
            for (var i = 0; i < obj.fields.length; i++) {
                switch (obj.fields[i].type) {
                    case 'short_text':
                        if (!validator.validShortText(obj.fields[i])) {
                            return obj.fields[i];
                        }
                        break;
                    case 'multiple_choice':
                        if (!validator.validMultipleChoice(obj.fields[i])) {
                            return obj.fields[i];
                        }
                        break;
                    case 'rating':
                        if (!validator.validRating(obj.fields[i])) {
                            return obj.fields[i];
                        }
                        break;
                    default:
                        break;
                }
            }

        }
    }

    function animateTransition(obj) {
        $(document).on('mousewheel', function (event) {
            obj.fields.forEach(function (item, index) {
                if (event.originalEvent.wheelDelta >= 0) {
                    // up
                    scroll(obj, item, index, -1);
                } else {
                    // down
                    scroll(obj, item, index, 1);
                }
            });

        });
    }

    function scroll(obj, item, index, sign) {
        var speed = 25;
        var current = $('#' + item.type + '_form');
        if (obj.fields[index + sign] && current.css('opacity') == '1') {
            setNext();
            setCurrent();
        }

        function setNext() {
            var next = $('#' + obj.fields[index + sign].type + '_form');
            next
                .removeClass('disabled')
                .animate({
                    opacity: '1'
                }, speed);
            $('body').animate({
                scrollTop: next.position().top
            });
        }

        function setCurrent() {
            current.animate({
                opacity: '0.4'
            }, speed).addClass('disabled');
        }
    }

    function createFooter(obj, creator) {
        var footer = creator.createFooter('body', 'footer');
        (function addNavigation() {
            var list = createList();
            createButtons(list);
            createProgressBar(list);
        })();

        function createList() {
            return $('<ul/>', {
                id: 'button_list',
                class: 'footer'
            }).appendTo(footer);
        }

        function createButtons(list) {
            creator.createButton(list, 'up_button', 'Up', 'navigate_button', function () {
                obj.fields.forEach(function (item, index) {
                    scroll(obj, item, index, -1);
                });
            });

            creator.createButton(list, 'down_button', 'Down', 'navigate_button', function () {
                obj.fields.forEach(function (item, index) {
                    scroll(obj, item, index, 1);
                });
            });
        }

        function createProgressBar(list) {
            var progress = $('<div/>', {
                id: 'progress',
                class: 'progress'
            }).appendTo(list);
            $('<span/>', {
                id: 'percents',
                class: 'percent'
            }).appendTo(progress);
            $('<div/>', {
                id: 'bar',
                class: 'bar'
            }).appendTo(progress);
        }
    }

    function listenProgress(obj) {
        var globalValue = 0;
        var progress = $('#progress');
        var addValue = progress.width() / obj.fields.length;
        validAllForm(obj, function () {
            var validator = this;
            obj.fields.forEach(function (item) {
                switch (item.type) {
                    case 'short_text':
                        if (validator.validShortText(item)) {
                            globalValue += addValue;
                        }
                        break;
                    case 'multiple_choice':
                        if (validator.validMultipleChoice(item)) {
                            globalValue += addValue;
                        }
                        break;
                    case 'rating':
                        if (validator.validRating(item)) {
                            globalValue += addValue;
                        }
                        break;
                    default:
                        break;
                }
            });
        });

        (function changeProgressBarStyle() {
            var currentPercent = (globalValue * 100) / progress.width();
            $('#percents').text(currentPercent.toFixed(0).toString() + '%');
            $('#bar').css({
                width: globalValue
            });
        })();
    }

})(jQuery);