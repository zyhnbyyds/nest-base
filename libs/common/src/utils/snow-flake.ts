/**
 * Snowflake ID Generator from GPT
 */
export class Snowflake {
  private workerIdBits: number = 1
  private datacenterIdBits: number = 1
  private maxWorkerId: number = -1 ^ (-1 << this.workerIdBits)
  private maxDatacenterId: number = -1 ^ (-1 << this.datacenterIdBits)
  private sequenceBits: number = 12

  private workerIdShift: number = this.sequenceBits
  private datacenterIdShift: number = this.sequenceBits + this.workerIdBits
  private timestampLeftShift: number
    = this.sequenceBits + this.workerIdBits + this.datacenterIdBits

  private sequenceMask: number = -1 ^ (-1 << this.sequenceBits)

  private workerId: number
  private datacenterId: number
  private sequence: number = 0
  private lastTimestamp: number = -1

  constructor(workerId: number, datacenterId: number) {
    if (workerId > this.maxWorkerId || workerId < 0)
      throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`)

    if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
      throw new Error(
        `Datacenter ID must be between 0 and ${this.maxDatacenterId}`,
      )
    }

    this.workerId = workerId
    this.datacenterId = datacenterId
  }

  public generateId(): string {
    let timestamp: number = this.currentTimestamp()

    if (timestamp < this.lastTimestamp)
      throw new Error(`Invalid system clock. Clock moved backwards.`)

    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask
      if (this.sequence === 0)
        timestamp = this.waitNextMillis(this.lastTimestamp)
    }
    else {
      this.sequence = 0
    }

    this.lastTimestamp = timestamp

    const id: bigint
      = (BigInt(timestamp) << BigInt(this.timestampLeftShift))
        | (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift))
        | (BigInt(this.workerId) << BigInt(this.workerIdShift))
        | BigInt(this.sequence)

    return id.toString()
  }

  private currentTimestamp(): number {
    return Date.now()
  }

  private waitNextMillis(lastTimestamp: number): number {
    let timestamp: number = this.currentTimestamp()
    while (timestamp <= lastTimestamp) timestamp = this.currentTimestamp()

    return timestamp
  }
}
