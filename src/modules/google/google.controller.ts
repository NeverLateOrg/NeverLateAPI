import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/authentification/guard';
import { PlaceSearchRequestDTO } from './dtos/PlaceSearchRequestDTO';
import { PlaceSearchResponseDTO } from './dtos/PlaceSearchResponseDTO';
import { GoogleService } from './google.service';

@ApiTags('Google Place')
@ApiBearerAuth()
@Controller('google/place')
export class GooglePlaceController {
  constructor(private readonly googleService: GoogleService) {}

  @ApiOkResponse({
    description: 'Search places',
    type: [PlaceSearchResponseDTO],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get()
  async searchPlaces(@Query() placeSearchRequest: PlaceSearchRequestDTO): Promise<PlaceSearchResponseDTO> {
    const res = await this.googleService.getMatchingPlaces({
      input: placeSearchRequest.input,
      location: placeSearchRequest.location,
    });
    return PlaceSearchResponseDTO.build(res.places, res.nextPageToken);
  }

  @ApiOkResponse({
    description: 'Get next page of places',
    type: [PlaceSearchResponseDTO],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get('next')
  async getNextPage(@Query('nextPageToken') nextPageToken: string): Promise<PlaceSearchResponseDTO> {
    const res = await this.googleService.getMatchingPlacesNextPage(nextPageToken);
    return PlaceSearchResponseDTO.build(res.places, res.nextPageToken);
  }
}
