const embed = 'https:/stevenrummler.com/charts/embed';
let engine = "apexcharts";
let data = "Undergraduate certificate:17976,Associates degree:25608,Bachelor's degree:32568,Master's degree:48468,Doctoral degree:53112";
let format = "currency";
let height = 200;
let width = 400;

document.querySelector("#engine").addEventListener("change", () => {
  engine = document.querySelector("#engine").value;
  update();
});

document.querySelector("#dataFormat").addEventListener("change", () => {
  const value = document.querySelector("#dataFormat").value;
  data = value.split("&format=")[0];
  format = value.split("&format=")[1];
  update();
});

document.querySelector("#height").addEventListener("change", () => {
  height = document.querySelector("#height").value;
  update();
});

document.querySelector("#width").addEventListener("change", () => {
  width = document.querySelector("#width").value;
  update();
});

function update() {
  const newURL = `${embed}?engine=${engine}&data=${data}&format=${format}`;
  console.log(`Updating code and iframe to ${newURL}`);
  document.querySelector("#dynamic").src = newURL;
  document.querySelector("#dynamic").height = `${height}px`;
  document.querySelector("#dynamic").width = `${width}px`;
  document.querySelector('code').innerText = `<iframe id="dynamic"
      src="${newURL}"
      height="${height}px" width="${width}px" style="border: none"></iframe>`
}

update();

document.querySelector('.copy').addEventListener('click', () => {
  const code = document.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    alert('Embed link copied to clipboard');
  });
});