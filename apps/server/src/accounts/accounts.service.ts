import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateAccountDto) {
    return await this.prisma.account.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.account.findMany({
      include: {
        subscriptions: {
          include: {
            client: true
          }
        },
        screens: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
