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
        var tag = this.tag;
        questionsObj.fields.forEach(function (item) {
            switch (item.type) {
                case 'short_text':
                    short_text(item, tag);
                    break;
                case 'multiple_choice':
                    multiple_choice(item, tag);
                    break;
                case 'rating':
                    rating(item, tag);
                    break;
                default:
                    break;
            }
        });

        submit(questionsObj, tag);
        addStyle();
    }

    function addStyle() {
        $('#submit_button').addClass('button');
    }

    function short_text(obj, tag) {
        var form = $('<form/>', {
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
        var form = $('<form/>', {
            id: 'multiple_choice_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'multiple_choice_question',
            text: obj.question
        }).appendTo(form);

        var list = $('<dl/>').appendTo(form);

        obj.choices.forEach(function (item) {
            var line = $('<dd/>').appendTo(list);
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
        var form = $('<form/>', {
            id: 'rating_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'rating_question',
            text: obj.question
        }).appendTo(form);

        var list = $('<dl/>').appendTo(form);

        for (var i = obj.range.start; i <= obj.range.end; i++) {
            var line = $('<dd/>').appendTo(list);

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
            text: 'submit'
        }).appendTo(tag);

        $('#submit_button').click(function () {
            (function setTypes() {
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

                if (!(short_text && multiple_choice && rating)) {
                    alert('Form not valid!');
                } else {
                    alert('Success!');
                }

            })();

            function valid_short_text(obj) {
                return $('#' + obj.type + '_input').val();

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
        });
    }
    
})(jQuery);
