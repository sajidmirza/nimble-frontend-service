import { PeriodRange } from "./period-range";
import { PAYMENT_MEANS, INCOTERMS } from "../../catalogue/model/constants";
import { UBLModelUtils } from "../../catalogue/model/ubl-model-utils";
import {UnitService} from "../../common/unit-service";
import {ServiceBridge} from "../../common/ServiceBridge";
import {deliveryPeriodUnitListId, warrantyPeriodUnitListId} from "../../common/constants";
import {Party} from '../../catalogue/model/publish/party';
import { CompanySensor } from "./company-sensor";

export class CompanyNegotiationSettings {
    constructor(
        public paymentMeans: string[] = [].concat(PAYMENT_MEANS),
        public paymentTerms: string[] = UBLModelUtils.getDefaultPaymentTermsAsStrings(),
        public incoterms: string[] = [].concat(INCOTERMS),
        public deliveryPeriodRanges: PeriodRange[] = [{ start: 0, end: 2500 }, { start: 0, end: 75 }, { start: 0, end: 100 }, { start: 0, end: 15 },{ start: 1, end: 12 }],
        public deliveryPeriodUnits: string[] = [],
        public warrantyPeriodRanges: PeriodRange[] = [{ start: 0, end: 48 }, { start: 0, end: 4 }],
        public warrantyPeriodUnits: string[] = [],
        public company: Party = null,
        public serviceLevel: string = 'None',
        public sensors: CompanySensor[] = [],
    ) {
        let unitService: UnitService = ServiceBridge.unitService;
        unitService.getCachedUnitList(deliveryPeriodUnitListId).then(list => this.deliveryPeriodUnits = list);
        unitService.getCachedUnitList(warrantyPeriodUnitListId).then(list => this.warrantyPeriodUnits = list);
    }
}
