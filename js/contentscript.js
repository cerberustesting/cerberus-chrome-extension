function start() {
    this.shouldShow = true;
    this.styleNodeIdString = 'schema-highlighter-node-style-id';
    this.outlineStyleNodeIdString = 'schema-highlighter-display-outline-node-style-id';
    this.styleNodeHoverClassString = 'schema-highlighter-display-hover-node';
    this.selectedElement = "";
    this.shouldShowOutlines = false;

    init();
}

function init() {
    // Initialize event listeners
    document.body.onclick = (ev) => {
        if (this.shouldShow) {
            this.elementClicked(ev);
        }
    }

    // Highlight on mouse over, except for created popup
    document.body.onmouseover = (ev) => {
        if (this.shouldShow && !this.isPartOfGeneratedPopup(ev.target)) {
            ev.target.classList.add(this.styleNodeHoverClassString);
            ev.target.setAttribute("data-cerberus-xpath-generator","selected");
            //this.elementClicked(ev);
        }
    };

    // unHighlight on mouse leave
    document.body.onmouseout = (ev) => {
        if (this.shouldShow) {
            ev.target.classList.remove(this.styleNodeHoverClassString);
            ev.target.removeAttribute("data-cerberus-xpath-generator");
        }
    };

    // Confirm navigation
    window.onbeforeunload = () => true;

    // Start the script
    invokeContentScript();
}

function invokeContentScript() {
    this.shouldShow = true;
    injectHighlightStyle();
}


function isPartOfGeneratedPopup(el) {
    const generatedPopup = document.querySelector('#content-script-harness');
    return generatedPopup && generatedPopup.contains(el);
}

function injectStyleNode(styleToInject, nodeId) {
    if (!document.querySelector(`#${nodeId}`)) {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('type', 'text/css');
        styleEl.setAttribute('id', nodeId);
        styleEl.innerHTML = styleToInject;
        document.head.appendChild(styleEl);
    }
}

function injectHighlightStyle() {
    const styleToInject = `
            .${this.styleNodeHoverClassString} {
                background-color: #F3B600 !important;
                outline: solid orange 2px !important;
                cursor: pointer !important;
            }
            body {
                padding-top: 264px !important;
            }
        `;
    this.injectStyleNode(styleToInject, this.styleNodeIdString);
}

function injectOutlineStyle() {
    const styleToInject = `
            * {
                outline: solid blue 1px !important;
                box-shadow: 2px 2px 5px #4671B2 !important;
            }
        `;
    this.injectStyleNode(styleToInject, this.outlineStyleNodeIdString);
}

