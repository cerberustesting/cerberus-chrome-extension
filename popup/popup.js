let cerberusElements = [];

const erratumButton = document.getElementById("erratum-btn");
erratumButton.addEventListener("click", () => {
  chrome.storage.sync.get(["isErratumActive"], (response) => {
    chrome.storage.sync.set(
      {
        isErratumActive: !response.isErratumActive,
      },
      () => {
        erratumButton.textContent = !response.isErratumActive
          ? "Inactive"
          : "Active";
      }
    );
  });
});

chrome.storage.sync.get(["cerberusElements"], (res) => {
  cerberusElements = res.cerberusElements ? res.cerberusElements : [];
  console.log(cerberusElements);
});
