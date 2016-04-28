var divs = document.getElementsByClassName('alert');

/**
 * Test if scriptes are loaded correctly
 */
for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener("click", highlightThis);
}

function highlightThis(event) {
    //event.stopPropagation();

    var backgroundColor = this.style.backgroundColor;
    this.style.backgroundColor = 'yellow';
    alert(this.className);
    this.style.backgroundColor = backgroundColor;
}
/**
 * Add drag functions
 */
$(document).ready( function() {
    var $draggable = $('.draggable').draggabilly({
        containment: true
    });
});
