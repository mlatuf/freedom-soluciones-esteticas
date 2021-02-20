import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  getErrorText(error:any ): String {
    if (!error) return;
    switch (error.code) {
      case "auth/user-not-found":
        return "No existe ningún registro de usuario que corresponda al identificador proporcionado.";
      default:
        return error.message;
    }
  }
}
