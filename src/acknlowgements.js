import { Exception } from 'handlebars';
import './style.css';
import { getConfig } from './utils';


let mainTemplate = require("./acknlowgements.handlebars");

var config = getConfig()

console.log(config)

function showLicenses(licenses) {
    for (let entry of licenses) {
        try {
            let url = URL(entry.repository)
            entry.repository = url.href
        } catch (TypeError) {
            let url
            if (entry.repository.startsWith("github:")) {
                url = new URL(entry.repository.substring(len("github:")), "https://github.com/")
            } else if (entry.repository.startsWith("bitbucket:")) {
                url = new URL(entry.repository.substring(len("bitbucket:")), "https://bitbucket.org/")
            } else if (entry.repository.startsWith("gitlab:")) {
                url = new URL(entry.repository.substring(len("gitlab:")), "https://gitlab.com/")
            } else {
                url = new URL(entry.repository, "https://github.com/")
            }
            entry.repository = url.href
        }
    }

    console.log(licenses)

    const element = document.createElement('div');
    element.innerHTML = mainTemplate(licenses)

    document.body.appendChild(element);
}

document.documentElement.dataset.theme = "dark"

fetch("./oss-licenses.json").then((res) => res.json()).then((licenses) => showLicenses(licenses))

