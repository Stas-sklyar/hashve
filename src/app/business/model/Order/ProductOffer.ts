import { ICity } from "../../interfaces/ICity";
import { IPackage } from "../../interfaces/IPackage";
import { IStore } from "../../interfaces/IStore";


export interface ProductOffer {
    store: IStore ;
    city: ICity | String;
    package: IPackage | String;
    finished: boolean;
}
