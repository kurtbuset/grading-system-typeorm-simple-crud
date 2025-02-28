import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Role } from "../_helpers/role"

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    title!: string

    @Column()
    email!: string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User
    })
    role!: Role

    @Column()
    hashedPassword!: string
}   
