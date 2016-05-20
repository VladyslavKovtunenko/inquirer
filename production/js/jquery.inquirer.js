!function(t){function e(t,e){this.tag=t,this.questions=e}function n(){}function i(){}function o(t,e,n){function i(){var i=n.createLine(e,o,"wrapper");n.createQuestion(i,a,t.question.text,"question"),n.createInput(i,r,"text")}var o="short_text_"+t.id,a=o+"_question",r=o+"_input";i()}function a(t,e,n){function i(){var i=n.createLine(e,a,"wrapper");n.createQuestion(i,r,t.question.text,"question"),o(i)}function o(e){var i=n.createList(e);t.question.choices.forEach(function(t,e){var o=n.createLine(i),r=a+"_choice_"+e;n.createLabel(o,r,t.label)})}var a="multiple_choice_"+t.id,r=a+"_question";i()}function r(t,e,n){function i(){var i=n.createLine(e,a,"wrapper");n.createQuestion(i,r,t.question.text,"question"),o(i)}function o(e){for(var i=n.createList(e),o=t.question.range.start;o<=t.question.range.end;o++){var r=n.createLine(i),c=a+"_rating_"+o;n.createLabel(r,c,o)}}var a="rating_"+t.id,r=a+"_question";i()}function c(e){function n(){var n=e.fields[0],i=n.question.type+"_"+n.id,a=t("#"+i);t("body").animate({scrollTop:a.position().top},o)}function i(){for(var n=1;n<e.fields.length;n++){var i=e.fields[n],a=i.question.type+"_"+i.id,r=t("#"+a);r.animate({opacity:"0.4"},o).addClass("disabled")}}n(),i();var o=25}function s(){function e(e){var n="rating_"+e.context.id.charAt(7),i="[id ^= "+n+"]",o=t(i);o.hasClass("checked")&&o.removeClass("checked"),e.addClass("checked")}function n(t){t.hasClass("checked")?(t.addClass("unchecked"),t.removeClass("checked")):(t.addClass("checked"),t.removeClass("unchecked"))}t("label").click(function(){var i=t(this);i.attr("id").startsWith("rating")?e(i):n(i)})}function u(e,n,i){function o(){a.click(function(){function n(){e.fields.forEach(function(e){var n=e.question.type+"_"+e.id;t("#"+n).animate({opacity:"0.4"},c).addClass("disabled")})}function i(e){var n=e.question.type+"_"+e.id;t("#"+n).animate({opacity:"1"},c).removeClass("disabled")}function o(e){var n=e.question.type+"_"+e.id;t("body").animate({scrollTop:t("#"+n).position().top},c)}var a=p(e);if(0==a.form.length)alert("Success!");else{var r=a.form[0];n(e),i(r),o(r)}var c=50})}var a=i.createButton(n,"submit_button","Submit","button");o()}function p(t){function e(){var e={};e.form=[];for(var i=0;i<t.fields.length;i++){var r=t.fields[i];switch(r.question.type){case"short_text":n(e,r);break;case"multiple_choice":o(e,r);break;case"rating":a(e,r)}}return e}function n(t,e){r.validShortText(e)||t.form.push(e)}function o(t,e){r.validMultipleChoice(e)||t.form.push(e)}function a(t,e){r.validRating(e)||t.form.push(e)}var r=new i;return e()}function d(e){t(document).on("mousewheel",function(t){e.fields.forEach(function(n,i){t.originalEvent.wheelDelta>=0?f(e,n,i,-1):f(e,n,i,1)})})}function f(e,n,i,o){function a(){var n=e.fields[p],i=n.question.type+"_"+n.id,o=t("#"+i);o.removeClass("disabled").animate({opacity:"1"},d),r(o)}function r(e){t("body").animate({scrollTop:e.position().top})}function c(){u.animate({opacity:"0.4"},d).addClass("disabled")}var s=n.question.type+"_"+n.id,u=t("#"+s),p=i+o;e.fields[p]&&"1"==u.css("opacity")&&(a(),c());var d=25}function l(t,e){function n(){var t=e.createList(o,"button_list","footer");i(t),e.createProgressBar(t)}function i(n){var i=e.createButton(n,"up_button","Up","navigate_button");i.click(function(){t.fields.forEach(function(e,n){f(t,e,n,-1)})});var o=e.createButton(n,"down_button","Down","navigate_button");o.click(function(){t.fields.forEach(function(e,n){f(t,e,n,1)})})}var o=e.createFooter("body","footer");n()}function h(e){function n(){t("#percents").text(c.toFixed(0).toString()+"%"),t("#bar").css({width:o*r})}var i=t("#progress"),o=i.width()/e.fields.length,a=p(e),r=e.fields.length-a.form.length,c=o*r*100/i.width();n()}t.fn.inquirer=function(t,n){var i=new e(t,n);return i.generatePage(),this},e.prototype.parseJson=function(){var t=JSON.parse(this.questions);return t.fields.forEach(function(t){t.question=JSON.parse(t.question)}),t},e.prototype.generateContent=function(t,e,n){t.fields.forEach(function(t){var i=t.question.type;switch(i){case"short_text":o(t,e,n);break;case"multiple_choice":a(t,e,n);break;case"rating":r(t,e,n)}})},e.prototype.generatePage=function(){var t=new n,e=t.createList(this.tag),i=this.parseJson();0!=i.fields.length&&(this.generateContent(i,e,t),c(i),u(i,e,t),s(i),d(i),l(i,t),setInterval(function(){h(i)},250))},n.prototype.createList=function(e,n,i){return t("<dl/>",{id:n,"class":i}).appendTo(e)},n.prototype.createLine=function(e,n,i){return t("<dt/>",{id:n,"class":i}).appendTo(e)},n.prototype.createQuestion=function(e,n,i,o){return t("<h1/>",{id:n,text:i,"class":o}).appendTo(e)},n.prototype.createInput=function(e,n,i){return t("<input/>",{id:n,type:i}).appendTo(e)},n.prototype.createLabel=function(e,n,i){return t("<label/>",{id:n,text:i}).appendTo(e)},n.prototype.createButton=function(e,n,i,o){return t("<button/>",{id:n,text:i,"class":o}).appendTo(e)},n.prototype.createFooter=function(e,n){return t("<div/>",{id:n}).appendTo(e)},n.prototype.createProgressBar=function(e){var n=t("<div/>",{id:"progress","class":"progress"}).appendTo(e);t("<span/>",{id:"percents","class":"percent"}).appendTo(n),t("<div/>",{id:"bar","class":"bar"}).appendTo(n)},i.prototype.validShortText=function(e){return""!=t("#"+e.question.type+"_"+e.id+"_input").val()},i.prototype.validMultipleChoice=function(e){for(var n=0;n<e.question.choices.length;n++){var i="#"+e.question.type+"_"+e.id+"_choice_"+n;if(t(i).hasClass("checked"))return!0}return!1},i.prototype.validRating=function(e){for(var n=e.question.type+"_"+e.id,i=e.question.range.start;i<=e.question.range.end;i++){var o="#"+n+"_rating_"+i;if(t(o).hasClass("checked"))return!0}return!1}}(jQuery);