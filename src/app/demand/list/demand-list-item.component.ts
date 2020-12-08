/*
 * Copyright 2020
 * SRDC - Software Research & Development Consultancy; Ankara; Turkey
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import {Component, Input} from '@angular/core';
import {Demand} from '../../catalogue/model/publish/demand';
import {selectNameFromLabelObject, selectPreferredValue} from '../../common/utils';

@Component({
    selector: 'demand-list-item',
    templateUrl: './demand-list-item.component.html'
})
export class DemandListItemComponent {
    @Input() demand: Demand;
    @Input() leafCategory: any;

    selectNameFromLabelObject = selectNameFromLabelObject;
    selectPreferredValue = selectPreferredValue;

}
