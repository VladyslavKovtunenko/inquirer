;(function ($) {

    $.fn.typeform = function (tag, question) {
        new Typeform(tag, question);
        return this;
    };

    function Typeform(tag, question) {
        this.tag = tag;
        this.question = question;
        this.init();
    }

    Typeform.prototype.init = function () {
        getResponse.call(this);
    };

    function getResponse() {
        var tag = this.tag;
        var question = this.question;
        $.ajax({
            type: 'POST',
            url: 'https://api.typeform.io/latest/forms',
            headers: {
                'X-API-TOKEN': 'edb74c1c61c98fd50179bba0fdca6cdd',
                'Content-Type': 'application/json'
            },
            data: question,
            dataType: 'json',
            success: function (data) {
                var url = getUrl(data);
                createMainDiv(tag, url);
            }
        });
    }

    function getUrl(data) {
        var url;
        data._links.forEach(function (item) {
            if (item.rel == 'form_render') {
                url = item.href;
            }
        });
        return url;
    }


    function createMainDiv(tag, url) {
        $('<div/>', {
            class: 'typeform-widget',
            'data-text': 'All fields',
            'data-url': url,
            style: 'width:100%;height:500px;'
        }).appendTo(tag);
    }

})(jQuery);