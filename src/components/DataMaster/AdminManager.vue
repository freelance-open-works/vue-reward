<template>
    <v-main class="font">
        <h1 align="center" class="mb-5">Admin Manager</h1>
        <template>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            sort-by="id"
            class="elevation-1"
            :loading="loading"
            loading-text="Loading... Please wait"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <!-- title was here -->
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog
                        v-model="dialog"
                        max-width="50%"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                v-bind="attrs"
                                v-on="on"
                            >
                                New
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

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
                                            <v-select
                                            v-show="+editedItem.is_super === 0"
                                            :items="roles"
                                            :error-messages="errors.role_id"
                                            v-model="editedItem.role"
                                            item-text="name"
                                            item-value="id"
                                            label="Role"
                                            return-object
                                            required
                                            ></v-select>
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
                                    @click="close"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="save"
                                >
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    color="yellow"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <span v-show="+item.is_super === 0">
                    <v-icon
                        small
                        color="red"
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </span>
            </template>
            <template v-slot:no-data>
                <v-btn
                    color="primary"
                    @click="initialize"
                >
                    Refresh
                </v-btn>
            </template>
        </v-data-table>
        <v-snackbar v-model="snackbar" timeout="2000" bottom>
        {{ message }}
        </v-snackbar>
        </template>
    </v-main>
    
</template>

<script>
export default {
    data() {
        return {
            headers: [
                    {
                        text: "ID",
                        align: "start",
                        sortable: true,
                        value: "id",
                    },
                    { text: "Username", value: "username" },
                    { text: "Role", value: "role.name" },
                    { text: "Actions", value: "actions" },
            ],
            items: [],
            search: '',
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            roles: [],
            editedItem: {
                id: '',
                username: '',
                password: '',
                password_confirmation: '',
                role: '',
                is_super: 0
            },
            defaultItem: {
                id: '',
                username: '',
                password: '',
                password_confirmation: '',
                role: '',
                is_super: 0
            },
            loading: true,
            snackbar: false,
            message: '',
            errors: []
        }
    },
    created () {
        this.initialize()
        this.getRoles()
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Admin' : 'Edit Admin'
        },
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
    },
    methods: {
        initialize() {
                this.$http.get(`${this.$api}/user-admins`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.items = res.data.data
                }).finally(() => {
                    this.loading = false
                })
        },
        getRoles() {
                this.$http.get(`${this.$api}/roles`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.roles = res.data.data
                })
        },
        save() {
            if(this.editedIndex === -1) {
                this.$http.post(`${this.$api}/user-admins`, {
                    username: this.editedItem.username,
                    password: this.editedItem.password,
                    password_confirmation: this.editedItem.password_confirmation,
                    role_id: this.editedItem.role.id
                },{
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.snackbar = true
                    this.message = res.data.message
                    this.close()
                }).catch(err => {
                    this.snackbar = true
                    this.message = err.response.data.message
                    this.errors = err.response.data.errors
                })
                .finally(() => {
                    this.initialize()
                })
            } else {
                this.$http.put(`${this.$api}/user-admins/${this.editedItem.id}`, {
                    username: this.editedItem.username,
                    password: this.editedItem.password,
                    password_confirmation: this.editedItem.password_confirmation,
                    role_id: this.editedItem.role.id
                },{
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.snackbar = true
                    this.message = res.data.message 
                    this.close()
                }).catch(err => {
                    this.snackbar = true
                    this.message = err.response.data.message
                    this.errors = err.response.data.errors
                })
                .finally(() => {
                    this.initialize()
                })
            }
        },
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            this.$http.delete(`${this.$api}/user-admins/${this.editedItem.id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            ).then(() => {
                this.initialize()
            })
            .finally(() => {
                this.closeDelete()
            })
        },
        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
    }
}
</script>