import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  IsUUID,
  Table,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Notification } from './Notification';
import { Placement } from './Placement';

@Table({ tableName: 'users' })
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  provider_id: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  discriminator: string;

  @Column(DataType.STRING)
  avatar: string;

  @Column(DataType.BOOLEAN)
  admin: boolean;

  @Column(DataType.BOOLEAN)
  premium: boolean;

  getAvatar = () => {
    return `https://cdn.discordapp.com/avatars/${this.provider_id}/${this.avatar}.png`;
  };

  @HasMany(() => Placement, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  placements: Placement[];

  @HasMany(() => Notification, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  notifications: Notification[];
}
