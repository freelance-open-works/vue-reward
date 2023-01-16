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
      blue: '#6495ED'
    };
  },
  methods: {
    logoutFuction() {
      //Untuk logout dari akun
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
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
      this.items.push({ title: "Dashboard", to: "/dashboard" });
      this.items.push({ title: "Users", to: "/users" });
      this.items.push({ title: "User Challenge History", to: "/uchistory" });
      this.items.push({ title: "User E-Learning Challenge History", to: "/elearn" });
      this.items.push({ title: "Catalog Manager", to: "/catalogue" });
      this.items.push({ title: "News Manager", to: "/news-manager" });
      this.items.push({ title: "Challenge Manager", to: "/challenge" });
      this.items.push({ title: "E-Learning Challenge Manager", to: "/elearn-challenge-manager"});
      this.items.push({ title: "Periode Manager", to: "/periode-manager" });
      this.items.push({ title: "Device Manager", to: "/device-manager" });
      this.items.push({ title: "Redeem Manager", to: "/redeem-manager" });
      this.items.push({ title: "Maintenance Manager", to: "/maintenance-manager" });
      this.items.push({ title: "User Review", to: "/review" });
      this.items.push({ title: "Package Manager", to: "/package-manager" });
      this.items.push({ title: "Message Manager", to: "/message-manager" });
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