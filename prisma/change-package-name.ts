/* eslint-disable no-console */
/* eslint-disable unicorn/prefer-node-protocol */
import * as fs from 'fs'
import * as path from 'path'

async function changeClientName(name: string) {
  const packageJsonPath = path.join(__dirname, `../packages/${name}/package.json`)

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const oldName = packageJson.name

  packageJson.name = `@zgyh/prisma-${name}`

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')

  console.log(`✨ Changed ${oldName} to @zgyh/prisma-${name} in ${packageJsonPath}`)
}

['mysql', 'mongo'].forEach(changeClientName)
