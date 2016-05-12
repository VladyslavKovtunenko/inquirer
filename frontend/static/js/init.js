;(function ($) {
    addQuestion();
    getQuestionList();

    function getQuestionList() {
        $.ajax({
            url: 'http://localhost:3000/api/questions',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                $().inquirer('#add', JSON.stringify(data));
            }
        });
    }

    function addQuestion() {
        var questionData = {
            type: 'multiple_choice',
            question: 'Who are you?',
            choices: [
                {
                    label: 'iron-man'
                },
                {
                    label: 'batman'
                },
                {
                    label: 'cat'
                },
                {
                    label: 'human'
                },
                {
                    label: 'lol'
                },
                {
                    label: 'John'
                }
            ]
        };

        $.ajax({
            url: 'http://localhost:3000/api/question',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(questionData)
        });
    }

})(jQuery);