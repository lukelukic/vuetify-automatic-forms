<template>
  <div>
    <ApiTable
      ref="table"
      v-bind="$props"
      :api="{ endpoint: resource }"
      :excludedHeaders="excludedHeaders"
      :useCustomDialog="customDialog != undefined"
    >
      <template v-slot:header>
        <v-btn
          v-if="useInsert"
          :color="addBtn.color"
          small
          @click="createItem"
          >{{ translate(addBtn.text) }}</v-btn
        >
        <slot></slot>
      </template>
      <template v-if="customDialog" v-slot:dialog="item">
        <v-icon @click="openCustomDialog(item)">
          {{ customDialog.icon }}
        </v-icon>
      </template>
      <template v-if="useEdit || useDelete" v-slot:action="item">
        <v-icon
          v-if="useEdit"
          color="orange"
          class="mr-2"
          @click="editItem(item.id)"
        >
          mdi-pencil
        </v-icon>
        <v-icon v-if="useDelete" color="red" @click="deleteItem(item.id)">
          mdi-delete
        </v-icon>
      </template>
    </ApiTable>
    <slot name="page-bottom"></slot>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{
          translate(messages.deleteConfirmMessage)
        }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">{{
            translate(messages.deleteNo)
          }}</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{
            translate(messages.deleteYes)
          }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEdit"
      v-if="dialogEdit"
      max-width="500px"
      :fullscreen="fullscreen"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ translate('$restTable.edit') }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon @click="dialogEdit = false">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3">
          <RestUpdateForm
            :formElements="editFormElements"
            :resource="resource"
            :id="toUpdate"
            @success="updateSuccess"
            @error="updateError"
            :submit="updateSubmit"
            :cancel="updateCancel"
            @formReset="dialogEdit = false"
            :extractErrorsFn="extractUpdateErrors"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="dialogCreate"
      v-model="dialogCreate"
      max-width="500px"
      :fullscreen="fullscreen"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{
            translate('$restTable.create')
          }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon @click="closeCreateDialog">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3">
          <ApiForm
            ref="insertForm"
            :formElements="insertFormElements"
            :endpoint="resource"
            :successFn="createSuccess"
            :errorFn="updateError"
            :submit="insertSubmit"
            :cancel="insertCancel"
            @formReset="dialogCreate = false"
            :extractErrorsFn="extractInsertErrors"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="customDialog"
      v-model="dialogCustom"
      max-width="500px"
      :fullscreen="fullscreen"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Custom</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon @click="closeCustomDialog">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3">
          <component
            :is="customDialog.component"
            :data="customDialogData"
            @close="dialogCustom = false"
          ></component>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import restTableDefaults from './internals/restTableDefaults'
import localizationMixin from './internals/localizationMixin'
export default {
  name: 'RestTable',
  props: restTableDefaults.props,
  mixins: [localizationMixin],
  data() {
    return {
      dialogDelete: false,
      dialogEdit: false,
      dialogCustom: false,
      toDelete: undefined,
      toUpdate: undefined,
      deleteLoading: false,
      snackbar: false,
      dialogCreate: false,
      customDialogData: {}
    }
  },
  computed: {
    fullscreen() {
      return !['lg', 'xl'].includes(this.$vuetify.breakpoint.name)
    },
    insertSubmit() {
      return {
        text: this.insertOpts.submitText,
        color: this.insertOpts.submitColor
      }
    },
    insertCancel() {
      return {
        text: this.insertOpts.cancelText,
        color: this.insertOpts.cancelColor
      }
    },
    updateSubmit() {
      return {
        text: this.updateOpts.submitText,
        color: this.updateOpts.submitColor
      }
    },
    updateCancel() {
      return {
        text: this.updateOpts.cancelText,
        color: this.updateOpts.cancelColor
      }
    }
  },
  methods: {
    closeCreateDialog() {
      this.dialogCreate = false
      this.$refs.insertForm.resetForm()
    },
    closeCustomDialog() {
      this.dialogCustom = false
    },
    openCustomDialog(dialogData) {
      this.dialogCustom = true
      this.customDialogData = dialogData
    },
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
      this.$emit('updateSuccess')
      this.$refs.table.refreshTable()
    },
    updateError: function() {
      this.snackbar = true
    },
    createSuccess: function() {
      this.dialogCreate = false
      this.$emit('createSuccess')
      this.$refs.table.refreshTable()
    }
  }
}
</script>

<style></style>
