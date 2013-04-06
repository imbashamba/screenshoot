var pasteCatcher;
window.onload = function(){
    // We start by checking if the browser supports the
    // Clipboard object. If not, we need to create a
    // contenteditable element that catches all pasted data
    if (!window.Clipboard) {
    pasteCatcher = document.createElement("div");
    // Firefox allows images to be pasted into contenteditable elements
    pasteCatcher.setAttribute("contenteditable", "true");
    pasteCatcher.setAttribute("id", "ff_pastebox");

    // We can hide the element and append it to the body,
    pasteCatcher.style.opacity = 0;
    document.body.appendChild(pasteCatcher);

    // as long as we make sure it is always in focus
    pasteCatcher.focus();
    document.addEventListener("click", function() { pasteCatcher.focus(); });

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
    console.log(blob);
    uploadFile(blob,'file1.png');
    // The URL can then be used as the source of an image
    createImage(source);
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
    createImage(child.src);
    }
}
}

/* Creates a new image from a given source */
function createImage(source) {

    var pastedImage = new Image();
    pastedImage.onload = function() {
    // You now have the image!
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

    $('#main_holder').append(pastedImage);


}

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
        console.log(response)
        var selElem = $('<input type="text" size="100" value="http://'+window.location.host+response+'" />');
        $('#link_holder').prepend(selElem);
        selElem.focus();
        selElem.select();
        },
        error: function(jqXHR, textStatus, errorMessage) {
            console.log(errorMessage); // Optional
    }
});
}