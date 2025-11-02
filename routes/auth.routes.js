import {Router} from "express"

const authRouter = Router();

authRouter.post("./sign-up", (resq, res) => res.send({title: "Sign Up"}));
authRouter.post("./sign-in", (resq, res) => res.send({title: "Sign In"}));
authRouter.post("./sign-out", (resq, res) => res.send({title: "Sign Out"}));

export default authRouter;