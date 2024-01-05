import {Response, Request} from "express";
import {db} from "../config/config";
import {IClaims, ITask} from "../types";

interface IAssignTaksClaim {
  claimId: string,
  task:ITask
}

const addClaim = async (req: Request<IAssignTaksClaim>, res: Response) => {
  try {
    const {insuredName, lossAddress, description} = req.body;

    const userData: IClaims = {
      insuredName,
      lossAddress,
      description,
    };

    db.collection("claims").add(userData);

    res.status(200).send({
      status: "success",
      message: "Claim created Successfully",
      data: userData,
    });

    return true;
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: error});
  }
};


const addTaskClaim = async (req: Request, res: Response) => {
  try {
    const {claimId, task} = req.body;


    const claimRef = db.collection("claims").doc(claimId);
    const tasksRef = claimRef.collection("tasks");
    const responseUpdate = await tasksRef.add(task);


    res.status(200).send({
      status: "success",
      message: "Task Added Successfully",
      data: responseUpdate,
    });

    return true;
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: error});
  }
};


export {
  addClaim,
  addTaskClaim,
};
