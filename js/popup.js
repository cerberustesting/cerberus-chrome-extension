/*
Add listener on StartButton. When toggle, send message toggleStartButton and tabId
 Listener is on background.js
 */
if (document.getElementById('toggleButton')!=undefined) {
    document.getElementById('toggleButton').addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs && tabs.length > 0) {
                chrome.runtime.sendMessage({action: "toggleStartButton", tabId: tabs[0].id});
            } else {
                console.error("No active tab found.");
            }
        });
    });
}



/*
Toggle Div creation or deletion
 */
this.contentDiv = null;
function toggleDiv() {
    if (this.contentDiv != null) {
        removeDiv();
    } else {
        createDiv();
        document.getElementById('content-script-close-harness').addEventListener('click', () => {
            exit();
            removeDiv();
        });
    }
}


/*
Create Div
 */
function createDiv() {
    //Global Div
    var myContentDiv = document.createElement('dialog');
    myContentDiv.id = 'content-script-harness';
    myContentDiv.className = 'contentscript';
    document.body.prepend(myContentDiv);
    //Close Button
    var myCloseButton = document.createElement('div');
    myCloseButton.className = 'xpath-close-button-harness';
    myCloseButton.id = 'content-script-close-harness';
    myCloseButton.innerHTML = ' x ';
    document.getElementById("content-script-harness").appendChild(myCloseButton);
    //Xpath section
    var myDiv = document.createElement('div');
    myDiv.className = 'xpath-output-harness';
    myDiv.id = 'myTopDiv';
    document.getElementById("content-script-harness").appendChild(myDiv);
    //
    var myDiv1 = document.createElement('div');
    myDiv1.className = 'xpath-element-header';
    myDiv1.textContent = ' Selected Element: ';

    var myDiv2 = document.createElement('div');
    myDiv2.className = 'xpath-element-content';
    myDiv2.id = 'selectedElement';
    myDiv2.innerHTML = 'Click on element to find xpath'

    var myDiv3 = document.createElement('div');
    myDiv3.className = 'xpath-element-header';
    myDiv3.textContent = ' Generated Xpaths: ';

    var myDiv4 = document.createElement('div');
    myDiv4.className = 'xpath-element-xpaths';
    myDiv4.id = 'generatedxpath';

    document.getElementById("myTopDiv").appendChild(myDiv1);
    document.getElementById("myTopDiv").appendChild(myDiv2);
    document.getElementById("myTopDiv").appendChild(myDiv3);
    document.getElementById("myTopDiv").appendChild(myDiv4);

    this.contentDiv = myContentDiv;
}

/*
Remove Div
 */
function removeDiv() {
    document.body.removeChild(this.contentDiv);
    this.contentDiv = null;
}