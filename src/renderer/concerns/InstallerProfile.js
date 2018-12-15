import { Downloader } from './Downloader'

const path = require('path')

export class InstallerProfile {
  constructor (mapper) {
    this.mapper = mapper
  }
  async handle (modpack) {
    return new Downloader().manageFiles(
      modpack.minecraft.version,
      [modpack.minecraft.profile],
      this.mapper.toGame('versions'),
      (object) => {
        return object.id + path.sep + object.id + '.json'
      },
      (object) => {
        return object.url
      }
    )
  }
}
