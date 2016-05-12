;(function ($) {
    $.ajax({
        url: 'http://localhost:3000/api/questions',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $().inquirer('#add', JSON.stringify(data));
        }
    });
})(jQuery);