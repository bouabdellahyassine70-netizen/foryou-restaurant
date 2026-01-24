import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Public()
  @Get('qr/:qrCode')
  @ApiOperation({ summary: 'Get table by QR code (Public)' })
  findByQrCode(@Param('qrCode') qrCode: string) {
    return this.tablesService.findByQrCode(qrCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tables (Admin/Manager)' })
  findAll() {
    return this.tablesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create table (Admin/Manager)' })
  create(@Body() createDto: CreateTableDto) {
    return this.tablesService.create(createDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update table (Admin/Manager)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateTableDto) {
    return this.tablesService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete table (Admin/Manager)' })
  delete(@Param('id') id: string) {
    return this.tablesService.delete(id);
  }
}

