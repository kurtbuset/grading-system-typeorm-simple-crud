import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

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
    grade!: number

    @Column()
    course!: string

    @CreateDateColumn()
    createdAt!: Date;  

    @UpdateDateColumn()
    updatedAt!: Date;
}   
