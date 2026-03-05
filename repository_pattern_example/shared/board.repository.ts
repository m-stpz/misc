import { DataRepository } from "./data-repository";
import { Board } from "./models";
import {
  BoardPath,
  BoardPathProperties,
  ID,
  UserPath,
} from "./path-properties";

export class BoardRepository extends DataRepository<
  Board,
  BoardPathProperties
> {
  constructor() {
    super(Board, BoardPath);
  }

  watchActiveBoards(orgId: ID) {
    return this.watchCollection({ organization: orgId });
  }
}
