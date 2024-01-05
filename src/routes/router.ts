import {Router as expressRouter} from "express";
import {
  // addUser,
  // assingTaskUser,
  sendMsgUser, userPublishMsg,
  // updatePassword,
} from "../controllers/userController";
// import {addClaim, addTaskClaim} from "../controllers/claimController";


const router = expressRouter();

router.get("/", (_, res) => res.status(200).send("It Works!"));

// router.post("/user", addUser);
// router.patch("/user/password", updatePassword);
// router.post("/user/task", assingTaskUser);

// router.post("/claim", addClaim);
// router.post("/claim/task", addTaskClaim);

router.post("/user/message", sendMsgUser);
router.post("/user/publish", userPublishMsg);

export default router;
