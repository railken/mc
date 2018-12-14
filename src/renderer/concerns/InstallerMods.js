import { Downloader } from './Downloader'

const path = require('path')
const fs = require('fs-extra')

export class InstallerMods {
  constructor (mapper) {
    this.mapper = mapper
  }
  getPathMods (version) {
    return this.mapper.toGame('cache' + path.sep + version + path.sep + 'mods')
  }
  getPathModpackMods (modpack) {
    return this.mapper.toModpack(modpack, 'mods')
  }
  async handle (modpack) {
    var mods = await new Downloader().manageFiles(
      modpack.minecraft.version,
      modpack.minecraft.mods,
      this.getPathMods(modpack.minecraft.version),
      (object) => {
        return object.path
      },
      (object) => {
        return object.url
      }
    )

    return this.installMods(modpack, mods)
  }
  cleanDirectory (directory) {
    if (!directory || directory === path.sep || directory === '/') {
      console.log('Prevented from removing: ' + directory)
      return
    }

    if (!fs.existsSync(directory)) {
      console.log('No file found in: ' + directory)
      return
    }

    var files = fs.readdirSync(directory)

    for (const file of files) {
      var fullpath = path.join(directory, file)

      if (fs.lstatSync(fullpath).isDirectory()) {
        this.cleanDirectory(fullpath)
        fs.rmdirSync(fullpath)
      } else {
        fs.unlinkSync(fullpath)
      }
    }
  }
  installMods (modpack, mods) {
    fs.ensureDirSync(this.mapper.toModpack(modpack, 'mods'))
    this.cleanDirectory(this.mapper.toModpack(modpack, 'mods'))

    mods.map((mod) => {
      fs.copySync(mod, this.mapper.toModpack(modpack, 'mods' + path.sep + path.basename(mod)))
    })
  }
}
