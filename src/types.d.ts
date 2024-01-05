export interface IUser {
    id:string,
    name:string,
    email:string,
    password?:string
    tasksAssigned?:claimsTasksAssigned[]
}

export interface claimsTasksAssigned{
    task:ITask,
    claim:IClaims
}

export interface ITask{
    active:boolean,
    completed:boolean,
    status: "Unassigned" |"Assigned" | "Accepted" |
    "Check-In"| "Check-out" | "Completed",
    taskCaption:string
}

export interface IClaims {
    insuredName: string,
    lossAddress: string,
    description: string,
    tasks?: ITask[]
}

export interface IMessage {
    description:string,
    userId: string,
}
