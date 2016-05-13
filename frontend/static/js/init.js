;(function ($) {
    getQuestionList();
    // addQuestion();

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
        var questionData =
                {
                    type: 'rating',
                    question: 'Skilllllllllllll?',
                    range: {
                        start: '1',
                        end: '3'
                    }
                };


        $.ajax({
            url: 'http://localhost:3000/api/questions',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(questionData)
        });
    }

})(jQuery);