var Main = (resolve) => require(['./views/Main.vue'], resolve)
export const otherRouter = {
    path: '/',
    redirect: '/login',
}
export const loginRoute = {
    path: '/login',
    title: '登录',
    name: 'login',
    component:(resolve) => require(['./views/login.vue'], resolve)
}
export const newRoute = {
    path: "/New",
    name: "new",
    meta: {
        requireAuth: true,
    },
    component:(resolve) => require(['./views/NewWindow.vue'], resolve),
    children: [
        { path: 'TwitterTheme', title: '新增主题', name: 'NewTwitterTheme', component: (resolve) => require(['./views/new/TwitterTheme.vue'], resolve) },
        { path: 'TwitterTask', title: '新增Twitter任务', name: 'NewTwitterTask', component: (resolve) => require(['./views/new/TwitterTask.vue'], resolve) },
        { path: 'YoutubeTask', title: '新增Youtube任务', name: 'NewYoutubeTask', component: (resolve) => require(['./views/new/YoutubeTask.vue'], resolve) },
        { path: 'TwitterUser', title: '新增Twitter用户', name: 'NewTwitterUser', component: (resolve) => require(['./views/new/TwitterUser.vue'], resolve) },
        { path: 'YoutubeUser', title: '新增Youtube用户', name: 'NewYoutubeUser', component: (resolve) => require(['./views/new/YoutubeUser.vue'], resolve) }
    ]
}
export const appRouter = [
    {
        path: '/ThemeManager',
        icon: 'document-text',
        title: '主题管理',
        meta: {
            requireAuth: true,
        },
        component: Main,
        children: [
            { path: '/', title: '主题管理', name: 'ThemeManager', meta: {requireAuth:true}, component: (resolve) => require(['./views/ThemeManager.vue'], resolve) }
        ]
    },
    {
        path: '/TaskManager',
        component: Main,
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/' ,redirect: 'twitter', component: (resolve) => require(['./views/NavSubComponent.vue'], resolve),
            children:[{ path: ':type', title: 'twitter任务管理', name: 'TaskManager', meta: {requireAuth:true}, component: (resolve) => require(['./views/TaskManager.vue'], resolve)}]
            }
        ]
    },
    {
        path: '/UserManager',
        component: Main,
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/' ,redirect: 'twitter', component: (resolve) => require(['./views/NavSubComponent.vue'], resolve),
            children:[{ path: ':type', title: 'twitter用户管理', name: 'UserManager', meta: {requireAuth:true}, component: (resolve) => require(['./views/UserManager.vue'], resolve)}]
            }
        ]
    }
]

const routers = [
    newRoute,
    otherRouter,
    loginRoute,
    ...appRouter
];
export default routers;