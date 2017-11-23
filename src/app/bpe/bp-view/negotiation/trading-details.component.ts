import {Component, Input} from "@angular/core";
import { CatalogueLine } from "../../../catalogue/model/publish/catalogue-line";
import {LineItem} from "../../../catalogue/model/publish/line-item";
import {DeliveryTerms} from "../../../catalogue/model/publish/delivery-terms";

@Component({
    selector: 'trading-details',
    templateUrl: './trading-details.component.html',
})

export class TradingDetailsComponent {
    @Input() presentationMode:string;
    @Input() lineItem:LineItem;
}
