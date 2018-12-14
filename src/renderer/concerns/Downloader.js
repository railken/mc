const fs = require('fs-extra')
const crypto = require('crypto')
const download = require('download')
const path = require('path')

export class Downloader {
  download (url) {
    console.log('Downloading: ' + url)

    return download(url).catch((e) => {
      console.log(e)
    })
  }
  downloadTo (url, filepath) {
    return this.download(url).then(data => {
      console.log('Saved to: ' + filepath)
      fs.outputFileSync(filepath, data)
    })
  }
  checksum (str, algorithm, encoding) {
    return crypto
      .createHash(algorithm || 'sha1')
      .update(str, 'binary')
      .digest(encoding || 'hex')
  }
  ensureDownloaded (url, filepath, hash) {
    if (fs.existsSync(filepath) && (!hash || (hash === this.checksum(fs.readFileSync(filepath))))) {
      return
    }

    return this.downloadTo(url, filepath)
  }
  async manageFiles (version, objects, basePath, retrievePath, retrieveUrl) {
    var arr = []
    var downloaded = []

    Object.values(objects).map((object) => {
      var filepath = basePath + path.sep + retrievePath(object)

      downloaded.push(filepath)

      if (fs.existsSync(filepath)) {
        return
      }

      arr.push(() => {
        return this.download(retrieveUrl(object)).then(data => {
          fs.outputFileSync(filepath, data)
        })
      })
    })

    for (let i = 0; i < arr.length; i++) {
      await arr[i]()
    }

    return downloaded
  }
}
