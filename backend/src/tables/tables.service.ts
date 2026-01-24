import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTableDto) {
    const qrCode = `FY-TABLE-${data.number}-${uuidv4()}`;
    return this.prisma.table.create({
      data: { ...data, qrCode },
    });
  }

  async findAll() {
    return this.prisma.table.findMany({
      where: { isActive: true },
      orderBy: { number: 'asc' },
    });
  }

  async findOne(id: string) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async findByQrCode(qrCode: string) {
    const table = await this.prisma.table.findUnique({ where: { qrCode } });
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async update(id: string, data: UpdateTableDto) {
    return this.prisma.table.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.table.update({ where: { id }, data: { isActive: false } });
  }
}

