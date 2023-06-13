import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('app')
export class AppController {
  @Get('healthcheck')
  @ApiOperation({ summary: 'Check the health of the application' })
  public healthcheck(): object {
    return { status: 'ok' };
  }
}
