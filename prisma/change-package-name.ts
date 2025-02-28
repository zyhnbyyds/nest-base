/* eslint-disable ts/no-require-imports */
const fs = require('node:fs')
const path = require('node:path')

async function getPackageVersion(packageName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://registry.npmmirror.com/${packageName}/latest`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: { version: string } = await response.json()
    return data.version
  }
  catch (error) {
    console.error(`Failed to fetch package version for ${packageName}:`, error)
    return null
  }
}

async function changeClientName(name: string) {
  const packageJsonPath = path.join(__dirname, `../packages/${name}/package.json`)

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const oldName = packageJson.name

  const version = await getPackageVersion(`@zgyh/prisma-${name}`)

  packageJson.version = version || '1.0.0'

  packageJson.name = `@zgyh/prisma-${name}`

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')

  console.log(`✨ Changed ${oldName} to @zgyh/prisma-${name} in ${packageJsonPath} -v ${packageJson.version}`)
}

['mysql', 'mongo'].forEach(changeClientName)
