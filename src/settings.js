import './style.css';
import { getConfig, setConfig, deleteConfig } from './utils';
import { getClockTickerCallback, cities, timeZoneList } from './clocks';

// templates

let mainTemplate = require("./settings.handlebars");
let city_suggestion_template = require("./city_suggestion_list.handlebars");
let timeZoneSuggestionTemplate = require("./time_zone_suggestion_list.handlebars");
let clockEntryTemplate = require("./clock_entry.handlebars")

// set theme
document.documentElement.dataset.theme = "dark"

var config = getConfig()

console.log(config)

function component(config) {
    const element = document.createElement('div');
    element.innerHTML = mainTemplate(config)

    return element;
}

document.body.appendChild(component(config));


function turnOnSearchDropdown(event) {
    event.target.parentNode.querySelector(".dropdown-content").classList.add("show")
    if (event.target.classList.contains("city-input")) {
        cityFilterHandler(event)
    } else if (event.target.classList.contains("time-zone-input")) {
        timeZoneFilterHandler(event)
    }

}

function turnOffSearchDropdown(event) {
    event.target.parentNode.querySelector(".dropdown-content").classList.remove("show")
}

function updateConfig() {
    console.log("updateConfig")

    let clocksTable = document.getElementById("clock-table")

    let clocks = []
    for (let row of clocksTable.rows) {
        if (row.classList.contains("clock-entry")) {
            let city = row.querySelector(".city-input").value;
            let timeZone = row.querySelector(".time-zone-input").value
            if (timeZone) {
                row.querySelector(".clock").dataset.timeZone = timeZone
                clocks.push({ city: city, timeZone: timeZone })
            }
        }
    }

    console.log(clocks)

    config.clocks = clocks

    setConfig(config)
}

function citySelectHandler(event) {
    let target = event.target
    let row = target.closest("tr")
    row.querySelector(".city-input").value = target.dataset.city
    row.querySelector(".time-zone-input").value = target.dataset.timeZone
    updateConfig()
}

function cityFilterHandler(event) {
    let input = event.target.value.toLowerCase()
    let dropdown = event.target.parentNode.querySelector(".dropdown-content")
    const limit = 10
    let cityCandidates = []
    for (let [cityIdentifier, city] of cities) {
        if (cityIdentifier.toLowerCase().includes(input)) {
            if (cityCandidates.push(city) >= limit) {
                break
            }
        }
    }
    console.log(cityCandidates)
    dropdown.innerHTML = city_suggestion_template({ cities: cityCandidates })

    for (let option of dropdown.querySelectorAll("span")) {
        option.addEventListener("click", citySelectHandler)
    }
}

function timeZoneSelectHandler(event) {
    let target = event.target
    let row = target.closest("tr")
    row.querySelector(".time-zone-input").value = target.dataset.timeZone
    updateConfig()
}

function timeZoneFilterHandler(event) {
    let input = event.target.value.toLowerCase()
    let dropdown = event.target.parentNode.querySelector(".dropdown-content")
    const limit = 10
    console.log(timeZoneList)
    let timeZoneCandidates = []
    for (let timeZoneName of timeZoneList) {
        if (timeZoneName.toLowerCase().includes(input)) {
            if (timeZoneCandidates.push(timeZoneName) >= limit) {
                break
            }
        }
    }
    console.log(timeZoneCandidates)
    dropdown.innerHTML = timeZoneSuggestionTemplate({ timeZones: timeZoneCandidates })

    for (let option of dropdown.querySelectorAll("span")) {
        option.addEventListener("click", timeZoneSelectHandler)
    }
}

function setClockEntryButtonStates() {
    let table = document.getElementById("clock-table")
    let rows = Array.from(table.rows)
    rows.forEach(element => {
        element.querySelector(".clock-entry-up-btn").disabled = (element.sectionRowIndex === 0)
        element.querySelector(".clock-entry-down-btn").disabled = (element.sectionRowIndex === rows.length - 1)
    })
}

setClockEntryButtonStates()

function clockEntryDeleteBtnHandler(event) {
    let table = document.getElementById("clock-table")
    let row = event.target.closest("tr")

    table.deleteRow(row.sectionRowIndex)

    updateConfig()
    setClockEntryButtonStates()
    
}

function clockEntryUpBtnHandler(event) {
    let table = document.getElementById("clock-table")
    let row = event.target.closest("tr")
    let prev_row = table.rows[row.sectionRowIndex - 1]

    table.insertBefore(row, prev_row)

    updateConfig()
    setClockEntryButtonStates()
    
}

function clockEntryDownBtnHandler(event) {
    let table = document.getElementById("clock-table")
    let row = event.target.closest("tr")
    if (row.sectionRowIndex === table.rows.length - 2) {
        // moving to last
        table.appendChild(row)
    } else {
        table.insertBefore(row, table.rows[row.sectionRowIndex + 2])
    }
    updateConfig()
    setClockEntryButtonStates()
}

function setupClockEntryCallbacks(parent) {
    parent.querySelectorAll(".searchable-input").forEach(element => {
        element.addEventListener('focus', turnOnSearchDropdown)
        element.addEventListener('blur', turnOffSearchDropdown)
        element.addEventListener('change', updateConfig)
    });

    parent.querySelectorAll(".city-input").forEach(element => {
        element.addEventListener("input", cityFilterHandler)
    });

    parent.querySelectorAll(".time-zone-input").forEach(element => {
        element.addEventListener("input", timeZoneFilterHandler)
    });

    parent.querySelectorAll(".clock-entry-delete-btn").forEach(element => {
        element.addEventListener("click", clockEntryDeleteBtnHandler)
    })

    parent.querySelectorAll(".clock-entry-up-btn").forEach(element => {
        element.addEventListener("click", clockEntryUpBtnHandler)
    })

    parent.querySelectorAll(".clock-entry-down-btn").forEach(element => {
        element.addEventListener("click", clockEntryDownBtnHandler)
    })
    
}

setupClockEntryCallbacks(document.documentElement)

console.log(cities)

// clocks manipulation
function addClockEntry() {
    let table = document.getElementById("clock-table")
    let new_row = table.insertRow()
    new_row.innerHTML = clockEntryTemplate({city: "", timeZone: ""})
    new_row.classList.add("clock-entry")

    setupClockEntryCallbacks(new_row)

    setClockEntryButtonStates()
}

document.getElementById("add-clock-entry-btn").addEventListener("click", addClockEntry)

// Import and Export
function downloadSettings() {
    let serializedConfig = JSON.stringify(config, null, 4)
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(serializedConfig));
    element.setAttribute('download', "world-clock-config.json");
    element.style.display = 'none';
    element.click();
}

document.getElementById("download-settings-btn").addEventListener("click", downloadSettings)

async function uploadSettings() {
    let settingsUpload = document.getElementById("settings-upload-file")
    if (settingsUpload.files) {
        let text = await settingsUpload.files[0].text()
        console.log(text)
        config = JSON.parse(text)
        setConfig(config)

        alert("Setting imported successfully! Page will now reload.")

        // reload window
        window.location.reload();
    }
}

document.getElementById("settings-import-btn").addEventListener("click", uploadSettings)

// Reset
function resetSettings() {
    deleteConfig()
    // reload window
    window.location.reload();
}

document.getElementById("settings-reset-btn").addEventListener("click", resetSettings)


// setup animations
window.requestAnimationFrame(getClockTickerCallback())