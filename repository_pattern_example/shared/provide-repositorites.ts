import { Container } from "typedi";
import { UserRepository } from "./repositories/user.repository";
import { BoardRepository } from "./repositories/board.repository";
// import all repos

export function provideRepositories() {
  // TypeDI usually handles auto-instantiation if the class is decorated with @Service
  // but this functions ensures they are prepared and linked to the correct db instance

  Container.get(UserRepository);
  Container.get(BoardRepository);
  console.log("sucessfully registered all repos");
}
