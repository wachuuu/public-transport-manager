import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NormalizeStringService {

  public normalize(str: string) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\u0142/g, "l");
  }
}
