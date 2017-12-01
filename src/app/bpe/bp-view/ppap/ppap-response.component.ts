import {Component, Input} from "@angular/core";
import {Ppap} from "../../../catalogue/model/publish/ppap";
import {PpapResponse} from "../../../catalogue/model/publish/ppap-response";
import {BPDataService} from "../bp-data-service";
import {BPEService} from "../../bpe.service";
import {ProcessVariables} from "../../model/process-variables";
import {ProcessInstanceInputMessage} from "../../model/process-instance-input-message";
import {ModelUtils} from "../../model/model-utils";
import {CallStatus} from "../../../common/call-status";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogueService} from "../../../catalogue/catalogue.service";
import {PpapDocument} from "../../../catalogue/model/publish/PpapDocument";
import {BinaryObject} from "../../../catalogue/model/publish/binary-object";
import {ItemProperty} from "../../../catalogue/model/publish/item-property";
import {UBLModelUtils} from "../../../catalogue/model/ubl-model-utils";
import {DocumentReference} from "../../../catalogue/model/publish/document-reference";
import {Attachment} from "../../../catalogue/model/publish/attachment";

@Component({
    selector: 'ppap-response',
    templateUrl: './ppap-response.component.html'
})

export class PpapResponseComponent{

    constructor(public bpDataService: BPDataService,
                public bpeService: BPEService,
                public catalogueService:CatalogueService,
                public route: ActivatedRoute,
                private router:Router) {
    }

    processid : any;
    id : any;
    catalogueId: any;
    ppap : Ppap;
    documents: any;
    newProperty: ItemProperty = UBLModelUtils.createAdditionalItemProperty(null, null);

    ppapResponse : PpapResponse = null;

    ppapDocuments : PpapDocument[] = [];
    note: any;
    noteToSend : any;
    binaryObjects: any[] = [];
    callStatus:CallStatus = new CallStatus();
    ngOnInit() {
        this.route.queryParams.subscribe(params =>{
            this.processid = params['pid'];
            this.id = params['id'];
            this.catalogueId = params['catalogueId'];

            this.catalogueService.getCatalogueLine(this.catalogueId,this.id).then(line =>{
                this.bpDataService.catalogueLine = line;
            }).catch(error => {

            });

            this.bpeService.getProcessDetailsHistory(this.processid).then(task => {
                this.ppap = task[3].value as Ppap;
                let i = 0;
                this.documents = [];
                for(;i<this.ppap.documentType.length;i++){
                    this.documents.push(this.ppap.documentType[i]);
                }
                this.note = this.ppap.note;
            });
        });
    }

    private fileChange(event: any,documentName:string) {
        let fileList: FileList = event.target.files;
        let binaryObjects: BinaryObject[] = [];
        if (fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                let file: File = fileList[i];
                let reader = new FileReader();
                reader.onload = function (e: any) {
                    let base64String = reader.result.split(',').pop();
                    let binaryObject = new BinaryObject(base64String, file.type, file.name, "", "");
                    binaryObjects.push(binaryObject);
                };
                reader.readAsDataURL(file);
            }
        }
        this.binaryObjects.push({documentName:documentName,documents:binaryObjects});
    }

    private static generateUUID(): string {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    isSent(document):boolean{
        for(var i=0;i<this.binaryObjects.length;i++){
            if(document == this.binaryObjects[i].documentName){
                return true;
            }
        }
        return false;
    }

    responseToPpapRequest(acceptedIndicator: boolean){
        for(let i=0;i<this.binaryObjects.length;i++){
            for(let j=0;j<this.binaryObjects[i].documents.length;j++){
                let attachment : Attachment = new Attachment(this.binaryObjects[i].documents[j],null,null);
                let documentRef: DocumentReference = new DocumentReference(PpapResponseComponent.generateUUID(),null,null,null,null,this.binaryObjects[i].documentName,null,null,null,attachment,null,null,null);
                this.ppapDocuments.push(new PpapDocument(documentRef));
            }
        }


        this.ppapResponse = UBLModelUtils.createPpapResponse(this.ppap,acceptedIndicator);
        this.ppapResponse.ppapDocument = this.ppapDocuments;
        this.ppapResponse.note = this.noteToSend;
        let vars: ProcessVariables = ModelUtils.createProcessVariables("Ppap", this.ppap.buyerCustomerParty.party.id, this.ppap.sellerSupplierParty.party.id, this.ppapResponse);
        let piim: ProcessInstanceInputMessage = new ProcessInstanceInputMessage(vars, this.bpDataService.processMetadata.process_id);



        this.callStatus.submit();
        this.bpeService.continueBusinessProcess(piim).then(
            res => {
                this.callStatus.callback("Ppap Response placed", true);
                this.router.navigate(['dashboard']);
            }
        ).catch(
            error => this.callStatus.error("Failed to send Ppap Response")
        );
    }
}