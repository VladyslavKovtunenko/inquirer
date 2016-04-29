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
        generateByQuestionType.call(this, $.parseJSON(this.question));
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

        // console.log('short_text');
    }
    
    function multiple_choice(obj, tag) {
        var form = $('<form/>', {
            id: 'multiple_choice_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'multiple_choice_question',
            text: obj.question
        }).appendTo(form);

        obj.choices.forEach(function (item) {
            $('<input/>', {
                id: 'multiple_choice_' + item.label,
                type: 'checkbox'
            }).appendTo(form);

            $('<label/>', {
                text: item.label,
                for: 'multiple_choice_' + item.label
            }).appendTo(form);
        });

        // console.log('multiple_choice')
    }

    function rating(obj, tag) {
        var form = $('<form/>', {
            id: 'rating_form'
        }).appendTo(tag);

        $('<h1/>', {
            id: 'rating_question',
            text: obj.question
        }).appendTo(form);

        for (var i = obj.range.start; i <= obj.range.end; i++) {
            $('<input/>', {
                id: 'rating_' + i,
                type: 'radio',
                name: 'rating'
            }).appendTo(form);

            $('<label/>', {
                text: i,
                for: 'rating_' + i
            }).appendTo(form);
        }

        // console.log('rating')
    }

    function submit(obj, tag) {
        $('<button/>', {
            id: 'submit_button',
            text: 'submit'
        }).appendTo(tag);


        $('#submit_button').click(function () {
            (function setTypes() {
                obj.fields.forEach(function (item) {
                    switch (item.type) {
                        case 'short_text':
                            valid_short_text(item);
                            break;
                        case 'multiple_choice':
                            valid_multiple_choice(item);
                            break;
                        case 'rating':
                            valid_rating(item);
                            break;
                    }
                });
            })();

            function valid_short_text(obj) {
                if (!$('#' + obj.type + '_input').val()) {
                    console.log('bad input');
                }
            }

            function valid_multiple_choice(obj) {
                var check = false;
                obj.choices.forEach(function (item) {
                    if ($('#multiple_choice_' + item.label).is(':checked')) {
                        check = true;
                    }
                });
                if (!check) {
                    console.log('bad checkbox');
                }
            }

            function valid_rating(obj) {
                var check = false;
                for (var i = obj.range.start; i <= obj.range.end; i++) {
                    if ($('#rating_' + i).is(':checked')) {
                        check = true;
                        break;
                    }
                }
                if (!check) {
                    console.log('bad rating');
                }
            }

        });
    }
    
})(jQuery);
