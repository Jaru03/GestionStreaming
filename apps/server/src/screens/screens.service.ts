import { Injectable } from '@nestjs/common';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScreensService {

  constructor(private prisma:PrismaService) {}

  async create(data: CreateScreenDto) {
    return await this.prisma.screen.create({
      data
    });
  }

  findAll() {
    return this.prisma.screen.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} screen`;
  }

  update(id: number, updateScreenDto: UpdateScreenDto) {
    return `This action updates a #${id} screen`;
  }

  remove(id: number) {
    return `This action removes a #${id} screen`;
  }
}
