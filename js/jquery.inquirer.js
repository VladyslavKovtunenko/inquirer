;(function ($) {

    $.fn.inquirer = function (tag, questions) {
        new Inquirer(tag, questions);
        return this;
    };

    function Inquirer(tag, question) {
        this.tag = tag;
        this.question = question;
        this.init();
    }

    Inquirer.prototype.init = function () {
        generateByQuestionType.call(this, JSON.parse(this.question));
    };

    function generateByQuestionType(questionsObj) {
        var mainList = $('<ul/>').appendTo(this.tag);
        questionsObj.fields.forEach(function (item) {
            switch (item.type) {
                case 'short_text':
                    short_text(item, mainList);
                    break;
                case 'multiple_choice':
                    multiple_choice(item, mainList);
                    break;
                case 'rating':
                    rating(item, mainList);
                    break;
                default:
                    break;
            }
        });

        /**
         * add to main list or tag ?
         */
        submit(questionsObj, mainList);
        addChecking(questionsObj);
        addStyle(questionsObj);
        animation(questionsObj);
        footer(questionsObj);
        setInterval(function () {
            listenProgress(questionsObj)
        }, 100);
    }

    function addStyle() {
        $('#submit_button').addClass('button');
        $('[id $= question]').addClass('question');
        $('[id $= form]').addClass('wrapper').animate({
            opacity: '0.1'
        });
    }

    function short_text(obj, tag) {
        var form = $('<li/>', {
            id: 'short_text_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'short_text_question',
            text: obj.question
        }).appendTo(form);

        $('<input/>', {
            id: 'short_text_input',
            type: 'text'
        }).appendTo(form);
    }

    function multiple_choice(obj, tag) {
        var form = $('<li/>', {
            id: 'multiple_choice_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'multiple_choice_question',
            text: obj.question
        }).appendTo(form);

        var list = $('<dl/>').appendTo(form);

        obj.choices.forEach(function (item) {
            var line = $('<dt/>').appendTo(list);
            $('<input/>', {
                id: 'multiple_choice_' + item.label,
                type: 'checkbox'
            }).appendTo(line);

            $('<label/>', {
                text: item.label,
                for: 'multiple_choice_' + item.label
            }).appendTo(line);
        });
    }

    function rating(obj, tag) {
        var form = $('<li/>', {
            id: 'rating_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'rating_question',
            text: obj.question
        }).appendTo(form);

        var list = $('<dl/>').appendTo(form);

        for (var i = obj.range.start; i <= obj.range.end; i++) {
            var line = $('<dt/>').appendTo(list);

            $('<input/>', {
                id: 'rating_' + i,
                type: 'radio',
                name: 'rating'
            }).appendTo(line);

            $('<label/>', {
                text: i,
                for: 'rating_' + i
            }).appendTo(line);
        }
    }

    function submit(obj, tag) {
        $('<button/>', {
            id: 'submit_button',
            text: 'Submit'
        }).appendTo(tag);

        $('#submit_button').click(function () {
            validAllForm(obj, function (short_text, multiple_choice, rating) {
                switch (false) {
                    case short_text:
                        bodyScroll($('#short_text_form').position().top);
                        // alert('Short text don\'t valid');
                        break;
                    case multiple_choice:
                        bodyScroll($('#multiple_choice_form').position().top);
                        // alert('Multiple choice don\'t valid');
                        break;
                    case rating:
                        bodyScroll($('#rating_form').position().top);
                        // alert('Rating don\'t valid');
                        break;
                    default:
                        alert('Success!');
                }
            });

            function bodyScroll(destination) {
                $('body').animate({
                    scrollTop: destination
                })
            }

        });
    }

    function validAllForm(obj, f) {
        (function () {
            var short_text = false;
            var multiple_choice = false;
            var rating = false;
            obj.fields.forEach(function (item) {
                switch (item.type) {
                    case 'short_text':
                        short_text = valid_short_text(item);
                        break;
                    case 'multiple_choice':
                        multiple_choice = valid_multiple_choice(item);
                        break;
                    case 'rating':
                        rating = valid_rating(item);
                        break;
                }
            });
            f(short_text, multiple_choice, rating);
        })();


        function valid_short_text(obj) {
            return $('#' + obj.type + '_input').val() != '';
        }

        function valid_multiple_choice(obj) {
            var check = false;
            obj.choices.forEach(function (item) {
                if ($('#multiple_choice_' + item.label).is(':checked')) {
                    check = true;
                }
            });
            return check;
        }

        function valid_rating(obj) {
            var check = false;
            for (var i = obj.range.start; i <= obj.range.end; i++) {
                if ($('#rating_' + i).is(':checked')) {
                    check = true;
                    break;
                }
            }
            return check;
        }
    }

    function addChecking() {
        $('label').click(function () {
            var current = $(this);
            if (current.attr('for').includes('rating')) {
                var localCurrent = $('[for ^= rating]');
                if (localCurrent.hasClass('checked')) {
                    localCurrent.removeClass('checked');
                } else if (localCurrent.hasClass('unchecked')) {
                    localCurrent.removeClass('unchecked');
                }
                current.addClass('checked');
            } else {
                if (current.hasClass('checked')) {
                    current.addClass('unchecked');
                    current.removeClass('checked');
                } else {
                    current.addClass('checked');
                    current.removeClass('unchecked');
                }
            }
        });
    }

    function animation(obj) {
        var speed = 25;
        //noinspection JSUnresolvedFunction
        $(document).scroll(function () {
            //noinspection JSValidateTypes
            var top = $(this).scrollTop() + 150;
            obj.fields.forEach(function (item) {
                var current = $('#' + item.type + '_form');
                var positionTop = current.position().top;
                var height = positionTop + current.height();
                animate(current, positionTop, height);
            });

            function animate(current, positionTop, height) {
                if (positionTop < top && top < height) {
                    current.animate({
                        opacity: '1',
                        scrollTop: positionTop
                    }, speed);
                } else {
                    current.animate({
                        opacity: '0.4'
                    }, speed);
                }
            }

        });
    }

    function footer(obj) {
        $('<div/>', {
            id: 'footer'
        }).appendTo('body');

        (function addNavigation() {
            var list = $('<ul/>', {
                id: 'button_list',
                class: 'footer'
            }).appendTo('#footer');

            $('<button/>', {
                id: 'up_button',
                text: 'Up',
                class: 'navigate_button'
            }).appendTo(list).click(function () {
                obj.fields.forEach(function (item, index) {
                    var current = $('#' + item.type + '_form');
                    var opacity = current.css('opacity');
                    if (opacity == '1' && obj.fields[index - 1]) {
                        var prev = $('#' + obj.fields[index - 1].type + '_form');
                        var position = prev != undefined ? prev.position().top : current.position().top;
                        if (position != undefined) {
                            $('body').animate({
                                scrollTop: position
                            });
                        }
                    }
                });
            });

            $('<button/>', {
                id: 'down_button',
                text: 'Down',
                class: 'navigate_button'
            }).appendTo(list).click(function () {
                obj.fields.forEach(function (item, index) {
                    var current = $('#' + item.type + '_form');
                    var opacity = current.css('opacity');
                    if (opacity == '1' && obj.fields[index + 1]) {
                        var next = $('#' + obj.fields[index + 1].type + '_form');
                        var position = next != undefined ? next.position().top : current.position().top;
                        $('body').animate({
                            scrollTop: position
                        });
                    }
                });
            });

            $('<progress/>', {
                id: 'progress',
                class: 'progress',
                min: '0',
                max: '100',
                value: '0'
            }).appendTo(list);

        })();
    }

    function listenProgress(obj) {
        var globalValue = 0;
        var addValue = 100 / obj.fields.length;
        var progress = $('#progress');
        progress.attr('value', globalValue);
        console.log(globalValue);
        validAllForm(obj, function (short_text, multiple_choice, rating) {
            if (short_text) {
                globalValue += addValue;
            }
            if (multiple_choice) {
                globalValue += addValue;
            }
            if (rating) {
                globalValue += addValue;
            }
        });
        progress.attr('value', globalValue);
    }

})
(jQuery);