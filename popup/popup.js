//let cerberusElements = [];

const erratumButton = document.getElementById("erratum-btn");
chrome.storage.sync.get(["isErratumActive"], (response) => {
  setButtonStyle(response.isErratumActive);
});

erratumButton.addEventListener("click", () => {
  chrome.storage.sync.get(["isErratumActive"], (response) => {
    console.log("hello");
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
  console.log(isActive);
  if (isActive) {
    console.log("btn active");
    erratumButton.classList.add("erratum-btn-active");
  } else {
    console.log("btn not active");
    erratumButton.classList.remove("erratum-btn-active");
  }
};

/*
chrome.storage.sync.get(["cerberusElements"], (res) => {
  cerberusElements = res.cerberusElements ? res.cerberusElements : [];
});
*/
