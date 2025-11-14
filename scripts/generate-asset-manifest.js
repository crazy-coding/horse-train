#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')

async function buildManifest(){
  const assetsDir = path.join(__dirname, '..', 'public', 'assets')
  const outFile = path.join(assetsDir, 'asset-manifest.json')
  const manifest = {}
  try{
    const entries = await fs.readdir(assetsDir, { withFileTypes: true })
    for(const ent of entries){
      if(ent.name === 'asset-manifest.json' || ent.name === '.gitkeep') continue
      const full = path.join(assetsDir, ent.name)
      if(ent.isDirectory()){
        manifest[ent.name] = {}
        const files = await fs.readdir(full)
        for(const f of files){
          if(f.startsWith('.')) continue
          const key = path.parse(f).name
          manifest[ent.name][key] = `/assets/${ent.name}/${f}`
        }
      } else if(ent.isFile()){
        // top-level file
        manifest[ent.name] = `/assets/${ent.name}`
      }
    }

  await fs.writeFile(outFile, JSON.stringify(manifest, null, 2), 'utf8')
  // manifest written
  }catch(err){
    console.error('Error building asset manifest', err)
    process.exit(1)
  }
}

buildManifest()
