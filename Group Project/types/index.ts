export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

export type IUser = {
    password: string;
    $id: any,
    accountid: any,
    id: string;
    role: string;
    email: string;
};

export type INewUser = {
    userid: string;
    email: string;
    username: string;
    password: string;
};

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
};

//USER SECTION
export type IUpdateUser = {
    file: any;
    userid: any;
    block: any;
    contact: any;
    imageid: any;
    imageUrl: any;
    username: any;
    bio: any;
    password: any;
    newPassword: any;
    $id: any,
    userId: any;
    email: any;
    role: string;
};

export type INewPost = {
    userId: string;
    caption: string;
    email: string;
    file: File[];
    tags?: string;
};

export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    tags?: string;
};

//GROUPS SECTION
export type INewGroup = {
    userId: string;
    counsellorId: string;
    buddyId: string;
    name: string;
    file: File[];
    bio?: string;
};

export type IGroupCollection = {
    groupId: any,
    userId?: any
}
export type IUpdateGroup = {
    groupId: string;
    imageUrl: any;
    imageId: any;
    counsellorId: string;
    buddyId: string;
    name: string;
    file: File[];
    bio?: string;
}

//COUNSELLOR SECTION
export type INewCounsellor = {
    userId: string;
    role: string;
    name: string;
    username: string;
    email: string;
    password: string;
    imageUrl: any;
    block: string;
    contact: string;
    bio: string;
}

export type IUpdateCounsellor = {
    $id: any;
    file: File[];
    name: string;
    username: string;
    email: string;
    password: string;
    imageUrl?: any;
    imageId?: any,
    block: string;
    contact: string;
    bio: string;
}

// BUDDY SECTION
export type INewBuddy = {
    userId: string;
    role: string;
    name: string;
    username: string;
    email: string;
    password: string;
    imageUrl: any;
    contact: string;
    bio: string;
}

export type IUpdateBuddy = {
    $id: any;
    file: File[];
    name: string;
    username: string;
    email: string;
    password: string;
    imageUrl?: any;
    imageId?: any,
    contact: string;
    bio: string;
}

//GROUP POSTS
export type INewPostM = {
    userId: string;
    groupId: any;
    caption: string;
    email: string;
    file: File[];
    tags?: string;
};

export type IUpdatePostM = {
    postId: string;
    groupId: any;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    tags?: string;
};

//SCHEDULE 
export type ISchedule = {
    counsellorid: string,
    days: any[],
    timeslot: any[],
    status: any[],
    dates: any[]
}

//APPOINTMENT
export type IAppointment = {
    counsellorid: string,
    studentid: string,
    semail: string,
    scontact: string,
    ccontact: string,
    date: string,
    timeslot: string
}