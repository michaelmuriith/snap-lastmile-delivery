import { Controller, Get, Post, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetNotificationsQuery, GetNotificationQuery } from './queries/get-notifications.query';
import { MarkNotificationAsReadCommand, MarkAllNotificationsAsReadCommand } from './commands/mark-notification-as-read.command';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('isRead') isRead?: string,
  ): Promise<{ notifications: Notification[]; total: number }> {
    const query = new GetNotificationsQuery(
      'current-user-id', // This should come from JWT token
      parseInt(page, 10),
      parseInt(limit, 10),
      isRead ? isRead === 'true' : undefined,
    );

    return this.queryBus.execute(query);
  }

  @Get(':id')
  async getNotification(@Param('id') id: string): Promise<Notification | null> {
    const query = new GetNotificationQuery(id);
    return this.queryBus.execute(query);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string): Promise<void> {
    const command = new MarkNotificationAsReadCommand(id);
    await this.commandBus.execute(command);
  }

  @Patch('read-all')
  async markAllAsRead(): Promise<number> {
    const command = new MarkAllNotificationsAsReadCommand('current-user-id'); // This should come from JWT token
    return this.commandBus.execute(command);
  }
}