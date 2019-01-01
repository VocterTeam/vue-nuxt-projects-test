<template>
  <div class="edit-modal" v-if="settings.show">
    <div class="edit-modal__inner">
      <form action="#" id="edit-project-form" class="edit-project-form">
        <div class="edit-fields">
          <label for="edit-name" class="edit-form-label">Name</label>
          <input
            ref="edit-name-input"
            autofocus
            class="form-edit-field"
            type="text"
            id="edit-name"
            name="name"
            @change="editName"
            :value="settings.project.name" />
        </div>
  
        <div class="controls">
          <button type="button" class="controls-btn controls-btn--back" @click="close">Back</button>
          <button type="button" class="controls-btn controls-btn--save" @click.prevent="save">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['settings'],

  methods: {
    /**
     * event fires when the user changes the name of the project and changes the name from data
     * @param  {Event} $event - Event object
    */
    editName ($event) {
      let value = $event.currentTarget.value

      if (value) {
        this.$set(this.settings.data, 'name', value)
      }
    },

    /**
     * method fires when the user clicks on edit project
     * @param  {Object} project - current object the user clicked on
     * @param  {number} index - index of the current project in the array of projects
    */
    async save () {
      let updatedName = this.settings.data.name
      let projectId = this.settings.project.id
      let index = this.settings.index

      try {
        let response = await axios.put(`https://api.quwi.com/v2/projects-manage/update?id=${projectId}`, {name: updatedName}, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth ? this.$store.state.auth.accessToken : ''}`
          }
        })

        this.$emit('save', {
          project: response.data.project,
          index: index
        })

        this.close()

      } catch(e) {
        console.log('test', e)
      }
    },

    /**
     * method emits the close event to the parent
     */
    close () {
      this.$emit('close')
    }
  },

  mounted () {
    // set focus on name input by component's mount
    this.$refs['edit-name-input'].focus()
  }
}  
</script>

<style scoped>
  .edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .edit-modal__inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    padding: 20px;
    color: #000;
    background: #fff;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.44);
    transform: translate(-50%, -50%);
  }

  .form-edit-field {
    width: 340px;
    padding: 10px;
  }

  .edit-form-label {
    display: inline-block;
    margin-right: 55px;
  }

  .edit-fields {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .controls-btn {
    margin-left: 15px;
    min-width: 90px;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    height: 34px;
    padding: 0 15px;
    border-radius: 4px;
    font-weight: 700;
  }

  .controls-btn:hover {
      opacity: .7;
  }

  .controls-btn--back {
    background-color: #cecece;
    border: 1px solid #bebebe;
    text-shadow: 1px 1px 0 #ccc;
  }

  .controls-btn--save {
    margin-right: 0;
    color: #fff;
    background: #395378;
  }
</style>