import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { LoginComponent } from './user-mgmt/login.component';
import { LogoutComponent } from './user-mgmt/logout.component';
import { RegistrationComponent } from './user-mgmt/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserFormComponent } from './user-mgmt/user-form.component';
import { UserService } from './user-mgmt/user.service';
import { CredentialsFormComponent } from './user-mgmt/credentials-form.component';
import { CredentialsService } from './user-mgmt/credentials.service';
import { CategorySearchComponent } from './catalogue/category/category-search.component';
import { CategoryService } from './catalogue/category/category.service';
import { ProductPublishComponent } from './catalogue/product-publish.component';
import { AdditionalItemPropertyComponent } from './catalogue/additional-item-property.component';
import {CatalogueService} from './catalogue/catalogue.service';
import { ExplorativeSearchComponent } from './explorative-search/explorative-search.component';
import { ExplorativeSearchService } from './explorative-search/explorative-search.service';
import { ExplorativeSearchFormComponent } from './explorative-search/explorative-search-form.component';
import { ExplorativeSearchDetailsComponent } from './explorative-search/explorative-search-details.component';


@NgModule({
    imports: [
            BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        NgbModule.forRoot()
        ],
        declarations: [
        AppComponent,
        LoginComponent,
        LogoutComponent,
        RegistrationComponent,
        DashboardComponent,
        UserFormComponent,
        CredentialsFormComponent,
        CategorySearchComponent,
        ProductPublishComponent,
        ExplorativeSearchComponent,
        ExplorativeSearchFormComponent,
        ExplorativeSearchDetailsComponent,
        AdditionalItemPropertyComponent
        ],
        providers: [
        UserService,
        CredentialsService,
        CategoryService,
        CatalogueService,
        ExplorativeSearchService
        ],
        bootstrap: [
        AppComponent
        ]
})

export class AppModule { }
