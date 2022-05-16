import os from 'os'
import fs from 'fs'

const home = os.homedir() + '/Library/Preferences';

const path = {
    log: home + '/open-sharing/run.log',
    res: home + '/open-sharing/config/resources.json',
    net: home + '/open-sharing/config/network.json',
    sec: home + '/open-sharing/config/security.json',
    other: home + '/open-sharing/config/other.json'
}

const init = {
    run() {
        let rootPath = home + '/open-sharing/config/'
        if (!fs.existsSync(rootPath)) fs.mkdirSync(rootPath, { recursive: true });
        if (!fs.existsSync(path.res)) fs.writeFileSync(path.res, '[]', 'utf8')
        if (!fs.existsSync(path.net)) fs.writeFileSync(path.net, '{}', 'utf8')
        if (!fs.existsSync(path.sec)) fs.writeFileSync(path.sec, '{}', 'utf8')
        if (!fs.existsSync(path.other)) fs.writeFileSync(path.other, '{}', 'utf8')
        return true
    },
}

export default init