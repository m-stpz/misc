// single gateway for all cloud communication

import { Injectable, inject } from "@angular/core";
import { Functions, httpsCallable } from "@angular/fire/functions";
import { CloudFunctionsMap, FunctionName } from "../../shared/models";
import { firstValueFrom, from, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiService {
  private functions = inject(Functions);

  /**
   * type-safe wrapper for firebase callables
   */
  async call<K extends FunctionName>(
    name: K,
    payload: CloudFunctionsMap[K]["req"],
  ): Promise<CloudFunctionsMap[K]["res"]> {
    const callable = httpsCallable<
      CloudFunctionsMap[K]["req"],
      CloudFunctionsMap[K]["res"]
    >(this.functions, name);

    const result = await callable(payload);
    return result.data;
  }
}
