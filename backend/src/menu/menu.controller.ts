import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { CreateModifierDto, UpdateModifierDto } from './dto/modifier.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Public endpoints
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories with items (Public)' })
  findAllCategories() {
    return this.menuService.findAllCategories();
  }

  @Public()
  @Get('items')
  @ApiOperation({ summary: 'Get all menu items (Public)' })
  findAllMenuItems() {
    return this.menuService.findAllMenuItems();
  }

  @Public()
  @Get('items/:id')
  @ApiOperation({ summary: 'Get menu item by ID (Public)' })
  findMenuItem(@Param('id') id: string) {
    return this.menuService.findMenuItem(id);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post('categories')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category (Admin/Manager)' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.menuService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch('categories/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin/Manager)' })
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.menuService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete('categories/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (Admin/Manager)' })
  deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post('items')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu item (Admin/Manager)' })
  createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch('items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu item (Admin/Manager)' })
  updateMenuItem(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuService.updateMenuItem(id, updateMenuItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete('items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu item (Admin/Manager)' })
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.deleteMenuItem(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post('modifiers')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create modifier (Admin/Manager)' })
  createModifier(@Body() createModifierDto: CreateModifierDto) {
    return this.menuService.createModifier(createModifierDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch('modifiers/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update modifier (Admin/Manager)' })
  updateModifier(@Param('id') id: string, @Body() updateModifierDto: UpdateModifierDto) {
    return this.menuService.updateModifier(id, updateModifierDto);
  }
}

