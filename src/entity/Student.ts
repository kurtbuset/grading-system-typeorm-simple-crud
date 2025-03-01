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
    sex!: string

    @Column()
    grade!: string

    @Column({
        type: 'enum',
        enum: ['STEM', 'HUMMS'],
        default: 'STEM'
    })
    course!: string

    @Column()
    hashedPassword!: string
}   
