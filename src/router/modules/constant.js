
import Layout from "@/views/layout";
import i18n from "@/lang";
import { getUserLanguage } from "@/utils/auth";
i18n.locale = getUserLanguage();
export const constantRouterMap = [
  {
    path: "/redirect",
    component: Layout,
    isShow: 0,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index"),
    meta: { title: "login" },
    isShow: 0,
  },
  {
    path: "/internalLogin",
    name: "internalLogin",
    component: () => import("@/views/login/internalLogin"),
    meta: { title: "internalLogin" },
    hidden: true,
    isShow: 0,
  },
  {
    path: "/uuapLogin",
    name: "uuapLogin",
    component: () => import("@/views/login/uuapLogin"),
    meta: { title: "uuapLogin" },
    hidden: true,
    isShow: 0,
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    meta: { title: "error" },
    isShow: 0,
  },
  {
    path: "/500",
    component: () => import("@/views/errorPage/500.vue"),
    isShow: 0,
  },
  // {
  //   path: "/reviewInfo",
  //   component: () => import("@/views/reviewInfo"),
  //   // isShow: 0,
  // },
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    menuName: '首页',
    isShow: 1,
    icon: "home",
    children: [
      {
        path: '/home',
        onlyChild: true,
        component: () => import('@/views/home/index'),
        name: 'home',
        isShow: 1,
        menuName: '首页',
        icon: "home",
        meta: { title: 'home' }
      }
    ]
  },
  {
    path: '/fullScreenFault',
    name: 'fullScreenFault',
    component: () => import('@/views/carMonitorSys/fullScreenFault'),
    hidden: true,
    meta: { 
      title: '今日故障警情',
      filePath: '/fullScreenFault',
      interfacePrefix: '/api/monitor',
    }
  },
  {
    path: '/monthfull',
    name: 'monthfull',
    component: () => import('@/views/month/index'),
    hidden: true,
    meta: { 
      title: '运营月报',
      filePath: '/month',
      interfacePrefix: '/api/monitor',
    }
  },
  // {
  //   path: '/dailyOperations',
  //   // name: 'dailyOperations',
  //   component: () => import('@/views/dailyOperations/index'),
  //   hidden: true,
  //   meta: { 
  //     title: '运营日报',
  //     filePath: '/dailyOperations',
  //     interfacePrefix: '/api/monitor',
  //   }
  // },
  // {
  //   path: '/mapGridStatistics',
  //   // name: 'mapGridStatistics',
  //   component: () => import('@/views/carMonitorSys/mapGridStatistics/index'),
  //   hidden: true,
  //   meta: { 
  //     title: '热点地图',
  //     filePath: '/mapGridStatistics',
  //     interfacePrefix: '/api/monitor',
  //   }
  // },
  {
    path: '/',
    component: Layout,
    menuName: '功能导航',
    name: 'navigationAll',
    isShow: 0,
    children: [
      {
        path: '/navigationAll',
        menuName: '功能导航',
        isShow: 0,
        name: 'navigationAll',
        component: () => import('@/views/userCenterSys/navigationAll'),
        meta: { 
          title: '功能导航',
          filePath: '/navigationAll',
          interfacePrefix: '/api/system',
        },
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuName: '快速入口',
    name: 'fastEntry',
    isShow: 0,
    children: [
      {
        path: '/fastEntry',
        menuName: '快速入口',
        isShow: 0,
        name: 'fastEntry',
        component: () => import('@/views/fastEntry'),
        meta: { 
          title: '快速入口',
          filePath: '/fastEntry',
          interfacePrefix: '/api/system',
        },
      }
    ]
  }
];
