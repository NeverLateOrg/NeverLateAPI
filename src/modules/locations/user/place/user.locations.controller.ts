import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/modules/authentification/decorator';
import { JwtGuard } from 'src/modules/authentification/guard';
import { User } from 'src/modules/users/schemas/user.schema';
import { ObjectIdPipe } from 'src/utils/pipes';
import { CreatePlaceLocationRequestDTO } from './dtos/CreatePlaceLocations.request.dto';
import { PlaceLocationResponseDTO } from './dtos/PlaceLocation.response.dto';
import { UserPlaceLocationsService } from './user.locations.place.service';

@ApiTags('Place Locations')
@ApiBearerAuth()
@Controller('locations/place')
export class UserPlaceLocationsController {
  constructor(private readonly userPlaceLocationsService: UserPlaceLocationsService) {}

  @ApiOkResponse({
    description: 'Current user place locations',
    type: [PlaceLocationResponseDTO],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get()
  async getPlaceLocations(@GetUser() user: User): Promise<PlaceLocationResponseDTO[]> {
    const locations = await this.userPlaceLocationsService.getPlaceLocations(user);
    console.log(locations[0].placeLocation.name);
    return locations.map((location) => PlaceLocationResponseDTO.build(location));
  }

  @ApiCreatedResponse({
    description: 'Place location created',
    type: PlaceLocationResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please check the request body.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Post()
  async addPlaceLocation(
    @GetUser() user: User,
    @Body() createClrDTO: CreatePlaceLocationRequestDTO,
  ): Promise<PlaceLocationResponseDTO> {
    const location = await this.userPlaceLocationsService.addPlaceLocation(user, createClrDTO.placeId);
    return PlaceLocationResponseDTO.build(location);
  }

  @ApiOkResponse({
    description: 'Get Place location',
    type: PlaceLocationResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Place location not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Get(':placeLocationId')
  public async getPlaceLocation(
    @GetUser() user: User,
    @Param('placeLocationId', ObjectIdPipe) placeLocationId: string,
  ): Promise<PlaceLocationResponseDTO> {
    const location = await this.userPlaceLocationsService.getPlaceLocation(user, placeLocationId);
    return PlaceLocationResponseDTO.build(location);
  }
}
