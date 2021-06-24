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
  character: any;
  weapons: any;
  k = 0;
  kmax = -1;
  equippedItemsDisplay: any; 
  equippedItemsInstance: any; 
  currentPrimary: any;
  currentSpecial: any;
  reco: any;
  toBeTransfered: any;
  transferId: any;

  WeaponObj:any;

  ngOnInit(): void {
    this.getToken()
    this.getManifests()
    if( localStorage.getItem('access_token') == undefined)
    {
      this.getToken()
    }
    this.getCharacters()
    
  }



  equip(){
    console.log('on mappellelovni')
    this.inventory.equipItems(this.toBeTransfered).subscribe((response) => {});
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
        this.weapons = []
        this.toBeTransfered = []
        this.transferId = []
        for (let Character in response.Response.characterEquipment.data){
          this.character.push(Character)
        }
        for (let item in response.Response.characterEquipment.data[this.character[0]].items){
            this.getItemInfo(response.Response.characterEquipment.data[this.character[0]].items[item])
        }
        console.log(this.equippedItemsInstance)
        for (let item in this.equippedItemsInstance){
          this.equippedItemsInstance[item].mod = []
          for (let mod in response.Response.itemComponents.sockets.data[this.equippedItemsInstance[item].itemInstanceId].sockets){
            this.getSocketedValue(response.Response.itemComponents.sockets.data[this.equippedItemsInstance[item].itemInstanceId].sockets[mod].plugHash, item)
          }
          for (let something in this.equippedItemsInstance[item].mod){
            console.log(this.equippedItemsInstance[item].mod[something])
          }
        }
        console.log(this.weapons)
        for (let i in response.Response.characterInventories.data[this.character[0]].items){
          console.log(response.Response.characterInventories.data[this.character[0]].items[i])
          if(response.Response.characterInventories.data[this.character[0]].items[i].itemHash == 3627185503 || response.Response.characterInventories.data[this.character[0]].items[i].itemHash == 1721938300 || response.Response.characterInventories.data[this.character[0]].items[i].itemHash == 2304861612 || response.Response.characterInventories.data[this.character[0]].items[i].itemHash == 469005214 ) {
            this.toBeTransfered.push(response.Response.characterInventories.data[this.character[0]].items[i].itemInstanceId)
          }
        }
        
        console.log(this.toBeTransfered)

        this.hellOnEarth()
      });
  });
  }
  cheapCheat(){
    
  }
  getItemInfo(item: any){
    
    if(this.manifestObj.DestinyInventoryItemDefinition[item.itemHash].itemType == 2){
      item.display = this.manifestObj.DestinyInventoryItemDefinition[item.itemHash]
      this.equippedItemsInstance.push(item)
    }
    if(this.manifestObj.DestinyInventoryItemDefinition[item.itemHash].itemType == 3){
      
      this.weapons.push(this.manifestObj.DestinyInventoryItemDefinition[item.itemHash])
      
    }
  }
  getSocketedValue(socketed: any,item: any){
    if (this.manifestObj.DestinyInventoryItemDefinition[socketed] != undefined && this.manifestObj.DestinyInventoryItemDefinition[socketed].itemCategoryHashes[1] == 4104513227){
      this.equippedItemsInstance[item].mod.push(this.manifestObj.DestinyInventoryItemDefinition[socketed])
    }
  }









  hellOnEarth(){
    this.WeaponObj = {
      '6': 'fusil automatique',
      '7': 'fusil à pompe',
      '9': 'revolver',
      '11': 'fusil à fusion',
      '12': 'fusil de précision',
      '13': 'fusil à impulsion',
      '14': 'fusil éclaireur',
      '17': 'pistolet',
      '23': 'lance grenade',
      '24': 'pistolet mitrailleur'
    }
    this.reco = {};
    this.weaponChecker();
    console.log( this.currentSpecial )
    this.helmetReader()
    this.gauntletReader()
    this.chestReader()
    this.bootsReader()
    console.log(this.reco.helmet)
    console.log(this.reco.gauntlet)
    console.log(this.reco.chest)
    console.log(this.reco.boots)

  }
  modTrue(piece: number, value: any){
    if(this.equippedItemsInstance[piece].mod[1].hash == value || this.equippedItemsInstance[0].mod[2].hash == value){
      return true
    }else{
      return false
    }
  }
  weaponChecker(){
    if(this.weapons[0].equippingBlock.ammoType == 2 && this.weapons[1].equippingBlock.ammoType == 1){
      this.currentPrimary = this.weapons[1].itemSubType
      this.currentSpecial = this.weapons[0].itemSubType
    }else if(this.weapons[1].equippingBlock.ammoType == 2 && this.weapons[0].equippingBlock.ammoType == 1){
      this.currentPrimary = this.weapons[0].itemSubType
      this.currentSpecial= this.weapons[1].itemSubType
    }
  }
  helmetReader(){
    switch (this.currentSpecial){
      case 12: 
        if(this.modTrue(0, 2307244871)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentSpecial)
        }
        break;
      case 7:
      case 11:
      case 23:
        this.primaryTarget()
    }
  }
  gauntletReader(){
    switch (this.currentSpecial){
      case 12: 
      case 23:
      case 11:
        this.primaryDex()
        break;
      case 7:
        if(this.modTrue(1, 2561450986)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling(this.currentSpecial)
        }
        break;   
    }
  }
  chestReader(){
    switch (this.currentSpecial){
      case 12: 
        if(this.modTrue(2, 2307244871)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentSpecial)
        }
        break;
      case 7:
      case 11:
      case 23:
        this.primaryFlinch()
    }
  }
  bootsReader(){
    switch (this.currentSpecial){
      case 12: 
        if(this.modTrue(3, 498878196)){
          this.reco.boots = 'parfait'
        }else {
          this.scavenger(this.currentSpecial)
        }
        break;
      case 7:
        if(this.modTrue(3, 3836152936)){
          this.reco.boots = 'parfait'
        }else {
          this.scavenger(this.currentSpecial)
        }
        break;
      case 11:
        if(this.modTrue(3, 2347686425)){
          this.reco.boots = 'parfait'
        }else {
          this.scavenger(this.currentSpecial)
        }
        break;
      case 23:
        if(this.modTrue(3, 3670960347)){
          this.reco.boots = 'parfait'
        }else {
          this.scavenger(this.currentSpecial)
        }
        break;
      default: this.reco.boots = 'comprenpa'
    }
  }
  primaryTarget(){
    switch(this.currentPrimary){
      case 9:
        if(this.modTrue(0, 2829974286)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentPrimary)
        }
        break;
      case 6:
        if(this.modTrue(0, 3201675491)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentPrimary)
        }
        break;
      case 14:
        if(this.modTrue(0, 631976966)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentPrimary)
        }
        break;
      case 13:
        if(this.modTrue(0, 3319681729)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentPrimary)
        }
        break;
      case 17:
        if(this.modTrue(0, 1507854082)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentPrimary)
        }
        break;
      case 24:
        if(this.modTrue(0, 3857411140)){
          this.reco.helmet = 'parfait'
        }else {
          this.targeting(this.currentPrimary)
        }
        break;
    }         
  }
  primaryDex(){
    switch(this.currentPrimary){
      case 9:
        if(this.modTrue(1, 3484440775)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling(this.currentPrimary)
        }
        break;
      case 6:
        if(this.modTrue(1, 1312062056)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling(this.currentPrimary)
        }
        break;
      case 14:
        if(this.modTrue(1, 327265103)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling(this.currentPrimary)
        }
        break;
      case 13:
        if(this.modTrue(1, 691818084)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling( this.currentPrimary)
        }
        break;
      case 17:
        if(!this.modTrue(1,101023751)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling(this.currentPrimary)
        }
        break;
      case 24:
        if(this.modTrue(1,201274281)){
          this.reco.gauntlet = 'parfait'
        }else {
          this.handling(this.currentPrimary)
        }
        break;
      default: this.reco.gauntlet = 'pacompris'
    }  
  }
  primaryFlinch(){
    switch(this.currentPrimary){
      case 9:
        if(this.modTrue(2,1859929470)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentPrimary)
        }
        break;
      case 6:
        if(this.modTrue(2,2505824339)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentPrimary)
        }
        break;
      case 14:
        if(this.modTrue(2,1279446438)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentPrimary)
        }
        break;
      case 13:
        if(this.modTrue(2,2379452959)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentPrimary)
        }
        break;
      case 17:
        if(!this.modTrue(2,2881057950)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentPrimary)
        }
        break;
      case 24:
        if(this.modTrue(2,3626376648)){
          this.reco.chest = 'parfait'
        }else {
          this.unflinching(this.currentPrimary)
        }
        break;
      default: this.reco.chest = 'pacompris'
    }  
  }

  targeting(WeaponType: string){
    this.reco.helmet = 'Essaie de mettre un mod de ciblage '+ this.WeaponObj[WeaponType] +' pour améliorer l’aide à la visée et la vitesse de ciblages'
  }
  handling(WeaponType: string){
    this.reco.gauntlet = 'Essaie de mettre un mod de dextérité ' + this.WeaponObj[WeaponType] + ' pour améliorer ton maniement'
  }
  unflinching(WeaponType: string){
    this.reco.chest = 'Essaie de mettre un mod visée imperturbable '+ this.WeaponObj[WeaponType] +' pour réduire le flinch reçu en visée'
  }
  scavenger(WeaponType: string){
    this.reco.boots = 'Essaie de mettre un mod récupérateur '+ this.WeaponObj[WeaponType] +' pour récuperer plus de munitions'
  }
}