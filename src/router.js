import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}
Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: { name: "Users" },
      component: importComponent("DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token") != null) {
          next();
        } else {
          next({ name: "login" });
        }
      },
      children: [
        //Dashboard
        {
          path: "/dashboard",
          name: "Dashboard",
          meta: { title: "Dashboard" },
          component: importComponent("Dashboard")
        },
        //Users
        {
          path: "/users",
          name: "Users",
          meta: { title: "Users" },
          component: importComponent("DataMaster/Users")
        },
        //Users
        {
          path: "/uchistory",
          name: "User Challenge History",
          meta: { title: "User Challenge History" },
          component: importComponent("DataMaster/UserChallengeHistory")
        },
        //Role
        {
          path: "/roles-manager",
          name: "Role Manager",
          meta: { title: "Role Manager" },
          component: importComponent("DataMaster/RoleManager")
        },
        //Admin
        {
          path: "/admins-manager",
          name: "Admin Manager",
          meta: { title: "Admin Manager" },
          component: importComponent("DataMaster/AdminManager")
        },
        //E-Learning Challenge History
        {
          path: "/elearn",
          name: "User E-Learning Challenge History",
          meta: { title: "E-learn History" },
          component: importComponent("DataMaster/HistoryElearn")
        },
        //Challenge Manager
        {
          path: "/challenge",
          name: "Challenge Manager",
          meta: { title: "Challenge Manager" },
          component: importComponent("DataMaster/ChallengeManager")
        },
        //Catalogue
        {
          path: "/catalogue",
          name: "Catalogue Manager",
          meta: { title: "Catalogue Manager" },
          component: importComponent("DataMaster/CatalogueManager")
        },
        //Catalogue Type
        {
          path: "/catalogue_type",
          name: "Catalogue Type",
          meta: { title: "Catalogue Type" },
          component: importComponent("DataMaster/CatalogueType")
        },
        //Catalogue Stock Gudang
        {
          path: "/catalogue_stock",
          name: "Catalogue Stock",
          meta: { title: "Catalogue Stock" },
          component: importComponent("DataMaster/CatalogueStock")
        },
        //News
        {
          path: "/news-manager",
          name: "News Manager",
          meta: { title: "News Manager" },
          component: importComponent("DataMaster/NewsManager")
        },
        //News Form
        {
          path: "/news-form/:inputType",
          name: "News Form",
          props: true,
          meta: { title: "News Form" },
          component: importComponent("DataMaster/NewsManagerForm")
        },
        //Periode
        {
          path: "/periode-manager",
          name: "Periode Manager",
          meta: { title: "Periode Manager" },
          component: importComponent("DataMaster/PeriodeManager")
        },
        //Redeem
        {
          path: "/redeem-manager",
          name: "Redeem Manager",
          meta: { title: "Redeem Manager" },
          component: importComponent("DataMaster/RedeemManager")
        },
        //User Review
        {
          path: "/review",
          name: "User Review",
          meta: { title: "User Review" },
          component: importComponent("DataMaster/UserReview")
        },
        //Device Manager
        {
          path: "/device-manager",
          name: "Device Manager",
          meta: { title: "Device Manager" },
          component: importComponent("DataMaster/DeviceManager")
        },
        //E-learning Challenge Manager
        {
          path: "/elearn-challenge-manager",
          name: "E-Learning Challenge Manager",
          meta: { title: "E-Learning Challenge Manager" },
          component: importComponent("DataMaster/ElearningChallengeManager")
        },
        //E-Learning Challenge Form
        {
          path: "/elearn-challenge-form/:inputType",
          name: "E-Learning Challenge Form",
          props: true,
          meta: { title: "E-Learning Challenge Form" },
          component: importComponent("DataMaster/ElearningChallengeForm")
        },
        //Maintenance Manager
        {
          path: "/maintenance-manager",
          name: "Maintenance Manager",
          meta: { title: "Maintenance Manager" },
          component: importComponent("DataMaster/MaintenanceManager")
        },
        //Package Manager
        {
          path: "/package-manager",
          name: "Package Manager",
          meta: { title: "Package Manager" },
          component: importComponent("DataMaster/PackageManager")
        },
        //Package Manager
        {
          path: "/message-manager",
          name: "Message Manager",
          meta: { title: "Message Manager" },
          component: importComponent("DataMaster/MessageManager")
        }
      ]
    },
    //Login
    {
      path: "/login",
      name: "login",
      meta: { title: "Login" },
      component: importComponent("Login")
    },
    //Logout
    {
      path: "/logout",
      name: "logout",
      meta: { title: "Logout" }
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

//mengset judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
});

export default router;