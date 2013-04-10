(function(){

var pasteCatcher;
var clicklistener = function() { pasteCatcher.focus(); };
window.onload = function(){
        // Эта часто почти полностью копирует проект https://github.com/JoelBesada/pasteboard
        // изменения: я вынес pasteCatcher для файрфокса за границы страницы, чтобы курсор не мигал

        // We start by checking if the browser supports the
        // Clipboard object. If not, we need to create a
        // contenteditable element that catches all pasted data
        if (!window.Clipboard) {
        pasteCatcher = document.createElement("div");
        // Firefox allows images to be pasted into contenteditable elements
        pasteCatcher.setAttribute("contenteditable", "true");
        pasteCatcher.setAttribute("id", "ff_pastebox");

        document.body.appendChild(pasteCatcher);

        // as long as we make sure it is always in focus
        pasteCatcher.focus();

        document.addEventListener("click", clicklistener);

    }
// Add the paste event listener
window.addEventListener("paste", pasteHandler);
}
/* Handle paste events */
function pasteHandler(e) {
    // We need to check if event.clipboardData is supported (Chrome)
    if (e.clipboardData) {
    // Get the items from the clipboard
    var items = e.clipboardData.items;
    if (items) {
    // Loop through all items, looking for any kind of image
    for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
    // We need to represent the image as a file,
    var blob = items[i].getAsFile();
    // and use a URL or webkitURL (whichever is available to the browser)
    // to create a temporary URL to the object
    var URLObj = window.URL || window.webkitURL;
    var source = URLObj.createObjectURL(blob);
    uploadFile(blob,'file1.png');

    }
}
}
// If we can't handle clipboard data directly (Firefox),
// we need to read what was pasted from the contenteditable element
} else {
    // This is a cheap trick to make sure we read the data
    // AFTER it has been inserted.
    setTimeout(checkInput, 1);
    }
}

/* Parse the input in the paste catcher element */
function checkInput() {
    // Store the pasted content in a variable
    var child = pasteCatcher.childNodes[0];

    // Clear the inner html to make sure we're always
    // getting the latest inserted content
    pasteCatcher.innerHTML = "";

    if (child) {
    // If the user pastes an image, the src attribute
    // will represent the image as a base64 encoded string.
    if (child.tagName === "IMG") {
    foxyImage(child.src);
    }
}
}

/* Обработка пасты в ФФ, без создания канваса не знаю как получить блоб :( */
function foxyImage(source) {

    var pastedImage = new Image();
    pastedImage.onload = function() {

    canvas = document.createElement('canvas');
    canvas.width = pastedImage.width;
    canvas.height = pastedImage.height;
    context = canvas.getContext('2d');
    context.drawImage(pastedImage,0,0);
    try
    {
    canvas.toBlob(function(blob) {
        uploadFile(blob,'file1.png');
    });
    }
    catch (e)
    {
        console.log(e);
    }

}
    pastedImage.src = source;

}

//загрузка на сервер
function uploadFile(blobFile, fileName) {
    var fd = new FormData();
    fd.append("files", blobFile, fileName);

    $.ajax({
        url: "upload/",
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
            displayLink(response);
        },
        error: function(jqXHR, textStatus, errorMessage) {
            console.log(errorMessage); // Optional
    }
});
    showProgress();
}

//показываем лоадинг-пик
function showProgress()
{
    $('#working_div').hide();
    $('#result_div').show();
}

//выводим результаты, сразу выделяя ссылку
function displayLink(text){
    $('#squaresWaveG').hide();
    var selElem = $('#link_box');
    selElem.val('http://'+window.location.host+text);
    selElem.focus();
    selElem.select();
    selElem.click(function(event){
        event.stopPropagation();
    });
    document.removeEventListener("click", clicklistener);
    $('#result_img').attr('src','http://'+window.location.host+text);
    $('#result_img').show();
}


})();