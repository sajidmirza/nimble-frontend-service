import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ng2-cookies';
import {BPEService} from '../bpe/bpe.service';
import {CallStatus} from '../common/call-status';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DocumentService} from '../bpe/bp-view/document-service';
import {Order} from '../catalogue/model/publish/order';
import {quantityToString, selectPartyName, selectPreferredValue} from '../common/utils';
import {Item} from "../catalogue/model/publish/item";
import {ItemProperty} from "../catalogue/model/publish/item-property";
import {CatalogueLine} from "../catalogue/model/publish/catalogue-line";
import {Quantity} from "../catalogue/model/publish/quantity";

/**
 * Created by suat on 19-Sep-19.
 */
@Component({
    selector: 'unshipped-orders-tab',
    templateUrl: './unshipped-orders-tab.component.html'
})
export class UnshippedOrdersTabComponent implements OnInit {

    allOrderIds: string[] = [];
    displayedOrderIds: string[] = [];
    orders: Map<string, Order> = new Map<string, Order>();
    associatedProducts: Map<number, CatalogueLine> = new Map<number, CatalogueLine>();
    // keeps the aggregated products referred by the orders
    // key is composed of: product.hjid + unit
    associatedProductAggregates: Map<string, Quantity> = new Map<string, Quantity>();
    allOrdersCallStatus: CallStatus = new CallStatus();
    orderIdsCallStatus: CallStatus = new CallStatus();
    orderCallStatuses: Map<string, CallStatus> = new Map<string, CallStatus>();
    showUnshippedOrders = true;
    // keeps the error messages, if any, received when getting all orders
    failedOrderMessages: string[] = [];

    pageNum = 0;
    pageSize = 10;

    // utility methods
    selectPartyName = selectPartyName;
    selectLangLabelFromTextArray = selectPreferredValue;
    quantityToString = quantityToString;

    constructor(private bpeService: BPEService,
                private documentService: DocumentService,
                private cookieService: CookieService,
                private translate: TranslateService,
                private router: Router) {
                }

    ngOnInit() {
        this.retrieveUnshippedOrders();
    }

    private retrieveUnshippedOrders(): void {
        let partyId = this.cookieService.get('company_id');
        this.orderIdsCallStatus.submit();
        this.bpeService.getUnshippedOrderIds(partyId).then(orderIds => {
            this.allOrderIds = orderIds;
            this.retrieveAllOrders();
            // set timeout is added in order to trigger a page change event of the navigation component
            setTimeout(() => this.pageNum = 1);

            this.orderIdsCallStatus.callback(null, true);

        }).catch(error => {
            this.orderIdsCallStatus.error('Failed to retrieve unshipped order ids');
        });
    }

    retrieveAllOrders(): void {
        this.failedOrderMessages = [];

        let promises: Promise<any>[] = [];
        for (let i = 0; i < this.allOrderIds.length; i++) {
            let orderRetrievalPromise: Promise<any> = this.documentService.getCachedDocument(this.allOrderIds[i]);
            promises.push(orderRetrievalPromise);
        }

        this.allOrdersCallStatus.submit();
        Promise.all(promises
            .map(promise => promise.catch(error => {
                this.failedOrderMessages.push(error);
            }))
        ).then(orders => {
            if (this.failedOrderMessages.length > 0) {
                this.allOrdersCallStatus.error('Failed to retrieve some of the orders.')
            } else {
                for (let order of orders) {
                    this.orders.set(order.id, order);
                }
                this.aggregateAssociatedProducts();
                this.allOrdersCallStatus.callback(null, true);
            }
        });
    }

    onUnshippedOrdersPageChange(): void {
        this.displayedOrderIds = [];
        let offset: number = (this.pageNum - 1) * this.pageSize;
        for (let i = offset; i < offset + this.pageSize && i < this.allOrderIds.length; i++) {
            this.displayedOrderIds.push(this.allOrderIds[i]);
        }

        for (let i = 0; i < this.displayedOrderIds.length; i++) {
            if (this.orders.has(this.displayedOrderIds[i])) {
                continue;
            }

            let callStatus: CallStatus = new CallStatus();
            callStatus.submit();

            this.orderCallStatuses.set(this.displayedOrderIds[i], callStatus);
            this.documentService.getCachedDocument(this.displayedOrderIds[i]).then(order => {
                this.orders.set(this.displayedOrderIds[i], order);
                callStatus.callback('', true);

            }).catch(error => {
                callStatus.error('Failed to retrieve order: ' + this.displayedOrderIds[i]);
            });
        }
    }

    aggregateAssociatedProducts(): void {
        for (let order of Array.from(this.orders.values())) {
            let orderedProductProperties: ItemProperty[] = order.orderLine[0].lineItem.item.additionalItemProperty;
            for (let itemProperty of orderedProductProperties) {
                if (itemProperty.associatedCatalogueLineID.length > 0) {
                    console.log(itemProperty.value);
                }
            }
        }
    }

    // navigateToProductDetails(frameContract: DigitalAgreement): void {
    //     this.router.navigate(['/product-details'],
    //         {
    //             queryParams: {
    //                 catalogueId: frameContract.item.catalogueDocumentReference.id,
    //                 id: frameContract.item.manufacturersItemIdentification.id
    //             }
    //         });
    // }
    //
    // navigateToCompanyDetails(frameContract: DigitalAgreement): void {
    //     this.router.navigate(['/user-mgmt/company-details'],
    //         {
    //             queryParams: {
    //                 id: this.getCorrespondingPartyId(frameContract)
    //             }
    //         });
    // }
    //
    // navigateToQuotationDetails(frameContract: DigitalAgreement): void {
    //     this.router.navigate(['/bpe/frame-contract/' + frameContract.hjid]);
    // }
}
