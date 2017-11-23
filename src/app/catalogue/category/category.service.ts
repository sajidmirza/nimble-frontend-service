/**
 * Created by suat on 17-May-17.
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Category} from "../model/category/category";
import * as myGlobals from '../../globals';
import {Code} from "../model/publish/code";

@Injectable()
export class CategoryService {
    private headers = new Headers({'Accept': 'application/json'});
    private baseUrl = myGlobals.catalogue_endpoint + `/catalogue/category`;

    selectedCategories: Category[] = [];

    constructor(private http: Http) {
    }

    getCategoriesByName(keywords: string): Promise<Category[]> {
        const url = `${this.baseUrl}?categoryNames=${keywords}`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.json() as Category[];
            })
            .catch(this.handleError);
    }

    getCategoriesByIds(codes: Code[]): Promise<Category[]> {
        if(!codes) {
            return Promise.resolve([]);
        }

        let url = this.baseUrl;
        let categoryIds:string = '';
        let taxonomyIds:string = '';

        let i = 0;
        for (; i<codes.length-1; i++) {
            categoryIds += encodeURIComponent(codes[i].value) + ",";
            taxonomyIds += codes[i].listID + ",";
        }
        categoryIds += encodeURIComponent(codes[i].value);
        taxonomyIds += codes[i].listID;

        url += "?taxonomyIds=" + taxonomyIds + "&categoryIds=" + categoryIds;

        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.json() as Category;
            })
            .catch(this.handleError);
    }

    getCategory(category: Category): Promise<Category> {
        const url = `${this.baseUrl}?taxonomyIds=` + category.taxonomyId + `&categoryIds=` + encodeURIComponent(category.id);
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.json()[0] as Category;
            })
            .catch(this.handleError);
    }

    getCategoryByCode(code: Code): Promise<Category> {
        const url = `${this.baseUrl}/` + code.listID + "/" + encodeURIComponent(code.value);
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                return res.json() as Category;
            })
            .catch(this.handleError);
    }

    addSelectedCategory(category: Category): void {
        // Only add if category is not null and doesn't exist in selected categories
        if (category != null && this.selectedCategories.findIndex(c => c.id == category.id) == -1) {
            this.selectedCategories.push(category);
        }
    }

    resetSelectedCategories():void {
        this.selectedCategories.length = 0;
    }

    resetData():void {
        this.resetSelectedCategories();
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
