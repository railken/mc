import { Downloader } from './Downloader'

const path = require('path')
const fs = require('fs-extra')

export class InstallerMods {
  constructor (mapper) {
    this.mapper = mapper
  }
  async handle (modpack) {
    var mods = await new Downloader().manageFiles(
      modpack.minecraft.version,
      modpack.minecraft.mods,
      this.mapper.toGame('cache' + path.sep + modpack.minecraft.version + path.sep + 'mods'),
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

    fs.removeSync(directory)
  }
  installMods (modpack, mods) {
    fs.ensureDirSync(this.mapper.toModpack(modpack, 'mods'))
    this.cleanDirectory(this.mapper.toModpack(modpack, 'mods'))

    mods.map((mod) => {
      fs.copySync(mod, this.mapper.toModpack(modpack, 'mods' + path.sep + path.basename(mod)))
    })
  }
}
