import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'jsonb', nullable: true })
    providers: {
        google?: {
            id: string,
            email: string
        }
    }

    @Column()
    password: string;
}