;(function ($) {

    $.fn.inquirer = function (tag, questions) {
        new Inquirer(tag, questions);
        return this;
    };

    function Inquirer(tag, questions) {
        this.tag = tag;
        this.questions = questions;
        this.init();
    }
    Inquirer.prototype.init = function () {
        generatePage.call(this, this.parse());
    };
    Inquirer.prototype.parse = function () {
        var arr = JSON.parse(this.questions);
        arr.fields.forEach(function (item) {
            item.question = JSON.parse(item.question);
        });
        return arr;
    };

    function Constructor() {
    }
    Constructor.prototype.createMainLine = function (tag, id, styleClass) {
        return $('<li/>', {
            id: id,
            class: styleClass
        }).appendTo(tag);
    };
    Constructor.prototype.createQuestion = function (tag, id, text, styleClass) {
        return $('<h1/>', {
            id: id,
            text: text,
            class: styleClass
        }).appendTo(tag);
    };
    Constructor.prototype.createInput = function (tag, id, type) {
        return $('<input/>', {
            id: id,
            type: type
        }).appendTo(tag);
    };
    Constructor.prototype.createLabel = function (tag, id, text) {
        return $('<label/>', {
            id: id,
            text: text
        }).appendTo(tag);
    };
    Constructor.prototype.createButton = function (tag, id, text, styleClass, eventListener) {
        return $('<button/>', {
                id: id,
                text: text,
                class: styleClass
            }).appendTo(tag).click(eventListener);
    };
    Constructor.prototype.createFooter = function (tag, id) {
        return $('<div/>', {
            id: id
        }).appendTo(tag);
    };

    function generatePage(mainObj) {
        var constructor = new Constructor();
        var mainList = $('<ul/>').appendTo(this.tag);

        mainObj.fields.forEach(function (item) {
            var questionType = item.question.type;
            switch (questionType) {
                case 'short_text':
                    generateShortTextQuestion(item, mainList, constructor);
                    break;
                case 'multiple_choice':
                    generateMultipleChoiceQuestion(item, mainList, constructor);
                    break;
                case 'rating':
                    generateRatingQuestion(item, mainList, constructor);
                    break;
                default:
                    break;
            }
        });

        initOpacity(mainObj);
        submitButton(mainObj, mainList, constructor);
        choice(mainObj);
        animateTransition(mainObj);
        createFooter(mainObj, constructor);
        setInterval(function () {
            listenProgress(mainObj)
        }, 250);
    }

    /*
     *
     *      Generate id for each elements:
     *          1. {    short_text_{id} ||
     *                  multiple_choice_{id} ||
     *                  rating_{id} }                       - for main form
     *          2. {1} + _question                          - for questions
     *          3. {1} + _input                             - for input
     *          4. {1} + _{choice || rating}_{id}           - for choices
     */

    function generateShortTextQuestion(obj, tag, creator) {
        var mainID = 'short_text_' + obj.id;
        var form = creator.createMainLine(tag, mainID, 'wrapper');
        (function createContent() {
            creator.createQuestion(form, mainID + '_question', obj.question.question, 'question');
            creator.createInput(form, mainID + '_input', 'text');
        })();
    }
    function generateMultipleChoiceQuestion(obj, tag, creator) {
        var mainID = 'multiple_choice_' + obj.id;
        var form = creator.createMainLine(tag, mainID, 'wrapper');
        (function createContent() {
            creator.createQuestion(form, mainID + '_question', obj.question.question, 'question');
            var list = $('<dl/>').appendTo(form);
            obj.question.choices.forEach(function (item, index) {
                var line = $('<dt/>').appendTo(list);
                var id = mainID + '_choice_' + index;
                // creator.createInput(line, id, 'checkbox');
                creator.createLabel(line, id, item.label);
            });
        })();
    }
    function generateRatingQuestion(obj, tag, creator) {
        var mainID = 'rating_' + obj.id;
        var form = creator.createMainLine(tag, mainID, 'wrapper');
        (function createContent() {
            creator.createQuestion(form, mainID + '_question', obj.question.question, 'question');
            var list = $('<dl/>').appendTo(form);
            for (var i = obj.question.range.start; i <= obj.question.range.end; i++) {
                var line = $('<dt/>').appendTo(list);
                var id = mainID + '_rating_' + i;
                // console.log(id);
                // creator.createInput(line, id, 'radio', 'rating');
                creator.createLabel(line, id, i);
            }
        })();
    }
    function initOpacity(obj) {
        var speed = 25;
        obj.fields.forEach(function (item, index) {
            var current = $('#' + item.question.type + '_' + item.id);
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
                    $('#' + item.question.type + '_' + item.id).animate({
                        opacity: '0.4'
                    }, speed).addClass('disabled');
                });
            }

            function activateBadForm(badItem) {
                $('#' + badItem.question.type + '_' + badItem.id)
                    .removeClass('disabled')
                    .animate({
                        opacity: '1'
                    });
            }

            function bodyScroll(badItem) {
                $('body').animate({
                    scrollTop: $('#' + badItem.question.type + '_' + badItem.id).position().top
                });
            }

        });
    }
    function choice() {
        $('label').click(function () {
            var current = $(this);
            if (current.attr('id').includes('rating')) {
                // console.log(current);
                radio(current);
            } else {
                checkbox(current);
            }
        });

        function radio(current) {
            var number = 'rating_' + current.context.id.charAt(7);
            console.log(number);
            var str = '[id ^= ' + number + ']';
            var all = $(str);
            if (all.hasClass('checked')) {
                all.removeClass('checked');
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

        function Validator() {
        }
        Validator.prototype.validShortText = function (obj) {
            return $('#' + obj.question.type + '_' + obj.id + '_input').val() != '';
        };
        Validator.prototype.validMultipleChoice = function (obj) {
            for (var i = 0; i < obj.question.choices.length; i++) {
                var id = '#' + obj.question.type + '_' + obj.id + '_choice_' + i;
                // if ($(id).is(':checked')) {
                //     return true;
                // }
                if ($(id).hasClass('checked')) {
                    return true;
                }
            }
            return false;
        };
        Validator.prototype.validRating = function (obj) {
            var mainID = obj.question.type + '_' + obj.id;
            for (var i = obj.question.range.start; i <= obj.question.range.end; i++) {
                var id = '#' + mainID + '_rating_' + i;
                // if ($(id).is(':checked')) {
                //     return true;
                // }
                if ($(id).hasClass('checked')) {
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
                switch (obj.fields[i].question.type) {
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
        var current = $('#' + item.question.type + '_' + item.id);
        if (obj.fields[index + sign] && current.css('opacity') == '1') {
            setNext();
            setCurrent();
        }

        function setNext() {
            var next = $('#' + obj.fields[index + sign].question.type + '_' + obj.fields[index + sign].id);
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
                switch (item.question.type) {
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