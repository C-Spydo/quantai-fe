export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },


  {
    id: 'menu',
    title: 'Menu',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'summarise-video',
        title: 'Summarise Video',
        type: 'item',
        url: '/summarise-video',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'summary-history',
        title: 'Summary History',
        type: 'item',
        url: '/summary-history',
        classes: 'nav-item',
        icon: 'chrome'
      },

    ]
  }
];


// {
//   id: 'authentication',
//   title: 'Authentication',
//   type: 'group',
//   icon: 'icon-navigation',
//   children: [
//     {
//       id: 'login',
//       title: 'Login',
//       type: 'item',
//       classes: 'nav-item',
//       url: '/login',
//       icon: 'login',
//       target: true,
//       breadcrumbs: false
//     },
//     {
//       id: 'register',
//       title: 'Register',
//       type: 'item',
//       classes: 'nav-item',
//       url: '/register',
//       icon: 'profile',
//       target: true,
//       breadcrumbs: false
//     }
//   ]
// },
// {
//   id: 'utilities',
//   title: 'UI Components',
//   type: 'group',
//   icon: 'icon-navigation',
//   children: [
//     {
//       id: 'typography',
//       title: 'Typography',
//       type: 'item',
//       classes: 'nav-item',
//       url: '/typography',
//       icon: 'font-size'
//     },
//     {
//       id: 'color',
//       title: 'Colors',
//       type: 'item',
//       classes: 'nav-item',
//       url: '/color',
//       icon: 'bg-colors'
//     },
//     {
//       id: 'tabler',
//       title: 'Tabler',
//       type: 'item',
//       classes: 'nav-item',
//       url: 'https://ant.design/components/icon',
//       icon: 'ant-design',
//       target: true,
//       external: true
//     }
//   ]
// },