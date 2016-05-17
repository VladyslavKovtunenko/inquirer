/*
 *      question generator rules
 *
 *  1. type: short_text
 *      1.1 text: 'question text'
 *      
 *  2. type: multiple_choice
 *      2.1 text: 'question text'
 *      2.2 choices: [
 *          {
 *              label: 'choices text'
 *          },
 *          {
 *              label: 'another choices text'
 *          }
 *      ]
 *
 *  3. type: rating
 *      3.1 text: 'question text'
 *      3.2 range: {
 *          start: 'start value',
 *          end: 'end value'
 *      }
 */

;(function ($) {
    /*
     * uncomment method to test api usage
     */
    
    // getQuestionList();
    // addQuestion();
    updateQuestion();
    // removeQuestion();


    function getQuestionList() {
        $.ajax({
            url: 'http://localhost:3000/api/questions',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                $().inquirer('#add', JSON.stringify(data));
            }
        });
    }

    function addQuestion() {
        var addedData = {
            type: 'rating',
            text: 'Crazy?',
            range: {
                start: '1',
                end: '6'
            }
        };

        $.ajax({
            url: 'http://localhost:3000/api/question',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(addedData)
        });
    }

    /*
     * if you update db record you must describe
     * data by upper rules (its mean that if you
     * describe only some part of data -> in db
     * write only this part)
     */
    function updateQuestion() {
        var id = 3;
        
        var updatedData = {
            type: 'short_text',
            text: 'So what?'
        };

        $.ajax({
            url: 'http://localhost:3000/api/question/' + id,
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(updatedData)
        });
    }

    function removeQuestion() {
        var id = 1;

        $.ajax({
            url: 'http://localhost:3000/api/question/' + id,
            type: 'DELETE'
        });
    }

})(jQuery);