function convertHTMLToDisplayText(htmlString) {
    let encodedString = htmlString.replace(/&/g, '&amp;');
    encodedString = encodedString.replace(/</g, '&lt;');
    encodedString = encodedString.replace(/>/g, '&gt;');
    encodedString = encodedString.replace(/"/g, '&quot;');
    return encodedString
}

function elementClicked(ev) {
    if (!this.isPartOfGeneratedPopup(ev.target)) {
        var element = ev.target;

        const allXpaths = getAllXpaths(element);
        const tagName = element.tagName ? element.tagName.toUpperCase() : "";
        let tagContent = element.innerText || element.innerHTML;

        if (typeof tagContent === 'string') {
            tagContent = tagContent.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
            tagContent = tagContent.length > 50 ? tagContent.slice(0, 47) + '…' : tagContent;
        }

        this.selectedElement = convertHTMLToDisplayText(ev.target.outerHTML);
        //this.selectedElementParent = convertHTMLToDisplayText(ev.target.parentNode.outerHTML);
        //this.selectedElementParentParent = convertHTMLToDisplayText(ev.target.parentNode.parentNode.outerHTML);

        var mySelectedElementPre = document.createElement('pre');
        mySelectedElementPre.className = "ft-syntax-highlight";
        mySelectedElementPre.style= "max-height:60px;font-size:1.1rem";
        var mySelectedElementCode = document.createElement('code');
        mySelectedElementPre.appendChild(mySelectedElementCode);
        mySelectedElementCode.innerHTML = this.selectedElement;
        document.getElementById("selectedElement").innerHTML = '';
        document.getElementById("selectedElement").appendChild(mySelectedElementPre);
        document.getElementById("generatedxpath").innerHTML = "";

        //sort by level
        allXpaths.sort((objA, objB) => objB.level - objA.level);

        for (var xpath in allXpaths){

            //LEVEL
            var level = allXpaths[xpath].level;
            var title = allXpaths[xpath].title;
            var myXpathLevel = document.createElement('div');
            var levelStyle = getLevelStyle(level);
            myXpathLevel.style=levelStyle.style;
            myXpathLevel.innerHTML = levelStyle.html;
            myXpathLevel.title = title;

            //COUNT
            var count = allXpaths[xpath].count;
            var myXpathCount = document.createElement('div');
            myXpathCount.style="display:inline-block;margin-bottom:0;margin-left:50px";
            myXpathCount.innerHTML = count;

            //BUTTON COPY CLIPBOARD
            var myXpathButton = document.createElement('button');
            myXpathButton.className="btn btn-primary";
            myXpathButton.innerHTML = "copy";
            myXpathButton.setAttribute('onclick','copyXpathToClipboard(this)');

            //XPATH
            var xpath = allXpaths[xpath].xpath;
            var myXpathTab = document.createElement('p');
            myXpathTab.style="display:inline-block;margin-bottom:0;margin-left:50px";
            myXpathTab.innerHTML = xpath;

            //BUILD LINE
            var myXpathLine = document.createElement('div');
            myXpathLine.className = 'xpathLine';
            myXpathLine.appendChild(myXpathLevel);
            myXpathLine.appendChild(myXpathCount);
            //myXpathLine.appendChild(myXpathButton);
            myXpathLine.appendChild(myXpathTab);

            document.getElementById("generatedxpath").appendChild(myXpathLine);
        }
    }
}

/*
Return levelObject style regarding the level between 1 and 5
 */
function getLevelStyle(level){
    var levelObject = {};
    if(level == 1){
        levelObject.style="display:inline-block;color:var(--crb-red-color);font-size:16px";
        levelObject.html="&#9632;&#9633;&#9633;&#9633;&#9633; "
    }
    if(level == 2){
        levelObject.style="display:inline-block;color:var(--crb-orange-color);font-size:16px";
        levelObject.html="&#9632;&#9632;&#9633;&#9633;&#9633; "
    }
    if(level == 3){
        levelObject.style="display:inline-block;color:var(--crb-yellow-color);font-size:16px";
        levelObject.html="&#9632;&#9632;&#9632;&#9633;&#9633; "
    }
    if(level == 4){
        levelObject.style="display:inline-block;color:var(--crb-green-color);font-size:16px";
        levelObject.html="&#9632;&#9632;&#9632;&#9632;&#9633; "
    }
    if(level == 5){
        levelObject.style="display:inline-block;color:var(--crb-green-color);font-size:16px";
        levelObject.html="&#9632;&#9632;&#9632;&#9632;&#9632;"
    }
    return levelObject;
}



function showHideOutlines() {
    if (this.shouldShowOutlines) {
        this.injectOutlineStyle();
    } else {
        this.removeIdNode(`#${this.outlineStyleNodeIdString}`);
    }
}


function removeIdNode(nodeString) {
    const node = document.querySelector(nodeString);
    if (node) {
        node.remove();
    }
}

function exit() {
    this.removeIdNode(`#${this.styleNodeIdString}`);
    this.removeIdNode(`#${this.outlineStyleNodeIdString}`);
    this.shouldShowOutlines = false;
    this.shouldShow = false;
    window.onbeforeunload = null;
}

function copyXpathToClipboard(element) {
    let temporaryElement = document.createElement("textarea");
    document.body.appendChild(temporaryElement);
    temporaryElement.value = element.parentNode.getElementsByTagName('p')[0].innerHTML;
    temporaryElement.select();
    document.execCommand("copy");
    document.body.removeChild(temporaryElement);
}