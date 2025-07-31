import defaultConfig from './default_config.json'


export function getConfig() {
    // Get config
    let config = null
    // check local storage
    let local_storage_config = window.localStorage.getItem("config")
    if (local_storage_config != null) {
        console.log("Reading from local storage")
        try {
            config = JSON.parse(local_storage_config)
        } catch (SyntaxError) {
            console.log("Config read from local storage is mal-formed!")
            console.log(local_storage_config)

            window.localStorage.removeItem("config")
        }
    } else {
        console.log("Loading default config")
        config = defaultConfig
    }

    setConfig(config)
    
    return config
}

export function setConfig(config) {
    window.localStorage.setItem("config", JSON.stringify(config))
}

export function deleteConfig() {
    window.localStorage.clear()
}