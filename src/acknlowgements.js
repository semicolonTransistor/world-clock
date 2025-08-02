import './style.css';
import { getConfig } from './utils';


let mainTemplate = require("./acknlowgements.handlebars");

var config = getConfig()

console.log(config)

function showLicenses(licenses) {
    const element = document.createElement('div');
    element.innerHTML = mainTemplate(licenses)

    console.log(licenses)

    document.body.appendChild(element);
}

document.documentElement.dataset.theme = "dark"

fetch("./oss-licenses.json").then((res) => res.json()).then((licenses) => showLicenses(licenses))

