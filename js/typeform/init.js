;(function () {
    $(document).ready(function () {
        $().typeform('#typeform_add', JSON.stringify(
            {
                title: "My first typeform",
                fields: [
                    {
                        type: "short_text",
                        question: "How are you?"
                    }
                ]
            }));
    });
})(jQuery);