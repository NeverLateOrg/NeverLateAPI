import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/modules/authentification/decorator';
import { JwtGuard } from 'src/modules/authentification/guard';
import { User } from 'src/modules/users/schemas/user.schema';
import { ObjectIdPipe } from 'src/utils/pipes';
import { CreateCustomLocationRequestDTO } from './dtos/CreateCustomLocations.request.dto';
import { CustomLocationResponseDTO } from './dtos/CustomLocation.response.dto';
import { UpdateCustomLocationRequestDTO } from './dtos/UpdateCustomLocations.request.dto';
import { UserCustomLocationsService } from './user.locations.custom.service';

@ApiTags('Custom Locations')
@ApiBearerAuth()
@Controller('locations/custom')
export class UserCustomLocationsController {
  constructor(private readonly userCustomLocationsService: UserCustomLocationsService) {}

  @ApiOkResponse({
    description: 'Current user custom locations',
    type: [CustomLocationResponseDTO],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get()
  async getCustomLocations(@GetUser() user: User): Promise<CustomLocationResponseDTO[]> {
    const locations = await this.userCustomLocationsService.getCustomLocations(user);
    return locations.map((location) => CustomLocationResponseDTO.build(location));
  }

  @ApiCreatedResponse({
    description: 'Custom location created',
    type: CustomLocationResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please check the request body.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Post()
  async addCustomLocation(
    @GetUser() user: User,
    @Body() createClrDTO: CreateCustomLocationRequestDTO,
  ): Promise<CustomLocationResponseDTO> {
    const location = await this.userCustomLocationsService.addCustomLocation(
      user,
      createClrDTO.name,
      createClrDTO.location,
    );
    return CustomLocationResponseDTO.build(location);
  }

  @ApiOkResponse({
    description: 'Custom location updated',
    type: CustomLocationResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Custom location not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Get(':customLocationId')
  public async getCustomLocation(
    @GetUser() user: User,
    @Param('customLocationId', ObjectIdPipe) customLocationId: string,
  ): Promise<CustomLocationResponseDTO> {
    const customLocation = await this.userCustomLocationsService.getCustomLocation(user, customLocationId);
    return CustomLocationResponseDTO.build(customLocation);
  }

  @ApiOkResponse({
    description: 'Custom location updated',
    type: CustomLocationResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Custom location not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Put(':customLocationId')
  public async updateCustomLocation(
    @GetUser() user: User,
    @Param('customLocationId', ObjectIdPipe) customLocationId: string,
    @Body() updateClrDTO: UpdateCustomLocationRequestDTO,
  ): Promise<CustomLocationResponseDTO> {
    const customLocation = await this.userCustomLocationsService.updateCustomLocation(
      user,
      customLocationId,
      updateClrDTO.name,
    );
    return CustomLocationResponseDTO.build(customLocation);
  }

  @ApiNoContentResponse({
    description: 'Custom location deleted',
  })
  @ApiNotFoundResponse({
    description: 'Custom location not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Delete(':customLocationId')
  @HttpCode(204)
  public async deleteCustomLocation(
    @GetUser() user: User,
    @Param('customLocationId', ObjectIdPipe) customLocationId: string,
  ): Promise<void> {
    const success = await this.userCustomLocationsService.deleteCustomLocation(user, customLocationId);
    if (!success) {
      throw new NotFoundException('Custom location not found');
    }
  }
}
