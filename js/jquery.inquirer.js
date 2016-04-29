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

        console.log('short_text');
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
                for: item.label
            }).appendTo(form);
        });

        console.log('multiple_choice')
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
                for: i
            }).appendTo(form);
        }

        console.log('rating')
    }
    
})(jQuery);
