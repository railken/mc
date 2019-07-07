import { Downloader } from './Downloader'

export class InstallerMinecraft {
  constructor (mapper) {
    this.url = 'https://launcher.mojang.com/download/Minecraft.exe'
    this.mapper = mapper
  }
  async handle () {
    return new Downloader().ensureDownloaded(this.url, this.mapper.toMinecraftExe(), '8d2d13d9110ba2eed99da6f32c8967a79799f54c')
  }
}
