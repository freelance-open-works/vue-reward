<!-- @format -->

<template>
    <div class="dashboard font">
        <v-navigation-drawer v-model="drawer" :color="blue" width="256" app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              style="font-family: 'Montserrat', sans-serif; color: white"
            >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-app-bar :color="burly" app fixed height="75px">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white"></v-app-bar-nav-icon>
                <VSpacer />
                <v-toolbar-items>
                    <v-btn text router: @click="logoutFuction()"><v-icon color="white">mdi-power</v-icon></v-btn>
                </v-toolbar-items>
            </v-app-bar>
            <div class="fullheight pa-5">
              <router-view></router-view>
            </div>
        </div> 
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      items: [],
      burly: '#DEB887',
      blue: '#6495ED',
      menus: [
        { title: "Dashboard", to: "/dashboard" },
        { title: "Users", to: "/users" },
        { title: "User Challenge History", to: "/uchistory" },
        { title: "User E-Learning Challenge History", to: "/elearn" },
        { title: "Catalog Manager", to: "/catalogue" },
        { title: "News Manager", to: "/news-manager" },
        { title: "Challenge Manager", to: "/challenge" },
        { title: "E-Learning Challenge Manager", to: "/elearn-challenge-manager"},
        { title: "Periode Manager", to: "/periode-manager" },
        { title: "Device Manager", to: "/device-manager" },
        { title: "Redeem Manager", to: "/redeem-manager" },
        { title: "Maintenance Manager", to: "/maintenance-manager" },
        { title: "User Review", to: "/review" },
        { title: "Package Manager", to: "/package-manager" },
        { title: "Message Manager", to: "/message-manager" },
      ]
    };
  },
  methods: {
    logoutFuction() {
      //Untuk logout dari akun
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      this.error_message = "Log Out Success";
      this.color = "green";
      this.snackbar = true;
      this.load = false;
      this.$router.push({
        name: "login",
      });
    },

    dashboardManager() {
      //Nama-nama menu dan route nya
      const user = JSON.parse(localStorage.getItem("user"))
      this.menus.map(menu => {
        if (+user.is_super === 1) {
          this.items.push(menu);
          return
        }
        const isExist = user.role.permissions.find(permit => permit.name === menu.title)
        if(isExist) {
          this.items.push(menu);
        }
      })
      if(+user.is_super === 1) {
        this.items.push({ title: "Admin Manager", to: "/admins-manager" })
        this.items.push({ title: "Role Manager", to: "/roles-manager" })
      }
    },
  },
  mounted() {
    this.dashboardManager();
  },
};
</script> 

<style scoped>
.fullheight {
  min-height: 100vh !important;
}
.router {
  text-decoration: none;
  color: white;
}
</style>