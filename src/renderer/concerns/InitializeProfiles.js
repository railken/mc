const fs = require('fs-extra')

export class InitializeProfiles {
  constructor (mapper) {
    this.mapper = mapper
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

    obj.profiles = {}

    obj.profiles[modpack.slug] = {
      name: modpack.slug,
      gameDir: this.mapper.toModpack(modpack),
      lastVersionId: modpack.minecraft.profile.id,
      javaArgs: '-Xmx' + (parseInt(ram) * 1024) + 'm -Xms256m -XX:PermSize=256m -Dminecraft.applet.TargetDirectory="' + this.mapper.toModpack(modpack) + '" -Dfml.ignorePatchDiscrepancies=true -Dfml.ignoreInvalidMinecraftCertificates=true -Djava.net.preferIPv4Stack=true',
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
}
