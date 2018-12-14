import { Downloader } from './Downloader'

export class InstallerMinecraft {
  constructor (mapper) {
    this.url = 'https://launcher.mojang.com/download/Minecraft.exe'
    this.mapper = mapper
  }
  async handle () {
    return new Downloader().ensureDownloaded(this.url, this.mapper.toMinecraftExe(), 'c9b11bc96b23ea3e08c45e9e04fa9d3d6ae47fe7')
  }
}
