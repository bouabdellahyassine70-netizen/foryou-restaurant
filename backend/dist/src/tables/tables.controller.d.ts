import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    findByQrCode(qrCode: string): Promise<{
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
    create(createDto: CreateTableDto): Promise<{
        number: number;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        qrCode: string;
        capacity: number;
    }>;
    update(id: string, updateDto: UpdateTableDto): Promise<{
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
