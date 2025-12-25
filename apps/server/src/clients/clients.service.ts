import { Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from 'generated/prisma/client';

@Injectable()
export class ClientsService {

  constructor(private prismaService: PrismaService) {}

  async create(createClientDto:CreateClientDto) {
    const client = await this.prismaService.client.create({ data: createClientDto });
    return client;
  }

  async findAll():Promise<Client[]> {
    const clients = await this.prismaService.client.findMany({
      include: {
        subscriptions:{
          include: {
            account: {
              include: {
                service: true
              }
            }

          }
        }
      }
    })
    return clients;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
