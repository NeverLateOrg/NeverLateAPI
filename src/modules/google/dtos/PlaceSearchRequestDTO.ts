import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PlaceSearchRequestDTO {
  @ApiProperty()
  @IsString()
  input: string;

  @ApiPropertyOptional({
    example: '48.8583701,2.2922926',
  })
  @IsOptional()
  @IsString()
  location?: string;
}
