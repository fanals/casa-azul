import { Injectable } from '@angular/core';
import { ArticleType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor() {}

  private _toString(a:ArticleType) {
    return '['+a.ami+'|'+a.infos+'|'+JSON.stringify(a.questionsAnswers)+'|'+(a.half ? this._toString(a.half) : '')+'|'+(a.mii ? a.mii.sort().join(',') : '')+'|'+(a.pii ? a.pii.sort().join(',') : '')+']';
  }

  public areEqual(a1:ArticleType, a2:ArticleType) {
    return this._toString(a1) === this._toString(a2);
  }

}
