;(function ($) {
    $.fn.inquirer = function (tag, question) {
        var questions = getQuestionArray(question);
        questions.forEach(function (item) {
            var form = $('<form/>', {
                text: item.question
            }).appendTo(tag);

            item.answers.forEach(function (item) {
                $('<input/>', {
                    type: 'radio'
                }).appendTo(form);
                
                $('<label/>', {
                    text: item
                }).appendTo(form)
            });
        });

        return this;
    };

    function getQuestionArray(question) {
        var array = [];
        question.forEach(function (item) {
            array.push($.parseJSON(item));
        });
        return array;
    }
})(jQuery);
