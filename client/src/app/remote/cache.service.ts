import {IId} from "../../../../server/entities/id.interface";

export interface CacheService<T extends IId> {
  getCache(id: string);
}
