<template>
  <div>
    <ApiTable
      ref="table"
      v-bind="$props"
      :api="{ endpoint: resource }"
      :excludedHeaders="excludedHeaders"
    >
      <template v-slot:header>
        <v-btn color="primary" small @click="createItem">Create new</v-btn>
      </template>
      <template v-slot:action="item">
        <v-icon class="mr-2" @click="editItem(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon @click="deleteItem(item.id)">
          mdi-delete
        </v-icon>
      </template>
    </ApiTable>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline" v-if="!deleteLoading"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-text class="pt-6">
          <RestUpdateForm
            :formElements="editFormElements"
            :resource="resource"
            :id="toUpdate"
            @success="updateSuccess"
            @error="updateError"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCreate" max-width="500px">
      <v-card>
        <v-card-text class="pt-6">
          <ApiForm
            :formElements="editFormElements"
            :endpoint="resource"
            :successFn="createSuccess"
            :errorFn="updateError"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      There was an error executing your request.

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import restTableDefaults from './internals/restTableDefaults'
export default {
  name: 'RestTable',
  props: restTableDefaults.props,
  data() {
    return {
      dialogDelete: false,
      dialogEdit: false,
      toDelete: undefined,
      toUpdate: undefined,
      deleteLoading: false,
      snackbar: false,
      dialogCreate: false
    }
  },
  mounted() {},
  methods: {
    createItem() {
      this.dialogCreate = true
    },
    editItem(id) {
      this.toUpdate = id
      this.dialogEdit = true
    },
    deleteItem(id) {
      this.toDelete = id
      this.dialogDelete = true
    },
    closeDelete: function() {
      ;(this.toDelete = undefined), (this.dialogDelete = false)
    },
    deleteItemConfirm: async function() {
      await this.$formBuilderAxios.delete(this.resource + `/${this.toDelete}`)
      this.toDelete = undefined
      this.dialogDelete = false
      this.$refs.table.refreshTable()
    },
    updateSuccess: function() {
      this.dialogEdit = false
      this.$refs.table.refreshTable()
    },
    updateError: function() {
      this.snackbar = true
    },
    createSuccess: function() {
      this.dialogCreate = false
      this.$refs.table.refreshTable()
    }
  }
}
</script>

<style></style>
