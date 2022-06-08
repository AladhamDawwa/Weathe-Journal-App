/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = "5698a4792771168014e137c1870b3572";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

let data = {};
document.getElementById("generate").addEventListener("click", () => {
  getTemperature(document.getElementById("zip").value, apiKey)
    .then((result) => {
      return {
        temp: result,
        feel: document.getElementById("feelings").value,
        date: newDate,
      };
    })
    .then((result) => {
      postData(result);
    })
    .then(async () => {
      await retrieveData();
    });
});

const getTemperature = async (code, key) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${code}&appid=${key}`
  );
  try {
    const data = await res.json();
    return data.main.temp;
  } catch (error) {
    console.log(`Error is ${error}`);
  }
};

const postData = async (data) => {
  await fetch("/send", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const retrieveData = async () => {
  const request = await fetch("/all");
  try {
    // Transform into JSON
    const allData = await request.json();
    // Write updated data to DOM elements
    document.getElementById("temp").innerHTML =
      Math.round(allData.temp) + "degrees";
    document.getElementById("content").innerHTML = allData.feel;
    document.getElementById("date").innerHTML = allData.date;
  } catch (error) {
    console.log(`Error is ${error}`);
  }
};
