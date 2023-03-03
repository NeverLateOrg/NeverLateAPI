import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
    imports: [],
    providers: [EventsService],
    controllers: [EventsController],
})
export class EventsModule {
    
}