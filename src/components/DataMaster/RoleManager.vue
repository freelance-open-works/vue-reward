<template>
    <v-main class="font">
        <h1 align="center" class="mb-5">Role Manager</h1>
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
                                            v-model="editedItem.name"
                                            label="Name"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="6"
                                            sm="6"
                                            md="6" 
                                            v-for="permit in permissions"
                                            v-bind:key="permit.id">
                                            <v-checkbox
                                                v-model="permit.isChecked"
                                                :label="permit.name"
                                            ></v-checkbox>
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
                <v-icon
                    small
                    color="red"
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
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
                    { text: "Name", value: "name" },
                    { text: "Actions", value: "actions" },
            ],
            items: [],
            search: '',
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            permissions: [],
            editedItem: {
                id: '',
                name: '',
                permissions: []
            },
            defaultItem: {
                id: '',
                name: '',
                permissions: []
            },
            loading: true,
            snackbar: false,
            message: ''
        }
    },
    created () {
        this.initialize()
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Role' : 'Edit Role'
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
                this.$http.get(`${this.$api}/roles`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.items = res.data.data
                }).finally(() => {
                    this.loading = false
                })
                this.permissions = [
                    {name: "Dashboard", isChecked: false},
                    {name: "Users", isChecked: false},
                    {name: "User Challenge History", isChecked: false},
                    {name: "User E-Learning Challenge History", isChecked: false},
                    {name: "Catalog Manager", isChecked: false},
                    {name: "News Manager", isChecked: false},
                    {name: "Challenge Manager", isChecked: false},
                    {name: "E-Learning Challenge Manager" , isChecked: false},
                    {name: "Periode Manager", isChecked: false},
                    {name: "Device Manager", isChecked: false},
                    {name: "Redeem Manager", isChecked: false},
                    {name: "Maintenance Manager", isChecked: false},
                    {name: "User Review", isChecked: false},
                    {name: "Package Manager", isChecked: false},
                    {name: "Message Manager", isChecked: false},
                ]
        },
        save() {
            if(this.editedIndex === -1) {
                this.$http.post(`${this.$api}/roles`, {
                    name: this.editedItem.name,
                    permissions: this.permissions.filter(permit => permit.isChecked === true)
                },{
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.snackbar = true
                    this.message = res.data.message
                })
                .finally(() => {
                    this.initialize()
                    this.close()
                })
            } else {
                this.$http.put(`${this.$api}/roles/${this.editedItem.id}`, {
                    name: this.editedItem.name,
                    permissions: this.permissions.filter(permit => permit.isChecked === true)
                },{
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }
                ).then(res => {
                    this.snackbar = true
                    this.message = res.data.message 
                })
                .finally(() => {
                    this.initialize()
                    this.close()
                })
            }
        },
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.permissions = this.permissions.map(permit => {
                const isExist = item.permissions.find(i => i.name === permit.name)
                if(isExist) {
                    return { ...permit, isChecked: true}
                }
                return {...permit, isChecked: false}
            })
            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            this.$http.delete(`${this.$api}/roles/${this.editedItem.id}`, {
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
            this.permissions = this.permissions.map(i => {
                return {
                    ...i,
                    isChecked: false
                }
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