import {Response, Request} from "express";
import {admin, db} from "../config/config";
import {IMessage, IUser} from "../types";
import {FieldValue} from "firebase-admin/firestore";

interface IAssigmentTaskUser {
  userId:string,
  taskId:string,
  claimId:string
}

const addUser = async (req: Request<IUser>, res: Response) => {
  try {
    const {email, password, name} = req.body;

    const userResponse = await admin.auth().createUser({
      email,
      password,
    });

    if (userResponse) {
      const userData: IUser = {
        id: userResponse.uid,
        email,
        name,
      };

      db.collection("users").doc(userResponse.uid).set(userData);

      res.status(200).send({
        status: "success",
        message: "User created Successfully",
        data: userData,
      });
    }

    return true;
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: error});
  }
};

const updatePassword = async (req: Request<IUser>, res: Response) => {
  try {
    const {id, password} = req.body;
    const userResponse = await admin.auth().updateUser(id, {password});
    if (userResponse) {
      res.status(200).send({
        status: "success",
        message: "Password updated Successfully",
      });
    }
    return true;
  } catch (error) {
    return res.status(500).json({error: error});
  }
};

const assingTaskUser = async (
  req: Request<IAssigmentTaskUser>,
  res: Response
) => {
  try {
    const {userId, taskId, claimId} = req.body;


    const userRef = db.collection("users").doc(userId);
    const claimRef = db.doc(`claims/${claimId}`);
    const taskRef = db.doc(`claims/${claimId}/tasks/${taskId}`);
    const tasksUserRef = userRef.collection("tasksAssignments");
    const claimData = await claimRef.get();
    const taskData = await taskRef.get();

    if (!taskData.exists) {
      res.status(500).send({
        status: "Internal Server Error",
        message: "Task Data no exist",
      });
    } else {
      const resultTask = taskData.data();
      const resultClaim = claimData.data();

      if (resultTask && resultClaim) {
        if (resultTask.status !== "Unassigned") {
          res.status(500).send({
            status: "Internal Server Error",
            message: "Task must be Unassigned",
          });
        } else {
          await taskRef.update({status: "Assigned"});
          const resultTaskUpdated = {...resultTask, status: "Assigned"};
          const responseUpdate = await tasksUserRef.add({
            ...resultClaim,
            ...resultTaskUpdated,
            taskId: taskId,
            claimId: claimId,
          });
          res.status(200).send({
            status: "success",
            message: "Not exist result data",
            data: responseUpdate,
          });
        }
      } else {
        res.status(500).send({
          status: "Internal Server Error",
          message: "Internal Server Error",
        });
      }
    }

    return true;
  } catch (error) {
    return res.status(500).json({error: error});
  }
};

const sendMsgUser = async (req: Request<IMessage>, res: Response) => {
  try {
    const {description, userId} = req.body;

    const userRef = db
      .collection("USERS-POC")
      .doc(`USER-${userId}`);

    let device = (await userRef.get()).data()?.default_device;

    if (device.length === 0) {
      device = "DEFAULT";
    }

    const userMessageRef = userRef.collection("DEVICES")
      .doc(`${device}`);

    const doc = await userMessageRef.get();
    if (!doc.exists) {
      const createMessageArray = await userMessageRef.set({messages: []});
      const responseUpdateMessage = await userMessageRef
        .update({messages: FieldValue
          .arrayUnion({description, date: new Date()})});

      Promise.all([createMessageArray, responseUpdateMessage]);

      res.status(200).send({
        status: "success",
        message: "Message was sent",
      });
      return true;
    }

    const response = await userMessageRef
      .update({messages: FieldValue
        .arrayUnion({description, date: new Date()})});

    if (response.writeTime) {
      res.status(200).send({
        status: "success",
        message: "Message was sent",
      });
    }
    return true;
  } catch (error) {
    return res.status(500).json({error: error});
  }
};

const userPublishMsg = async (req: Request<IMessage>, res: Response) => {
  try {
    const {description, userId} = req.body;

    const userRef = db
      .collection("USERS-POC")
      .doc(`USER-${userId}`);

    let device = (await userRef.get()).data()?.default_device;

    if (device.length === 0) {
      device = "DEFAULT";
    }

    const userMessageRef = userRef.collection("MESSAGE")
      .doc(`MESSAGE-${device}`);

    const doc = await userMessageRef.get();
    if (!doc.exists) {
      const createMessageArray = await userMessageRef.set({messages: []});
      const responseUpdateMessage = await userMessageRef
        .update({messages: FieldValue
          .arrayUnion({description, date: new Date()})});

      Promise.all([createMessageArray, responseUpdateMessage]);

      res.status(200).send({
        status: "success",
        message: "Message was sent by user",
      });
      return true;
    }

    const response = await userMessageRef
      .update({messages: FieldValue
        .arrayUnion({description, date: new Date()})});

    if (response.writeTime) {
      res.status(200).send({
        status: "success",
        message: "Message was sent by user",
      });
    }
    return true;
  } catch (error) {
    return res.status(500).json({error: error});
  }
};

export {
  addUser,
  assingTaskUser,
  updatePassword,
  sendMsgUser,
  userPublishMsg,
};

