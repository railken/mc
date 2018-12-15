import { Downloader } from './Downloader'

const fs = require('fs-extra')
var AdmZip = require('adm-zip')

export class InitializerModpack {
  constructor (mapper) {
    this.mapper = mapper
  }
  async handle (modpack) {
    var path = this.mapper.toModpack(modpack)

    if (fs.existsSync(path)) {
      return
    }

    var zipPath = this.mapper.toModpack(modpack, 'modpack.zip')
    await new Downloader().ensureDownloaded(modpack.minecraft.files, zipPath)

    var zip = new AdmZip(zipPath)
    zip.extractAllTo(this.mapper.toModpack(modpack))
    fs.removeSync(zipPath)
  }
}
