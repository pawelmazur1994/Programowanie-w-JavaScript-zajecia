const apiKey = "c4885943eadf9be6247d524937f10a59";

function submitForm() {
  const location = document.getElementById("search").value;
  let locationObject = JSON.parse(localStorage.getItem("location")) || {};
  for (let i = 9; i > 0; i--) {
    locationObject[i] = locationObject[i - 1];
  }
  locationObject[0] = location;
  localStorage.setItem("location", JSON.stringify(locationObject));
  fetchWeatherData(location);
}

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  submitForm();
});

function fetchWeatherData(location) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      let temperature = data.main.temp;
      temperature = temperature - 273.15;
      temperature = temperature.toFixed(1);
      const humidity = data.main.humidity;
      const weather = data.weather[0].main;
      console.log(weather);
      const icon = data.weather[0].icon;
      console.log(data);
      const tableBody = document.getElementById("data");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
            <td>${location}</td>
            <td>${temperature} &#8451;</td>
            <td>${humidity}</td>
            <td><img src="http://openweathermap.org/img/wn/${icon}@2x.png"></td>
            <td><button onclick="deleteCity(this);">Delete</button></td>
        `;
      tableBody.appendChild(newRow);
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteCity(el){
   var tbl = el.parentNode.parentNode.parentNode;
   var row = el.parentNode.parentNode.rowIndex;

     tbl.deleteRow(row - 1);

}

function loadDataOnStartup() {
  const locationObject = JSON.parse(localStorage.getItem("location"));
  if (locationObject) {
    for (let i = 0; i < 10; i++) {
      if (locationObject[i]) {
        fetchWeatherData(locationObject[i]);
      }
    }
  }
}

window.onload = function () {
  loadDataOnStartup();
};