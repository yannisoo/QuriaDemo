import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { InventoryService } from '../inventory.service';
import { ManifestService } from '../manifest.service';



@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor(
    private route: ActivatedRoute, 
    private auth: AuthService, 
    private inventory: InventoryService, 
    private manifest: ManifestService
    ) { }
  primarymember:any;
  returned: any;
  manifestsUrlObj: any;
  manifestObj: any;
  character: any
  k = 0;
  kmax = -1;
  equippedItemsDisplay: any; 
  equippedItemsInstance: any; 
  ngOnInit(): void {
    // this.getToken()
    this.getManifests()
    if( localStorage.getItem('access_token') == undefined)
    {
      this.getToken()
    }
    this. getCharacters()

   


  }
  getToken(){
    this.route.queryParamMap.subscribe((params) => {
      this.returned = { ...params.keys, ...params };
      console.log(this.returned);
      this.auth.postToken(this.returned.params.code).subscribe((response) => {
        console.log(response)
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('membership_id', response.membership_id);
        });
    }) 
  }
   getManifests(){
    
      this.manifest.getManifests().subscribe((response) => {
      this.manifestObj = {}
      this.manifest.catchThemAll(response.Response.jsonWorldComponentContentPaths.fr.DestinyPlugSetDefinition).subscribe((response) => {
        this.manifestObj.DestinyPlugSetDefinition = response;
        this.k++
      })
      this.manifest.catchThemAll(response.Response.jsonWorldComponentContentPaths.fr.DestinyInventoryItemDefinition).subscribe((response) => {
        this.k++
        this.manifestObj.DestinyInventoryItemDefinition = response;
      })
      this.manifest.catchThemAll(response.Response.jsonWorldComponentContentPaths.fr.DestinyPlugSetDefinition).subscribe((response) => {
        this.k++
        this.manifestObj.DestinyPlugSetDefinition = response;
      })
    })
  }
  getCharacters(){
    this.inventory.getMembershipDataById().subscribe((response) => {
      this.primarymember = response.Response.primaryMembershipId;
      console.log(this.primarymember)
      this.inventory.getProfile(this.primarymember).subscribe((response) => {
        while(this.k != 3)
        {
          console.log(this.k)
        }
        console.log(response)
        // console.log(this.manifestObj.DestinyInventoryItemDefinition)
        this.equippedItemsDisplay = []
        this.equippedItemsInstance = []
        this.character = []
        for (let Character in response.Response.characterEquipment.data){
          this.character.push(Character)
        }
        for (let item in response.Response.characterEquipment.data[this.character[0]].items){
            console.log(response.Response.characterEquipment.data[this.character[0]])
            this.getItemInfo(response.Response.characterEquipment.data[this.character[0]].items[item])
        }
        console.log(this.equippedItemsInstance)
        for (let item in this.equippedItemsInstance){
          this.equippedItemsInstance[item].mod = []
          for (let mod in response.Response.itemComponents.sockets.data[this.equippedItemsInstance[item].itemInstanceId].sockets){
            this.getSocketedValue(response.Response.itemComponents.sockets.data[this.equippedItemsInstance[item].itemInstanceId].sockets[mod].plugHash, item)
          }
          for (let something in this.equippedItemsInstance[item].mod){
            console.log(this.equippedItemsInstance[item].mod[something].displayProperties.name)
          }
        }
      });
  });
  }
  getItemInfo(item: any){
    
    if(this.manifestObj.DestinyInventoryItemDefinition[item.itemHash].itemType == 2){
      item.display = this.manifestObj.DestinyInventoryItemDefinition[item.itemHash]
      this.equippedItemsInstance.push(item)
    }
  }
  getSocketedValue(socketed: any,item: any){
    if (this.manifestObj.DestinyInventoryItemDefinition[socketed] != undefined && this.manifestObj.DestinyInventoryItemDefinition[socketed].itemCategoryHashes[1] == 4104513227){
      this.equippedItemsInstance[item].mod.push(this.manifestObj.DestinyInventoryItemDefinition[socketed])
    }
  }
}