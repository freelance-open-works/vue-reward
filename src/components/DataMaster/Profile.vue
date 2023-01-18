<template>
    <v-main class="font">
        <h1 align="center" class="mb-5">Profile</h1>
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-row no-gutters>
                            <v-col
                                cols="12"
                                sm="12"
                                md="12"
                            >
                                <v-text-field
                                v-model="editedItem.username"
                                label="Username"
                                :error-messages="errors.username"
                                required
                                ></v-text-field>
                                <v-text-field
                                v-model="editedItem.password"
                                type="password"
                                label="Password"
                                :error-messages="errors.password"
                                required
                                ></v-text-field>
                                <v-text-field
                                v-model="editedItem.password_confirmation"
                                :error-messages="errors.password_confirmation"
                                type="password"
                                label="Password Confirmation"
                                required
                                ></v-text-field>
                            </v-col>
                            
                        </v-row>
                        <!-- <div class="d-flex align-content-start flex-wrap"> -->
                            
                        <!-- </div> -->
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        <v-snackbar v-model="snackbar" timeout="2000" bottom>
        {{ message }}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            editedItem: {
                id: '',
                username: '',
                password: '',
                password_confirmation: '',
                role: '',
                is_super: 0
            },
            snackbar: false,
            message: '',
            errors: []
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        initialize() {
            const user = JSON.parse(localStorage.getItem('user'))
            this.editedItem.id = user.id
            this.editedItem.username = user.username
            this.editedItem.role_id = user.role_id
        },
        save() {
            this.$http.put(`${this.$api}/user-admins/${this.editedItem.id}`, {
                username: this.editedItem.username,
                password: this.editedItem.password,
                password_confirmation: this.editedItem.password_confirmation,
                role_id: this.editedItem.role_id
            },{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            ).then(res => {
                this.snackbar = true
                this.message = res.data.message 
            }).catch(err => {
                this.snackbar = true
                this.message = err.response.data.message
                this.errors = err.response.data.errors
            })
            .finally(() => {
                this.initialize()
            })
        },
    }
}
</script>