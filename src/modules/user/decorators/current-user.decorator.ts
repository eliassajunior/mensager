import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { USER_PAYLOAD } from "src/modules/auth/consts/payload";

export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request[USER_PAYLOAD];

  return user;
});
