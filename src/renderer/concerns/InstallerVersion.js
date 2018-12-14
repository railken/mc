import { Downloader } from './Downloader'

const path = require('path')

export class InstallerVersion {
  constructor (mapper) {
    this.mapper = mapper
  }
  getPathVersions () {
    return this.mapper.toGame('versions')
  }
  async handle (modpack) {
    return new Downloader().manageFiles(
      modpack.minecraft.version,
      [modpack.minecraft.forge[0]],
      this.getPathVersions(),
      (object) => {
        return object.id + path.sep + object.id + '.json'
      },
      (object) => {
        return object.url
      }
    )
  }
}
