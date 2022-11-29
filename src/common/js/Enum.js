
var EnumEditMode = {
    None: 0,
    Add: 1,
    Edit: 2,
    Watch: 3
}

var EnumTypeTask = {
    Personal: 1,
    GroupPersonal: 2,
    Group: 3
}

var EnumAttachment =
{ 
    AttachAvatar: 1,
    AttachTask: 2,
    AttachComment: 3,
}

var EnumModeUseControl = {
    Edit: 2,
    Add: 1
};

var EnumTypeDeadline = {
    Start: 0,
    End: 1
};

var EnumTypeGroupTask = {
    Personal: 1,
    Group: 2
};

var EnumTypeNotification = { 
    AddUserGroupTask: 1,
    DeleteUserFromGroupTask: 2,
    AssignedTask: 3,
    DeletedTask: 4,
    CommentedTask: 5,
    RemindTask: 6,
    DeleteGroupTask: 7,
    RemindEndTimeTask: 9,
    RemindStartTimeTask: 10,
    ChangeRoleGroupTask: 11
}

var EnumStatusTask = { 
    NeedExecute: 1,
    CheckFinished: 2,
    ConfirmedFinished: 3
}

var EnumTimeFilter = {
    CurrentWeek: 1,
    CurrentMonth: 2,
    Today: 3,
    BeforeMonth: 4,
    BeforeWeek: 5,
    NextWeek: 6,
    NextMonth: 7
}

export {EnumTimeFilter, EnumStatusTask, EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl,EnumTypeDeadline, EnumTypeGroupTask, EnumTypeNotification};