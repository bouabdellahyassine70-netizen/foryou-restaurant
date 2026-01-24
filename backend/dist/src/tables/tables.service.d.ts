import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateTableDto): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }>;
    findAll(): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }[]>;
    findOne(id: string): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }>;
    findByQrCode(qrCode: string): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }>;
    update(id: string, data: UpdateTableDto): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }>;
    delete(id: string): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }>;
}
