const fs = require('fs')
const process = (resourcePathFile, descPathFile) => {
    const content = fs.readFileSync(resourcePathFile,'utf-8')
    const arrayContent = content.split('\n')
    const rs = ["<resources>"]
    for (let el of arrayContent) {
        const items = el.split("=")
        if (!items[0] || !items[1]) continue
        const name = items[0].replace(/\"/g, '')
        const value = items[1].replace(/\"|\;/g, '')
        const xml = `\t<string name="${name}">${value}</string>`
        rs.push(xml)
    }
    
    rs.push("</resources>")
    fs.writeFileSync(descPathFile, rs.join('\n'))
}

const run = async () => {
    const now = new Date()
    const _mlem = num => {
        num = +num
        if (isNaN(num)) return num

        if (num < 10) return '0' + num
        return num
    }
    const timestamp = `${_mlem(now.getDate())}-${_mlem(now.getMonth() + 1)}-${now.getFullYear()} ${_mlem(now.getHours())}:${_mlem(now.getMinutes())}:${_mlem(now.getSeconds())}`
    
    const resources_path = './strings'
    const xml_path = `${resources_path}/xml`
    
    if (!fs.existsSync(resources_path)) {
        fs.mkdirSync(resources_path)
        fs.mkdirSync(xml_path)
    }
    
    if (!fs.existsSync(xml_path)) {
        fs.mkdirSync(xml_path)
    }

    const desc_path = `${xml_path}/${timestamp}`
    fs.mkdirSync(desc_path)
    
    const dirs = fs.readdirSync(resources_path)
    for (let dir of dirs) {
        if (!/.*\.strings$/.test(dir)) continue
        const strins_file_path = `${resources_path}/${dir}`
        const new_file_name = dir.replace(/\.strings$/, '.xml')
        const new_path = `${desc_path}/${new_file_name}`
        await process(strins_file_path, new_path)
    }
}

run()
