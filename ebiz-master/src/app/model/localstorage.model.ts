export enum localstoragemodel {
  tokenlogin,
}
export enum TrackingStatusNumber {
  statusnum0 = 1,
  statusnum1 = 2,
  statusnum2 = 3,
  statusnum3 = 4
}

export interface TrackingStatus {
  [TrackingStatusNumber.statusnum0] : boolean;
  [TrackingStatusNumber.statusnum1] : boolean;
  [TrackingStatusNumber.statusnum2] : boolean;
  [TrackingStatusNumber.statusnum3] : boolean;
}
export const InitTrackStatus: TrackingStatus = {
  [TrackingStatusNumber.statusnum0] : false,
  [TrackingStatusNumber.statusnum1] : false,
  [TrackingStatusNumber.statusnum2] : false,
  [TrackingStatusNumber.statusnum3] : false,

};
