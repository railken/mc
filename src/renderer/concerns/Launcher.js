import { InstallerMinecraft } from './InstallerMinecraft'
import { InstallerMods } from './InstallerMods'
import { InstallerProfile } from './InstallerProfile'
import { InitializeProfiles } from './InitializeProfiles'

export class Launcher {
  constructor (mapper) {
    this.mapper = mapper
  }
  async launch (options) {
    await new InstallerMinecraft(this.mapper).handle()
    await new InstallerMods(this.mapper).handle(options.modpack)
    await new InstallerProfile(this.mapper).handle(options.modpack)
    await new InitializeProfiles(this.mapper).handle(options.modpack, options.ram)
    await this.execute(options.modpack)
  }
  async execute (modpack) {
    var exec = require('child_process').exec
    var command = this.mapper.toMinecraftExe() + ' --workDir ' + this.mapper.toGame('')

    console.log('Launching...' + command)

    exec(command)
  }
}
