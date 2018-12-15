import { Downloader } from './Downloader'

export class InstallerManifest {
  constructor (mapper) {
    this.mapper = mapper
  }
  async handle (modpack) {
    var result = await new Downloader().requestSync(modpack.url)
    try {
      var hash = require('crypto').createHash('md5').update(btoa(JSON.stringify(result.data))).digest('hex')

      Object.assign(modpack, result.data, {
        hash: hash,
        updated_at: new Date().toISOString()
      })

      console.log(modpack)

      console.log('Updated: ' + modpack.hash)
    } catch (e) {
      throw new Error('An error has occurred while downloading and parsing the file .json')
    }

    return modpack
  }
}
