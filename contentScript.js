console.log("Hello from content script");

// TEmporary test object to save the result into the storage
const cerberusElement = {
  action: "",
  dateTime: "",
  content: "",
};

// function to get full xpath from the current page
const getElementXpath = function (nodeElement) {
  const elementIndex = (sibling, name) => {
    return sibling
      ? elementIndex(
          sibling.previousElementSibling,
          name || sibling.localName
        ) +
          (sibling.localName == name)
      : 1;
  };

  const segments = (element) => {
    if (!element || element.nodeType !== 1) {
      return [""];
    } else {
      return [
        ...segments(element.parentNode),
        `${element.localName.toLowerCase()}[${elementIndex(element)}]`,
      ];
    }
  };

  return segments(nodeElement).join("/");
};

// function to get full source code <html>...</html> from the current page
const getPageSourceCode = function () {
  return document.documentElement.outerHTML;
};

// function to save element to the clipboard by temporary creating a new node
const copyToClipboard = function (elementToCopy) {
  let temporaryElement = document.createElement("textarea");
  document.body.appendChild(temporaryElement);
  temporaryElement.value = elementToCopy;
  temporaryElement.select();
  document.execCommand("copy");
  document.body.removeChild(temporaryElement);
};

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

// main erratum function
const getErratumElement = function (event) {
  const xpath = getElementXpath(event.target);
  const htmlSourceCode = getPageSourceCode();
  const erratumElement = `erratum=${xpath},${htmlSourceCode}`;
  copyToClipboard(erratumElement);
  saveToStorage("erratum", erratumElement);
  console.log(xpath);
  console.log(erratumElement);
};

// handle node highlitghting on page
const addHighlightOnElement = function (event) {
  // highlight the mouseover target
  event.target.style.backgroundColor = "orange";
  event.target.parentNode.backgroundColor = "blue";
};

const removeHighlightOnElement = function (event) {
  // highlight the mouseover target
  event.target.style.backgroundColor = "";
  event.target.parentNode.backgroundColor = "";
};

// functions to add or remove listeners
const setUpErratum = function () {
  document.addEventListener("mouseover", addHighlightOnElement, false);
  document.addEventListener("mouseout", removeHighlightOnElement, false);
  document.addEventListener("click", getErratumElement);
};

const removeErratum = function () {
  document.removeEventListener("mouseover", addHighlightOnElement, false);
  document.removeEventListener("mouseout", removeHighlightOnElement, false);
  document.removeEventListener("click", getErratumElement);
};

// function that receive a message from the background service worker with the action to perform
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "received message from the backgound service"
  );
  if (request.action === "erratum" && request.isActive === true) {
    setUpErratum();
    sendResponse({ text: "erratum is active" });
  } else {
    removeErratum();
    sendResponse({ text: "erratum is not active" });
  }
});
