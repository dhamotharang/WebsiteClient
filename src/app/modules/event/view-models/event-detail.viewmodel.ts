import { Event } from '../models/event.model';
import { EventDayViewModel } from './event-day.viewmodel';

export interface EventDetailViewModel {
    event: Event;
    eventDays: EventDayViewModel[];
}
