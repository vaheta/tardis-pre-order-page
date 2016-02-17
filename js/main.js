jQuery(document).ready(function($){
    //hide the subtle gradient layer (.cd-pricing-list > li::after) when pricing table has been scrolled to the end (mobile version only)
    checkScrolling($('.cd-pricing-body'));
    $(window).on('resize', function(){
        window.requestAnimationFrame(function(){checkScrolling($('.cd-pricing-body'))});
    });
    $('.cd-pricing-body').on('scroll', function(){ 
        var selected = $(this);
        window.requestAnimationFrame(function(){checkScrolling(selected)});
    });

    function checkScrolling(tables){
        tables.each(function(){
            var table= $(this),
                totalTableWidth = parseInt(table.children('.cd-pricing-features').width()),
                tableViewport = parseInt(table.width());
            console.log(table.scrollLeft() - totalTableWidth + tableViewport)
            if( table.scrollLeft() >= totalTableWidth - tableViewport - 1) {
                table.parent('li').addClass('is-ended');
            } else {
                table.parent('li').removeClass('is-ended');
            }
        });
    }
});

/* Added by Petya */

$(function () {
    var $sendButton = $(".form-popup__send-button");
    var $closeButton = $(".form-popup__close-button");
    var $formPopup = $(".form-popup");
    var $formInputs = $(".form-popup__input");
    var $popupTitle = $formPopup.find(".form-popup__title");
    var $thankYou = $formPopup.find(".form-popup__thank-you");
    var $error = $formPopup.find(".form-popup__error");

    // attach button handlers
    $(".cd-select").on ("click", function (e) {
        var package = $(this).attr("name");
        
        showFormPopup (package);

        e.preventDefault();
    });

    function showFormPopup (package) {
        $("body").css("overflow", "hidden");
        $thankYou.hide();
        $error.hide();
        $formPopup.addClass ("show");
        $popupTitle.html(package+" package");

        // attach send button handler
        $sendButton.on ("click", sendHandler);

        // attach enter key handler
        $formInputs.keypress(function(e) {
            if(e.which == 13) {
                sendHandler(e);
            }
        });

        // attach close button handler
        $closeButton.on ("click", function () {
            hideFormPopup ();
        });

        function sendHandler(e) {
            var name = $formInputs.filter ("[name=name]").val();
            var email = $formInputs.filter ("[name=email]").val();
            var msg = $formInputs.filter ("[name=message]").val();

            if (name && email && validateEmail(email)) {

                saveToServer({
                    name: name,
                    email: email,
                    msg: msg,
                    package: package
                }, function () {
                    $thankYou.show();
                }, function () {
                    $error.show();
                });

            } else {
                if (!name) {
                    shakeInput ($formInputs.filter ("[name=name]"));
                } else {
                    shakeInput ($formInputs.filter ("[name=email]"));
                }
            }

            e.preventDefault();
        }
    }

    function hideFormPopup () {
        $("body").css("overflow-y", "scroll");
        $formPopup.removeClass ("show");
    
        // detach handlers
        $sendButton.off();
        $closeButton.off();
    }

    function saveToServer (object, successCallback, errorCallback) {
        $.ajax({
            method: "GET",
            url: "http://tardis3d.ru/pre-order/sendmail.php",
            data: object
        })
        .done(successCallback)
        .error(errorCallback);
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function shakeInput($input) {
        $input
            .removeClass('input-shake')
            .addClass('input-shake')
            .on('webkitAnimationEnd oAnimationEnd', function(){
                $(this).removeClass('input-shake');
            });
    }
});