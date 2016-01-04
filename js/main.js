$(function () {
    /* TOP RIGHT BOTTOM LEFT */

    $('.a').tooltip({
        position: 'top',
        contentSelector: 'span'
    });

    $('.b').tooltip({
        position: 'right',
        contentSelector: 'span'
    });

    $('.c').tooltip({
        on: 'click',
        position: 'bottom'
    });

    $('.d').tooltip({
        on: 'click',
        position: 'bottom'
    });




    /* FORM */

    $(':input').tooltip({
        position: 'right'
    });
});
