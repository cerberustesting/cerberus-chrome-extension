//let cerberusElements = [];

const erratumButton = document.getElementById("erratum-btn");
chrome.storage.sync.get(["isErratumActive"], (response) => {
  setButtonStyle(response.isErratumActive);
});

erratumButton.addEventListener("click", () => {
  chrome.storage.sync.get(["isErratumActive"], (response) => {
    chrome.storage.sync.set(
      {
        isErratumActive: !response.isErratumActive,
      },
      () => {
        setButtonStyle(!response.isErratumActive);
      }
    );
  });
});

const setButtonStyle = (isActive) => {
  if (isActive) {
    erratumButton.classList.add("erratum-btn-active");
  } else {
    erratumButton.classList.remove("erratum-btn-active");
  }
};

/*
chrome.storage.sync.get(["cerberusElements"], (res) => {
  cerberusElements = res.cerberusElements ? res.cerberusElements : [];
});
*/
