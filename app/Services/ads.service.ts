import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  ad: any;

  constructor(public db: AngularFirestore, private http: HttpClient, private auth: AuthService) { }

  UserUploadAds(value, uid, email, AdsImage, url) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('UserSendAds').add({
        owneremail: email,
        Uid: uid,
        condition: value.condition,
        title: value.title,
        description: value.description,
        price: value.price,
        adsImage: AdsImage,
        img_url:url,
        approved: false,
        reserved:false

      }).then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  reserveAd(id) {
    const curr = JSON.parse(localStorage.getItem('currentUser'))
    console.log(id);
    this.db
      .collection("AproveAds")
      .doc(id)
      .set({ reserved: true, reservedBy: curr.user.uid }, { merge: true });

    this.db
      .collection("UserSendAds")
      .doc(id)
      .set({ reserved: true, reservedBy: curr.user.uid }, { merge: true });
  }


  CancelreserveAd(id) {
    const curr = JSON.parse(localStorage.getItem('currentUser'))
    console.log(id);
    this.db
      .collection("AproveAds")
      .doc(id)
      .set({ reserved: false, reservedBy: '' }, { merge: true });

    this.db
      .collection("UserSendAds")
      .doc(id)
      .set({ reserved: false, reservedBy: '' }, { merge: true });

  }



  ViewAds() {
    // console.log("Document run");
    return this.db.collection('UserSendAds').snapshotChanges();


  }

  ViewaprovedAds() {
    // console.log("Document run");
    return this.db.collection('AproveAds',ref => ref.where('reserved','==',false)).
    snapshotChanges();


  }


  AdminViewAds() {
    // console.log("Document run");
    return this.db.collection('UserSendAds',ref => ref
    .where('approved', '==', false)).
    snapshotChanges();


  }

  viewByOwner(uid) {

    return this.db.collection('UserSendAds',ref => ref
    .where('Uid', '==', uid)
    .where('reserved','==',false)).
    snapshotChanges();
  }

  deleteByOwner(id) {
          
         return this.db.collection('UserSendAds').doc(id).delete().then(
            data => {
              console.log('ads has been deleted');
            }, err => {
              console.log('ads hasnt been deleted' + err);
            }
          );
    
  }


  deleteByAdmin(id,adsID) {

    console.log(adsID)

    return this.db.collection('AproveAds').doc(id).delete().then(
      data => {

        this.db.collection("UserSendAds").doc(adsID).set({ approved: false }, { merge: true });
        console.log('ads has been deleted');
      }, err => {
        console.log('ads hasnt been deleted' + err);
      }
    );
  }


  // getoneAds(id) {
  //   console.log(id + 'this is ads servise got one ads');
  //   return this.db.collection('UserSendAds').doc(id).get().subscribe(data => {
  //     console.log(data.data() + ' data this is ads servise got one ads');
  //     this.deleteByOwner(id);
  //   });
  // }




  aprovetheAds(value,id) {
    return new Promise<any>((resolve, reject) => {
      console.log(value.condition + 'this in adservis');


      this.db
          .collection("UserSendAds")
          .doc(id)
          .set({ approved: true }, { merge: true });


      this.db.collection('AproveAds').doc(id).set({
        adsId: id,
        Uid: value.Uid,
        condition: value.condition,
        title: value.title,
        description: value.description,
        price: value.price,
        owneremail: value.owneremail,
        img_url: value.img_url,
        reserved:false

      }).then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }


  GetReservedAds(){

    const curr = JSON.parse(localStorage.getItem('currentUser'))

    return this.db.collection("AproveAds",ref => ref.where('reserved', '==', true)
    .where('reservedBy', '==', curr.user.uid))
    .snapshotChanges()
    
  }


  GetMyReservedAds(){
    const curr = JSON.parse(localStorage.getItem('currentUser'))

    return this.db.collection("AproveAds",ref => ref.where('reserved', '==', true)
    .where('Uid', '==', curr.user.uid))
    .snapshotChanges()
    
  }

  editAd(id){

    return this.db.collection('UserSendAds').doc(id).snapshotChanges()

  }


  userUpdateAds(value,id,image_name,url){
    
    return this.db.collection("UserSendAds").doc(id).set({
      condition: value.condition,
      title: value.title,
      description: value.description,
      price: value.price,
      adsImage: image_name,
      img_url: url,
      Uid: value.Uid,
      approved: value.approved,
      owneremail: value.owneremail

    })
  }


  getClient(cli_id){

    return this.db.collection('user').doc(cli_id).snapshotChanges()
  }



}
