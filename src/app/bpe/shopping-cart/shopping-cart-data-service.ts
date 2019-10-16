import {Injectable} from '@angular/core';
import {Catalogue} from '../../catalogue/model/publish/catalogue';
import {CookieService} from 'ng2-cookies';
import {getAuthorizedHeaders} from '../../common/utils';
import * as myGlobals from '../../globals';
import {Http} from '@angular/http';
import {CatalogueLine} from '../../catalogue/model/publish/catalogue-line';

/**
 * Created by suat on 11-Oct-19.
 */
@Injectable()
export class ShoppingCartDataService {
    // the persisted catalogue storing the catalogue lines in the cart
    private cartCatalogue: Catalogue;

    private url = myGlobals.bpe_endpoint;

    constructor(private cookieService: CookieService,
                private http: Http) {}

    /**
     * @param product in the form Solr result
     */
    public addItemToCart(product: any): Promise<Catalogue> {
        let url = `${this.url}/shopping-cart?productId=${product.uri}`;
        return this.http
            .post(url, null, {headers: getAuthorizedHeaders(this.cookieService)})
            .toPromise()
            .then(res => {
                this.cartCatalogue = res.json();
                return Promise.resolve(this.cartCatalogue);
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    public removeItemFromCart(cartLineHjid: number): Promise<Catalogue> {
        let url = `${this.url}/shopping-cart?productId=${cartLineHjid}`;
        return this.http
            .delete(url, {headers: getAuthorizedHeaders(this.cookieService)})
            .toPromise()
            .then(res => {
                this.cartCatalogue = res.json();
                return Promise.resolve(this.cartCatalogue);
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    public cartFetched(): boolean {
        return this.cartCatalogue != null;
    }

    public async createShoppingCart(): Promise<Catalogue> {
        let url = `${this.url}/shopping-cart/new`;
        return this.http
            .post(url, null, {headers: getAuthorizedHeaders(this.cookieService)})
            .toPromise()
            .then(res => {
                this.cartCatalogue = res.json();
                return Promise.resolve(this.cartCatalogue);
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    public getShoppingCart(): Promise<Catalogue | null> {
        if (this.cartCatalogue != null) {
            return Promise.resolve(this.cartCatalogue);
        }

        let url = `${this.url}/shopping-cart`;
        return this.http
            .get(url, {headers: getAuthorizedHeaders(this.cookieService)})
            .toPromise()
            .then(res => {
                if (res.text() === '') {
                    return this.createShoppingCart();
                } else {
                    this.cartCatalogue = res.json();
                    return this.cartCatalogue;
                }
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
