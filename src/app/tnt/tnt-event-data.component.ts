import { Component, Input } from '@angular/core';
import { TrackInfo } from './model/TrackInfo';

@Component({
    selector: 'tnt-event-data',
    templateUrl: './tnt-event-data.component.html',
    styleUrls: ['./tnt-event-data.component.css']
})

export class TnTEventDataComponent {
    @Input('incomingTrackingInfo') incomingTrackingInfo: TrackInfo[];
    collectionSize = 0;
    page = 1;
    pageSize = 5;
    verified: boolean;

    get events(): TrackInfo[] {
        const everyEvent = this.incomingTrackingInfo;
        this.collectionSize = everyEvent.length;
        return everyEvent.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
}
