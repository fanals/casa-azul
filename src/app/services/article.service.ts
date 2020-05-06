import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor() {}

  private _toString(a) {
    return '['+a.ami+'|'+(a.half ? this._toString(a.half) : '')+'|'+(a.mii ? a.mii.sort().join(',') : '')+'|'+(a.pii ? a.pii.sort().join(',') : '')+']';
  }

  public areEqual(a1, a2) {
    return this._toString(a1) === this._toString(a2);
  }

}
