import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  IsUUID,
  Table,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'placements' })
export class Placement extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @Column(DataType.STRING)
  type: string;

  @Column(DataType.STRING)
  stock: number;

  @Column(DataType.INTEGER)
  quantity: number;

  @Column(DataType.STRING)
  item: string;

  @Column(DataType.BOOLEAN)
  itemCompressed: boolean;

  @Column(DataType.INTEGER)
  price: number;

  @Column(DataType.STRING)
  unit: string;

  @Column(DataType.BOOLEAN)
  unitCompressed: boolean;

  @Column(DataType.STRING)
  location: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.BOOLEAN)
  promoted: boolean;
}
