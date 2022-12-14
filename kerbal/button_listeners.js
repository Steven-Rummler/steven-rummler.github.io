const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener("change", (event) => {
  build_display();
  document.getElementById("label").innerHTML =
    "<button>Extracting and Compiling Data...</button > ";
  const fileList = event.target.files;
  const reader = new FileReader();
  reader.onload = function () {
    process_file(reader);
    display();
  };
  reader.readAsText(fileList[0]);
});
function useExample() {
  build_display();
  fetch("persistent.sfs").then((response) => {
    const reader = new FileReader();
    reader.onload = function () {
      process_file(reader);
      display();
    };
    response.blob().then((file) => {
      reader.readAsText(file);
    });
  });
}

function display() {
  display_recommender();
  display_charts();
  document.getElementById("input").classList.add("loaded");
  setTimeout(function () {
    document.getElementById("buttons").innerHTML =
      '<button onclick="location.reload()" >Start Over with a New Save</button > ';
  }, 1500);
}
