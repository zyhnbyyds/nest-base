/**
 * self set factory name [自定义工厂名称]
 */
export enum FactoryName {
  RedisFactory = 'redis_factory',
  /** nodemailer 邮件发送工厂 */
  TransportFactory = 'transport_factory',
  /** nats 工厂 */
  NatsFactory = 'nats_factory',
  /** deepseek 工厂 */
  DeepSeekFactory = 'deepseek_factory',
}
