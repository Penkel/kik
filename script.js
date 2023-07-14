// const sample = require('./slides.json')

const formInput = document.querySelector(".form-control");
const locTitle = document.querySelector(".title");
const locArt = document.querySelector(".art");
const artCont = document.querySelector(".art-container");
const fullScreen = document.querySelector(".fadeMe");
const root = document.documentElement;
const advList = document.querySelector(".adv-list");

let advIndex = 0;
let currentLoc
// DropDown Menues

document.querySelector(".glow").addEventListener(
  "click",
  () => {
    document.querySelector(".glow").classList.remove("glow");
  },
  { once: true }
);

const volumeSlider = document.querySelector(".volume-slider");
const audio = document.querySelector("audio");
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value * 0.01;
});

document.addEventListener('keydown', (event) => {
  switch(event.keyCode) {
      case 39:
        changeLoc(locs[advIndex].locations[locs[advIndex].locations.indexOf(currentLoc) + 1].code);
        console.log(ееее)
        break
      case 37:
        changeLoc(locs[advIndex].locations[locs[advIndex].locations.indexOf(currentLoc) - 1].code);
        console.log(ееее)
        break
  }
})

const muteCheckbox = document.querySelector(".muteButton");
function toggleMute() {
  if (muteCheckbox.checked) {
    audio.pause();
  } else {
    audio.play();
  }
}

const heightSlider = document.querySelector(".art-height-slider");
heightSlider.addEventListener("input", () => {
  artCont.style.height = heightSlider.value + "vh";
});

const epicArtButton = document.querySelector(".epicArtButton");
let epicShit;
function toggleEpicArt() {
  document.querySelectorAll(".epic").forEach((epic) => {
    epic.style.removeProperty("filter");
    console.log(epic);
  });
  fullScreen.style.removeProperty("filter");
  document.querySelectorAll(".epic").forEach((epic) => {
    clearInterval(epicShit);
  });
  locArt.classList.toggle("epic");
  fullScreen.classList.toggle("epic");

  if (epicArtButton.checked) {
    console.log(locs);
    let epicMeter = { direction: "up", power: 1 };
    epicShit = setInterval(() => {
      if (epicMeter.power < 3 && epicMeter.direction === "up") {
        epicMeter.power += 0.05;
      } else if (epicMeter.power > 0.8 && epicMeter.direction === "down") {
        epicMeter.power -= 0.05;
      } else {
        if (epicMeter.direction === "up") {
          epicMeter.direction = "down";
        } else {
          epicMeter.direction = "up";
        }
      }
      document.querySelectorAll(".epic").forEach((epic) => {
        epic.style.filter = `hue-rotate(${epicMeter.power * 99}deg) contrast(${
          epicMeter.power
        }) blur(${epicMeter.power / 3}px) saturate(${Math.random() * 6})`;
      }, 10);
    });
  } else {
    clearInterval(epicShit);
  }
}
const toggleFade = document.querySelector(".fullScreenButton");
let isFading = true;
function toggleFullScreen() {
  if (toggleFade.checked) {
    isFading = true;
  } else {
    isFading = false;
  }
}

let locs = [];

async function getLocs() {
  try {
    await fetch("./slides.json")
      .then((results) => results.json())
      .then((data) => showInfo(data));
    console.log("Загрузились локи");
    console.log(locs.length);
    await locs.forEach((element) => {
      let advLink = document.createElement("button");
      advLink.classList.add("adv-select-button");
      advLink.style.background = `50% 25% / cover no-repeat url(./arts/${element.locations[0].pic})`;
      console.log(element.locations[0]);
      let name = document.createTextNode(element.adventure);
      advLink.appendChild(name);
      advList.appendChild(advLink);
      advLink.addEventListener("click", () => {
        changeAdventure(locs.indexOf(element));
      });
    });
    function showInfo(data) {
      console.warn(data);
      locs.push.apply(locs, data);
      JSON.stringify(locs);
      console.log(locs);
    }
  } catch {
    console.log("ТЫ ОБЛАЖАЛСЯ!");
  }
  // changeAdventure(0);
}

getLocs();

document.addEventListener("click", (e) => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]");
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;
  let currentDropdown;
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]");
    currentDropdown.classList.toggle("active");
  }

  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
    if (dropdown === currentDropdown) return;
    dropdown.classList.remove("active");
  });
});
let ts = 0;
let to = 3000;

document.addEventListener("mousemove", () => {
  ts = Date.now();
  fullScreen.style.display = "none";
});
document.addEventListener("keydown", () => {
  ts = Date.now();
  fullScreen.style.display = "none";
});
// document.addEventListener('keydown', goFullScreen())

setInterval(() => {
  if (Date.now() - ts > to && isFading === true) {
    fullScreen.style.display = "flex";
  }
});

class Location {
  constructor(key, title, art, music) {
    this.key = key;
    this.title = title;
    this.art = art;
    this.music = music;
  }
}

function changeAdventure(indx) {
  console.warn(document.querySelectorAll(".adv-select-button")[indx]);
  document
    .querySelectorAll(".adv-select-button")
    [advIndex].classList.remove("selected");
  document
    .querySelectorAll(".adv-select-button")
    [indx].classList.add("selected");
  advIndex = indx;
  console.log(advIndex);
  root.style.setProperty(
    "--cur-art",
    "url(./arts/" + locs[indx].locations[0].pic + ")"
  );
  locArt.src = "./arts/" + locs[indx].locations[0].pic;
  locTitle.textContent = `"${locs[indx].adventure}" приветствует вас!`;
  audio.src = "злой_замок.mp3";
  if (!muteCheckbox.checked) {
    audio.play();
  }
}

function changeLoc(inp) {
  // let userInput = document.querySelector(".loc-input").value.toLowerCase();
  // let userInput = formInput.value;
  // console.log(userInput);
  let curLocs = locs[advIndex].locations;
  currentLoc = curLocs.find(({ code }) => code === inp.toLowerCase());
  console.log(currentLoc);
  if (currentLoc == undefined) {
    alert("УПС! ЛОКИ ТАКОЙ НЕТ!");
  } else {
    audio.src = "./music/" + currentLoc.music;
    if (!muteCheckbox.checked) {
      audio.play();
    }
    locTitle.innerText = currentLoc.name;
    locArt.src = "./arts/" + currentLoc.pic;
    root.style.setProperty("--cur-art", "url(./arts/" + currentLoc.pic + ")");
    document.querySelector(".loc-input").value = "";
    console.log(locs[advIndex].locations.indexOf(currentLoc))
  }
}

function inpChange() {
  changeLoc(document.querySelector(".loc-input").value)
  console.log('frf')
}
console.log(locs);
