const erratumButton = document.getElementById("erratum-btn");

erratumButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setOnMouseClickListener,
  });
});

function setOnMouseClickListener() {
  document.addEventListener("click", (event) => {
    function getElementXpath(nodeElement) {
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
    }

    function copyToClipboard(xpathToCopy) {
      let temporaryElement = document.createElement("textarea");
      document.body.appendChild(temporaryElement);
      temporaryElement.value = xpathToCopy;
      temporaryElement.select();
      document.execCommand("copy");
      document.body.removeChild(temporaryElement);
    }

    const xpath = getElementXpath(event.target);
    const htmlSourceCode = document.documentElement.outerHTML;
    const cerberusErratumInput = `erratum=${xpath},${htmlSourceCode}`;
    copyToClipboard(cerberusErratumInput);
    console.log(xpath);
    console.log(cerberusErratumInput);
  });
}
