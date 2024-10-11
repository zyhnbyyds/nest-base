/**
 * get env value 获取环境变量值
 * @param targetName 别名
 * @returns
 */
export function getEnv(targetName: string): any {
  return (targetName.includes('PORT') || targetName.includes('NUM'))
    ? Number.parseInt(process.env[targetName])
    : process.env[targetName]
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === 'dev'
}
