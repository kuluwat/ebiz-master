function isNumber(ele) {
    var vchar = String.fromCharCode(ele.keyCode);
    if ((vchar < '0' || vchar > '9') && (vchar != '-')) { return false; }

    ele.onKeyPress = vchar;
}
function isReadonly(ele) {

    return false;
   
}
function no_backspaces(event) {
    backspace = 8;
    if (event.keyCode == backspace) event.preventDefault();
}

function myTest() {
    alert('Welcome to custom js');
}

// $(function() {
//     alert('Hello, custom js');
// });