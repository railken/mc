const path = require('path')

export class Mapper {
  constructor (basePath) {
    this.basePath = basePath
  }
  toBase (file) {
    return this.basePath + path.sep + (file || '')
  }
  toGame (file) {
    return this.toBase('game' + path.sep + (file || ''))
  }
  toModpack (modpack, file) {
    return this.toBase('modpacks' + path.sep + modpack.slug + path.sep + (file || ''))
  }
  toMinecraftExe () {
    return this.toGame('minecraft.exe')
  }
}
