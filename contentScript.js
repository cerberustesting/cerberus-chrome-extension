// Temporary test object to save the result into the storage
const cerberusElement = {
  action: "",
  dateTime: "",
  content: "",
};

// function to generate xpath from https://github.com/trembacz/xpath-finder
const getXPathFromElement = (element) => {
  let nodeElement = element;
  const parts = [];
  while (nodeElement && nodeElement.nodeType === Node.ELEMENT_NODE) {
    let nbOfPreviousSiblings = 0;
    let hasNextSiblings = false;
    let sibling = nodeElement.previousSibling;
    while (sibling) {
      if (
        sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
        sibling.nodeName === nodeElement.nodeName
      ) {
        nbOfPreviousSiblings++;
      }
      sibling = sibling.previousSibling;
    }
    sibling = nodeElement.nextSibling;
    while (sibling) {
      if (sibling.nodeName === nodeElement.nodeName) {
        hasNextSiblings = true;
        break;
      }
      sibling = sibling.nextSibling;
    }
    const prefix = nodeElement.prefix ? `${nodeElement.prefix}:` : "";
    const nth =
      nbOfPreviousSiblings || hasNextSiblings
        ? `[${nbOfPreviousSiblings + 1}]`
        : "";
    parts.push(prefix + nodeElement.localName + nth);
    nodeElement = nodeElement.parentNode;
  }
  return parts.length ? `/${parts.reverse().join("/")}` : "";
};

// function to get full source code <html>...</html> from the current page
const getPageSourceCode = () => {
  return document.documentElement.outerHTML;
};

const displayCopyNotification = () => {
  const notificationContainerHtml = `<div id="notification-container"></div>`;
  const notificationId = `${cerberusElement.action}-${cerberusElement.dateTime}`;
  const notificationHTML = `
    <div id="${notificationId}" class="notification">
      <p>${cerberusElement.content.slice(0, 40)}...</p>
    </div>
  `;

  let notificationContainer = document.getElementById("notification-container");

  if (!notificationContainer) {
    console.log("inject notif container");
    document.body.insertAdjacentHTML("beforeend", notificationContainerHtml);
    notificationContainer = document.getElementById("notification-container");
  }
  notificationContainer.insertAdjacentHTML("afterbegin", notificationHTML);

  setTimeout(() => {
    const notification = document.getElementById(notificationId);
    if (notification) {
      notificationContainer.removeChild(notification);
    }
  }, 3000);
};

// function to save element to the clipboard by temporary creating a new node
const copyToClipboard = () => {
  let temporaryElement = document.createElement("textarea");
  document.body.appendChild(temporaryElement);
  temporaryElement.value = cerberusElement.content;
  temporaryElement.select();
  document.execCommand("copy");
  document.body.removeChild(temporaryElement);
  displayCopyNotification();
};

/*
// TODO FOR NEXT IMPLEMENTATION
// function to save an element to the sync storage with a cerberusElement object
const saveToStorage = function (action, elementToSave) {
  cerberusElement.action = action;
  cerberusElement.dateTime = new Date().toLocaleString();
  cerberusElement.content = elementToSave;
  chrome.storage.sync.get(["cerberusElements"], (response) => {
    console.log(response);
    let cerberusElements = [];
    if (response.cerberusElements) {
      cerberusElements = response.cerberusElements;
    }
    cerberusElements.push(cerberusElement);
    chrome.storage.sync.set(cerberusElements);
  });
};
*/

// main erratum function
const getErratumElement = (event) => {
  event.preventDefault();
  const xpath = getXPathFromElement(event.target);
  const htmlSourceCode = getPageSourceCode();
  cerberusElement.action = "erratum";
  cerberusElement.dateTime = new Date().toLocaleString();
  cerberusElement.content = `erratum=${xpath},${htmlSourceCode}`;
  console.log(cerberusElement);
  copyToClipboard();
  //saveToStorage("erratum", erratumElement);
};

// handle node highlitghting on page
const addHighlightOnElement = (event) => {
  event.preventDefault();
  // highlight the mouseover target
  event.target.style.backgroundColor = "#333333";
  event.target.style.color = "white";
  event.target.style.cursor = "pointer";
};

const removeHighlightOnElement = (event) => {
  event.preventDefault();
  // remove highlight  the mouseover target
  event.target.style.backgroundColor = "";
  event.target.style.color = "";
  event.target.style.cursor = "default";
};

// functions to add or remove listeners and activate action
const setUpAction = (eventType, action) => {
  document.addEventListener("mouseover", addHighlightOnElement, false);
  document.addEventListener("mouseout", removeHighlightOnElement, false);
  document.addEventListener(eventType, action);
};

const removeAction = (eventType, action) => {
  document.removeEventListener("mouseover", addHighlightOnElement, false);
  document.removeEventListener("mouseout", removeHighlightOnElement, false);
  document.removeEventListener(eventType, action);
};

const toggleErratumAction = (request) => {
  request.action === "erratum" && request.isActive === true
    ? setUpAction("click", getErratumElement)
    : removeAction("click", getErratumElement);
};

// function that receive a message from the background service worker with the action to perform
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "erratum") {
    toggleErratumAction(request);
  } else {
    console.err("unsupported function");
  }
});
