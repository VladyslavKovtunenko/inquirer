;(function ($) {

    $.fn.inquirer = function (tag, questions) {
        var inquirer = new Inquirer(tag, questions);
        inquirer.generatePage();
        return this;
    };

    function Inquirer(tag, questions) {
        this.tag = tag;
        this.questions = questions;
    }

    Inquirer.prototype.parseJson = function () {
        var arr = JSON.parse(this.questions);
        arr.fields.forEach(function (item) {
            item.question = JSON.parse(item.question);
        });
        return arr;
    };

    Inquirer.prototype.generateContent = function (mainObj, mainList, constructor) {
        mainObj.fields.forEach(function (item) {
            var questionType = item.question.type;
            switch (questionType) {
                case 'short_text':
                    generateShortTextQuestion(item, mainList, constructor);
                    break;
                case 'multiple_choice':
                    generateMultipleChoiceQuestion(item, mainList, constructor);
                    break;
                case 'rating':
                    generateRatingQuestion(item, mainList, constructor);
                    break;
                default:
                    break;
            }
        });
    };

    Inquirer.prototype.generatePage = function () {
        var constructor = new Constructor();
        var mainList = constructor.createList(this.tag);
        var mainObj = this.parseJson();

        if (mainObj.fields.length == 0) {
            return;
        }

        this.generateContent(mainObj, mainList, constructor);

        initOpacity(mainObj);
        createSubmitButton(mainObj, mainList, constructor);
        setRulesForChoice(mainObj);
        animateTransition(mainObj);
        createFooter(mainObj, constructor);
        setInterval(function () {
            listenProgress(mainObj)
        }, 250);
    };

    function Constructor() {
    }

    Constructor.prototype.createList = function (tag, id, styleClass) {
        return $('<dl/>', {
            id: id,
            class: styleClass
        }).appendTo(tag);
    };

    Constructor.prototype.createLine = function (tag, id, styleClass) {
        return $('<dt/>', {
            id: id,
            class: styleClass
        }).appendTo(tag);
    };

    Constructor.prototype.createQuestion = function (tag, id, text, styleClass) {
        return $('<h1/>', {
            id: id,
            text: text,
            class: styleClass
        }).appendTo(tag);
    };

    Constructor.prototype.createInput = function (tag, id, type) {
        return $('<input/>', {
            id: id,
            type: type
        }).appendTo(tag);
    };

    Constructor.prototype.createLabel = function (tag, id, text) {
        return $('<label/>', {
            id: id,
            text: text
        }).appendTo(tag);
    };

    Constructor.prototype.createButton = function (tag, id, text, styleClass) {
        return $('<button/>', {
            id: id,
            text: text,
            class: styleClass
        }).appendTo(tag);
    };

    Constructor.prototype.createFooter = function (tag, id) {
        return $('<div/>', {
            id: id
        }).appendTo(tag);
    };

    Constructor.prototype.createProgressBar = function (tag) {
        var progress = $('<div/>', {
            id: 'progress',
            class: 'progress'
        }).appendTo(tag);
        $('<span/>', {
            id: 'percents',
            class: 'percent'
        }).appendTo(progress);
        $('<div/>', {
            id: 'bar',
            class: 'bar'
        }).appendTo(progress);
    };

    function Validator() {
    }

    Validator.prototype.validShortText = function (obj) {
        return $('#' + obj.question.type + '_' + obj.id + '_input').val() != '';
    };

    Validator.prototype.validMultipleChoice = function (obj) {
        for (var i = 0; i < obj.question.choices.length; i++) {
            var id = '#' + obj.question.type + '_' + obj.id + '_choice_' + i;
            if ($(id).hasClass('checked')) {
                return true;
            }
        }
        return false;
    };

    Validator.prototype.validRating = function (obj) {
        var mainID = obj.question.type + '_' + obj.id;
        for (var i = obj.question.range.start; i <= obj.question.range.end; i++) {
            var id = '#' + mainID + '_rating_' + i;
            if ($(id).hasClass('checked')) {
                return true;
            }
        }
        return false;
    };

    /*
     *      Generate id for each elements:
     *          1.    { short_text_{id}      ||
     *                  multiple_choice_{id} ||
     *                  rating_{id} }                       - for main form
     *          2. {1} + _question                          - for questions
     *          3. {1} + _input                             - for input
     *          4. {1} + _{choice || rating}_{id}           - for choices
     */

    function generateShortTextQuestion(obj, tag, creator) {
        var formId = 'short_text_' + obj.id;
        var questionId = formId + '_question';
        var inputId = formId + '_input';

        createContent();

        function createContent() {
            var form = creator.createLine(tag, formId, 'wrapper');
            creator.createQuestion(form, questionId, obj.question.text, 'question');
            creator.createInput(form, inputId, 'text');
        }
    }

    function generateMultipleChoiceQuestion(obj, tag, creator) {
        var formId = 'multiple_choice_' + obj.id;
        var questionId = formId + '_question';

        createContent();

        function createContent() {
            var form = creator.createLine(tag, formId, 'wrapper');
            creator.createQuestion(form, questionId, obj.question.text, 'question');
            generateChoicesList(form);
        }

        function generateChoicesList(form) {
            var list = creator.createList(form);
            obj.question.choices.forEach(function (item, index) {
                var line = creator.createLine(list);
                var labelId = formId + '_choice_' + index;
                creator.createLabel(line, labelId, item.label);
            });
        }
    }

    function generateRatingQuestion(obj, tag, creator) {
        var formId = 'rating_' + obj.id;
        var questionId = formId + '_question';

        createContent();

        function createContent() {
            var form = creator.createLine(tag, formId, 'wrapper');
            creator.createQuestion(form, questionId, obj.question.text, 'question');
            generateChoicesList(form);
        }

        function generateChoicesList(form) {
            var list = creator.createList(form);
            for (var i = obj.question.range.start; i <= obj.question.range.end; i++) {
                var line = creator.createLine(list);
                var labelId = formId + '_rating_' + i;
                creator.createLabel(line, labelId, i);
            }
        }
    }

    function initOpacity(obj) {
        scrollToFirstForm();
        setOpacityForAllForms();

        var animationSpeed = 25;

        function scrollToFirstForm() {
            var form = obj.fields[0];
            var formId = form.question.type + '_' + form.id;
            var formObj = $('#' + formId);
            $('body').animate({
                scrollTop: formObj.position().top
            }, animationSpeed);
        }

        function setOpacityForAllForms() {
            for (var i = 1; i < obj.fields.length; i++) {
                var form = obj.fields[i];
                var formId = form.question.type + '_' + form.id;
                var formObj = $('#' + formId);
                formObj.animate({
                    opacity: '0.4'
                }, animationSpeed).addClass('disabled');
            }
        }
    }

    function setRulesForChoice() {
        $('label').click(function () {
            var form = $(this);
            if (form.attr('id').startsWith('rating')) {
                radiobuttonRules(form);
            } else {
                checkboxRules(form);
            }
        });

        function radiobuttonRules(clickedForm) {
            // get form idNumber -> rating_{idNumber} :(
            var formIdNumber = 'rating_' + clickedForm.context.id.charAt(7);
            var query = '[id ^= ' + formIdNumber + ']';
            var elseForm = $(query);
            if (elseForm.hasClass('checked')) {
                elseForm.removeClass('checked');
            }
            clickedForm.addClass('checked');
        }

        function checkboxRules(clickedForm) {
            if (clickedForm.hasClass('checked')) {
                clickedForm.addClass('unchecked');
                clickedForm.removeClass('checked');
            } else {
                clickedForm.addClass('checked');
                clickedForm.removeClass('unchecked');
            }
        }

    }

    function createSubmitButton(obj, tag, creator) {
        var button = creator.createButton(tag, 'submit_button', 'Submit', 'button');
        addEventListener();

        function addEventListener() {
            button.click(function () {
                var validateRequest = validateForm(obj);

                if (validateRequest.form.length == 0) {
                    alert('Success!');
                } else {
                    var badForm = validateRequest.form[0];
                    disabledOpacityForAllForm(obj);
                    activateNotValidForm(badForm);
                    scrollToNotValidForm(badForm);
                }

                var animationSpeed = 50;

                function disabledOpacityForAllForm() {
                    obj.fields.forEach(function (item) {
                        var formId = item.question.type + '_' + item.id;
                        $('#' + formId).animate({
                            opacity: '0.4'
                        }, animationSpeed).addClass('disabled');
                    });
                }

                function activateNotValidForm(badForm) {
                    var badFormId = badForm.question.type + '_' + badForm.id;
                    $('#' + badFormId).animate({
                        opacity: '1'
                    }, animationSpeed).removeClass('disabled');
                }

                function scrollToNotValidForm(badForm) {
                    var badFormId = badForm.question.type + '_' + badForm.id;
                    $('body').animate({
                        scrollTop: $('#' + badFormId).position().top
                    }, animationSpeed);
                }

            });
        }
    }

    function validateForm(obj) {
        var validator = new Validator();
        return findNotValidForm();

        function findNotValidForm() {
            var badRequest = {};
            badRequest.form = [];

            for (var i = 0; i < obj.fields.length; i++) {
                var currentForm = obj.fields[i];
                switch (currentForm.question.type) {
                    case 'short_text':
                        findBadShortText(badRequest, currentForm);
                        break;
                    case 'multiple_choice':
                        findBadMultipleChoice(badRequest, currentForm);
                        break;
                    case 'rating':
                        findBadRating(badRequest, currentForm);
                        break;
                    default:
                        break;
                }
            }
            return badRequest;
        }

        function findBadShortText(badRequest, currentForm) {
            if (!validator.validShortText(currentForm)) {
                badRequest.form.push(currentForm);
            }
        }

        function findBadMultipleChoice(badRequest, currentForm) {
            if (!validator.validMultipleChoice(currentForm)) {
                badRequest.form.push(currentForm);
            }
        }

        function findBadRating(badRequest, currentForm) {
            if (!validator.validRating(currentForm)) {
                badRequest.form.push(currentForm);
            }
        }

    }

    function animateTransition(obj) {
        $(document).on('mousewheel', function (event) {
            obj.fields.forEach(function (item, index) {
                if (event.originalEvent.wheelDelta >= 0) {
                    // up
                    documentScroll(obj, item, index, -1);
                } else {
                    // down
                    documentScroll(obj, item, index, 1);
                }
            });

        });
    }

    function documentScroll(obj, form, formIndex, direction) {
        var currentFormId = form.question.type + '_' + form.id;
        var currentForm = $('#' + currentFormId);
        var directionIndex = formIndex + direction;

        if (obj.fields[directionIndex] && currentForm.css('opacity') == '1') {
            setNextFormCondition();
            setCurrentFormCondition();
        }

        var animationSpeed = 25;

        function setNextFormCondition() {
            var nextForm = obj.fields[directionIndex];
            var nextFormId = nextForm.question.type + '_' + nextForm.id;
            var nextFormObj = $('#' + nextFormId);
            nextFormObj
                .removeClass('disabled')
                .animate({
                    opacity: '1'
                }, animationSpeed);
            scrollToNexFrom(nextFormObj);
        }

        function scrollToNexFrom(nextFormObj) {
            $('body').animate({
                scrollTop: nextFormObj.position().top
            });
        }

        function setCurrentFormCondition() {
            currentForm.animate({
                opacity: '0.4'
            }, animationSpeed).addClass('disabled');
        }
    }

    function createFooter(obj, creator) {
        var footer = creator.createFooter('body', 'footer');
        createNavigationButtons();

        function createNavigationButtons() {
            var list = creator.createList(footer, 'button_list', 'footer');
            createButtons(list);
            creator.createProgressBar(list);
        }

        function createButtons(list) {
            var buttonUp = creator.createButton(list, 'up_button', 'Up', 'navigate_button');
            buttonUp.click(function () {
                obj.fields.forEach(function (item, index) {
                    documentScroll(obj, item, index, -1);
                });
            });

            var buttonDown = creator.createButton(list, 'down_button', 'Down', 'navigate_button');
            buttonDown.click(function () {
                obj.fields.forEach(function (item, index) {
                    documentScroll(obj, item, index, 1);
                });
            });
        }
    }

    function listenProgress(obj) {
        var progress = $('#progress');
        var addedValue = progress.width() / obj.fields.length;
        var validateRequest = validateForm(obj);
        var validForms = obj.fields.length - validateRequest.form.length;
        var currentPercents = (addedValue * validForms * 100) / progress.width();

        updateProgressBar();

        function updateProgressBar() {
            $('#percents').text(currentPercents.toFixed(0).toString() + '%');
            $('#bar').css({
                width: addedValue * validForms
            });
        }
    }

})(jQuery);