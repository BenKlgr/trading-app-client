import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  IsUUID,
  Table,
  Default,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Placement } from './Placement';
import { User } from './User';

@Table({ tableName: 'notifications' })
export class Notification extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  message: string;

  @Column(DataType.STRING)
  type: string;

  @Column(DataType.BOOLEAN)
  read: boolean;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;
}
