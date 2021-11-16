import fs from 'fs'

const path = '/tmp/open-sharing/run.log'

let num = 0

const logs = {
    init(){
        let rootPath = path.substring(0,path.lastIndexOf('/'));
        if (!fs.existsSync(rootPath)) {
            fs.mkdir(rootPath, { recursive: true }, (err) => {
                if (err) throw err;
                logs.add('Init Log Service')
                logs.add('App Runing')
            });
        }else logs.add('App Runing')
    },
    add(message) {
        num++
        fs.appendFile(path, '[' + new Date().toLocaleString() + '] ' + message+'\n', 'utf8', (err) => {
            if (err) throw err;
            if (num > 100) logs.check()
        });
    },
    get(line){
        let data = fs.readFileSync(path, 'utf8');
        let list = data.split("\n");
        if(list.length-1<line) return list
        return list.substring(list.length - line)
    },
    check() {
        fs.stat(path, (err, res) => {
            if (err) throw err;
            let size = res.size / 1024
            if (size >= 512) {
                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) throw err;
                    fs.writeFile(path, data.substring(data.length / 2), 'utf8', (err) => {
                        if (err) throw err;
                        num = 0
                    });
                })
            }
        });
    }
}

export default logs