const fs = require('fs-extra')

export class Launcher {
  constructor (mapper) {
    this.mapper = mapper
  }
  getPath () {
    return this.mapper.toGame('versions')
  }
  async handle (modpack, ram) {
    var filepath = this.mapper.toGame('launcher_profiles.json')

    fs.ensureFileSync(filepath)

    var content = fs.readFileSync(filepath)

    try {
      var obj = JSON.parse(content)
    } catch (e) {
      obj = {}
    }

    if (!obj.profiles) {
      obj.profiles = {}
    }

    console.log(modpack.minecraft)

    obj.profiles[modpack.slug] = {
      name: modpack.slug,
      gameDir: this.mapper.toModpack(modpack),
      lastVersionId: modpack.minecraft.require.forge.id,
      javaArgs: '-Xmx' + (parseInt(ram) * 1024) + 'm -Xms256m -XX:PermSize=256m -Dminecraft.applet.TargetDirectory="' + this.mapper.toModpack(modpack) + '" -Dfml.ignorePatchDiscrepancies=true -Dfml.ignoreInvalidMinecraftCertificates=true -Duser.language=en -Duser.country=US',
      resolution: {
        width: '1024',
        height: '768'
      },
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }

    obj.selectedProfile = modpack.slug

    fs.writeFileSync(filepath, JSON.stringify(obj, null, 2))
  }
  async launch (modpack) {
    var exec = require('child_process').exec
    var command = this.mapper.toMinecraftExe() + ' --workDir ' + this.mapper.toGame('')

    console.log('Launching...' + command)

    exec(command)
  }
}
