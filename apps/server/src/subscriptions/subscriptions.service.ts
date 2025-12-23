import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  
  constructor(private prisma: PrismaService) {}
  
  async create(data: CreateSubscriptionDto) {
    await this.prisma.subscription.create({
      data: {
        ...data, endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
    });
  }

  async findAll() {
    return await this.prisma.subscription.findMany(
      {
        include: {
        client: true,
        account: true,
      },
      }
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  async remove(subscriptionId: number) {
    return await this.prisma.subscription.delete({
      where: { subscriptionId },
    });
  }
}
